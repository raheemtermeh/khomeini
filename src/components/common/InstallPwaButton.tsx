import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi"; // یک آیکون برای زیبایی

const InstallPwaButton = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // 3. تابع برای مدیریت کلیک
  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    // نمایش پیام نصب مرورگر
    const result = await installPrompt.prompt();
    console.log(`Install prompt result: ${result.outcome}`);

    // بعد از نمایش پیام، دیگر به رویداد نیازی نیست
    setInstallPrompt(null);
  };

  if (!installPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
    >
      <FiDownload />
      <span>نصب اپلیکیشن</span>
    </button>
  );
};

export default InstallPwaButton;
