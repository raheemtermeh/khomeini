// src/components/layout/DashboardLayout.tsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // فرض بر وجود Sidebar
import Header from "./Header"; // فرض بر وجود Header
import ConfirmationModal from "../confirm/ConfirmationModal"; // فرض بر وجود ConfirmationModal

interface Props {
  onLogout: () => void;
}

const DashboardLayout = ({ onLogout }: Props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // این تابع فقط مودال را باز می‌کند
  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  // این تابع بعد از تایید کاربر، مودال را می‌بندد و خروج را انجام می‌دهد
  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    onLogout(); // <-- اینجا تابع اصلی خروج که از App.tsx آمده فراخوانی می‌شود
  };

  return (
    <div
      dir="rtl"
      className="bg-gray-100 dark:bg-gray-900 min-h-screen relative lg:flex"
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* پراپ onLogoutClick به سایدبار پاس داده می‌شود */}
      <Sidebar
        onLogoutClick={handleLogoutClick}
        isOpen={isSidebarOpen}
        // ✅ تصحیح نام تابع از setIsSidebarOpen به setSidebarOpen
        onCloseSidebar={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* مودال اینجا رندر می‌شود و با تغییر استیت نمایش داده می‌شود */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="خروج از حساب کاربری"
      >
        <p>آیا برای خروج از حساب کاربری خود اطمینان دارید؟</p>
      </ConfirmationModal>
    </div>
  );
};

export default DashboardLayout;