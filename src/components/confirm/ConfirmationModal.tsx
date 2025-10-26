import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}: Props) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose} // بستن مودال با کلیک روی پس‌زمینه
    >
      {/* Modal content */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بستن مودال با کلیک روی محتوای آن
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
        <div className="text-gray-600 dark:text-gray-300 mb-6">{children}</div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-primary-red text-white font-semibold hover:bg-red-700 transition-colors"
          >
            تایید و خروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
