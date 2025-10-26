import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

// داده‌های استاتیک برای سوالات و جواب‌ها
const faqData = [
  {
    id: 1,
    question: "چطور می‌تونم رمز عبورم رو تغییر بدم؟",
    answer:
      "برای تغییر رمز عبور، به بخش پروفایل خود مراجعه کرده و روی گزینه 'تغییر رمز عبور' کلیک کنید. سپس دستورالعمل‌ها را دنبال کنید.",
  },
  {
    id: 2,
    question: "چطور می‌تونم گزارش‌های ماهانه رو دانلود کنم؟",
    answer:
      "از منوی گزارش‌ها، بازه زمانی مورد نظرتون رو انتخاب کنید و روی دکمه‌ی «دانلود PDF» یا «دانلود Excel» کلیک کنید تا فایل مورد نظر ذخیره بشه.",
  },
  {
    id: 3,
    question: "آیا امکان لغو سفارش وجود دارد؟",
    answer:
      "بله، شما می‌توانید تا ۲۴ ساعت قبل از زمان برگزاری رویداد، سفارش خود را از طریق پنل کاربری لغو کرده و وجه خود را به صورت کامل دریافت نمایید.",
  },
  {
    id: 4,
    question: "چگونه می‌توانم یک رویداد جدید ایجاد کنم؟",
    answer:
      "از منوی اصلی، گزینه 'رویدادها' را انتخاب کرده و سپس بر روی دکمه 'ایجاد بازی' کلیک کنید. فرم مربوطه را پر کرده و اطلاعات رویداد خود را ثبت نمایید.",
  },
  {
    id: 5,
    question: "پشتیبانی در چه ساعت‌هایی پاسخگو است؟",
    answer:
      "تیم پشتیبانی ما همه روزه از ساعت ۹ صبح الی ۱۰ شب آماده پاسخگویی به سوالات شما عزیزان می‌باشد.",
  },
];

// کامپوننت برای هر آیتم آکاردئون
const AccordionItem = ({
  item,
  isOpen,
  onClick,
}: {
  item: any;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-right p-4 focus:outline-none"
      >
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {item.id}. {item.question}
        </h3>
        <IoChevronDown
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-4 pt-0">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FaqPage = () => {
  const [openId, setOpenId] = useState<number | null>(2); // سوال دوم به صورت پیش‌فرض باز است

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-4xl mx-auto border-t-4 border-blue-500 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          سوالات متداول
        </h1>
        <div className="space-y-2">
          {faqData.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onClick={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
