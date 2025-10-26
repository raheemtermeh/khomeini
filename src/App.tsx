// src/App.tsx

import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import PwaReloadPrompt from "./components/common/PwaReloadPrompt";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Roleprivacy from "./pages/Roleprivacy";
import About from "./pages/About";
import CafeInfo from "./pages/CafeInfo";

const EventsPage = lazy(() => import("./pages/EventsPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const FinancialReportPage = lazy(() => import("./pages/FinancialReportPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ReportIssuePage = lazy(() => import("./pages/ReportIssuePage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));

function App() {
  // ✨ تغییر 1: مقداردهی اولیه `isLoggedIn` بر اساس وجود Access Token
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { mode } = useAppSelector((state) => state.theme);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      alert("✅ اینترنت وصل شد");
    };

    const handleOffline = () => {
      setIsOnline(false);
      alert("🚫 اتصال به اینترنت قطع شد");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // ✨ تغییر 2: اگر در رفرش اولیه، Access Token وجود داشت و معتبر بود،
    // می‌توانستید در اینجا یک تماس API برای اعتبارسنجی توکن بگذارید.
    // اما برای سادگی، فعلاً فقط بر اساس وجود آن عمل می‌کنیم.

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // این useEffect فقط یک بار هنگام Mount شدن اجرا می‌شود

  // جلوگیری از رندر در حالت آفلاین
  if (!isOnline) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-500 bg-gray-900">
        🚫 اتصال اینترنت قطع است. لطفاً اینترنت خود را بررسی کنید.
      </div>
    );
  }

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    // ✨ تغییر 3: حذف توکن‌ها هنگام خروج دستی
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
  };

  return (
    <>
      <PwaReloadPrompt />

      <Suspense fallback={<LoadingSpinner />}>
        {isLoggedIn ? (
          <Routes>
            <Route
              path="/"
              element={<DashboardLayout onLogout={handleLogout} />}
            >
              <Route index element={<EventsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route
                path="financial-report"
                element={<FinancialReportPage />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cafe" element={<CafeInfo />} />
              <Route path="report-issue" element={<ReportIssuePage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="privacy" element={<Roleprivacy />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        ) : (
          <Routes>
            <Route
              path="*"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
          </Routes>
        )}
      </Suspense>
    </>
  );
}

export default App;
