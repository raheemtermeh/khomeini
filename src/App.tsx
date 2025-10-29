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
import Financialanalysis from "./pages/Financialanalysis";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import InventoryPage from "./pages/InventoryPage";

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
              <Route index element={<Financialanalysis />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route
                path="financial-report"
                element={<FinancialReportPage />}
              />
              <Route
                path="events"
                element={<EventsPage />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cafe" element={<CafeInfo />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="InventoryPage" element={<InventoryPage />} />
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