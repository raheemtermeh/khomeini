import { useState } from "react";
import { IoReload } from "react-icons/io5";

function PwaReloadPrompt() {
  // جایگزین useRegisterSW با useState معمولی
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  // هیچ SW ای ثبت یا آپدیت نمی‌شه
  const updateServiceWorker = (_: boolean) => {};

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 m-4 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 z-50">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {needRefresh ? (
            <p className="text-sm text-gray-800 dark:text-gray-200">
              نسخه جدیدی از برنامه در دسترس است!
            </p>
          ) : (
            <p className="text-sm text-gray-800 dark:text-gray-200">
              برنامه برای استفاده آفلاین آماده است.
            </p>
          )}
        </div>
        {needRefresh && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => updateServiceWorker(true)}
          >
            <IoReload />
            <span>به‌روزرسانی</span>
          </button>
        )}
        <button
          className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          onClick={close}
        >
          بستن
        </button>
      </div>
    </div>
  );
}

export default PwaReloadPrompt;
