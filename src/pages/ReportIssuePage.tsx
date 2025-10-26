import { useState } from "react";

// کامپوننت برای هر فیلد ورودی
const InputField = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center border-b border-gray-200 dark:border-gray-700 py-4">
    <label className="w-full sm:w-40 text-right font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-red"
    />
  </div>
);

// کامپوننت برای ادیتور متن
const RichTextEditor = () => {
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="flex flex-col sm:flex-row items-start pt-4">
      <label className="w-full sm:w-40 text-right font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
        توضیحات
      </label>
      <div className="w-full">
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg">
          <textarea
            rows={6}
            maxLength={300}
            onChange={(e) => setCharCount(e.target.value.length)}
            className="w-full bg-transparent p-3 focus:outline-none resize-none"
            placeholder="توضیحات خود را اینجا وارد کنید..."
          ></textarea>
          <div className="text-sm text-left w-full px-3 pb-2 text-gray-500 dark:text-gray-400">
            {charCount} / 300
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportIssuePage = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full mx-auto border-t-4 border-blue-500 p-6">
        <form>
          <InputField
            label="نام و نام خانوادگی"
            placeholder="نام خود را وارد کنید..."
          />
          <InputField
            label="شماره تماس"
            placeholder="شماره تماس خود را وارد کنید..."
          />
          <InputField
            label="شماره سفارش"
            placeholder="شماره سفارش خود را وارد کنید..."
          />
          <RichTextEditor />
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-primary-red text-white font-bold py-2 px-8 rounded-lg hover:bg-red-700 transition-colors"
            >
              ارسال
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssuePage;
