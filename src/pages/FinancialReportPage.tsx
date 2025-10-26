import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { IoChevronDown } from "react-icons/io5";

// تصویر آواتار برای بازی‌ها
import mafiaImage from "../assets/game-image.jpg"; // (یک تصویر پیش‌فرض)
import ludoImage from "../assets/mmdi.jpg"; // (یک تصویر پیش‌فرض دیگر)

// کامپوننت برای نمایش وضعیت پرداخت
const StatusBadge = ({ status }: { status: "paid" | "pending" }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
  const statusClasses = {
    paid: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100",
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status === "paid" ? "پرداخت شده" : "در انتظار"}
    </span>
  );
};

const FinancialReportPage = () => {
  const [filter, setFilter] = useState("monthly");

  // داده‌های استاتیک بیشتر برای نمایش
  const reportData = [
    {
      id: 1,
      gameName: "مافیا",
      gameImage: mafiaImage,
      dateTime: "۱۴۰۳/۰۸/۰۵ - ۱۶:۵۳ بعد از ظهر",
      participants: 4,
      amount: "۸۰۰,۰۰۰ تومان",
      status: "paid" as "paid" | "pending",
    },
    {
      id: 2,
      gameName: "منچ",
      gameImage: ludoImage,
      dateTime: "۱۴۰۲/۰۸/۲۵ - ۱۰:۳۰ صبح",
      participants: 2,
      amount: "۸۰۰,۰۰۰ تومان",
      status: "pending" as "paid" | "pending",
    },
    {
      id: 3,
      gameName: "مافیا",
      gameImage: mafiaImage,
      dateTime: "۱۴۰۳/۰۷/۱۵ - ۲۰:۰۰ شب",
      participants: 8,
      amount: "۱,۶۰۰,۰۰۰ تومان",
      status: "paid" as "paid" | "pending",
    },
    {
      id: 4,
      gameName: "منچ",
      gameImage: ludoImage,
      dateTime: "۱۴۰۳/۰۷/۱۰ - ۱۱:۰۰ صبح",
      participants: 4,
      amount: "۴۰۰,۰۰۰ تومان",
      status: "paid" as "paid" | "pending",
    },
    {
      id: 5,
      gameName: "مافیا",
      gameImage: mafiaImage,
      dateTime: "۱۴۰۳/۰۶/۲۱ - ۱۷:۳۰ بعد از ظهر",
      participants: 6,
      amount: "۱,۲۰۰,۰۰۰ تومان",
      status: "pending" as "paid" | "pending",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full mx-auto">
      {/* بخش فیلترها */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          جزئیات فروش
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none cursor-pointer w-full md:w-auto bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-primary-red"
            >
              <option value="monthly">ماهانه</option>
              <option value="yearly">سالانه</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <IoChevronDown />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              از:
            </span>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              placeholder="اردیبهشت"
              inputClass="w-28 bg-gray-100 dark:bg-gray-700 text-center p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-red"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              تا:
            </span>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              placeholder="بهمن"
              inputClass="w-28 bg-gray-100 dark:bg-gray-700 text-center p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-red"
            />
          </div>
        </div>
      </div>

      {/* جدول گزارش */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 rounded-r-lg min-w-[150px] text-right"
              >
                نام بازی
              </th>
              <th scope="col" className="px-6 py-3 min-w-[200px]">
                تاریخ - زمان
              </th>
              <th scope="col" className="px-6 py-3">
                تعداد
              </th>
              <th scope="col" className="px-6 py-3">
                مبلغ
              </th>
              <th scope="col" className="px-6 py-3 rounded-l-lg">
                وضعیت
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item) => (
              <tr
                key={item.id}
                className="border-b dark:border-gray-700 last:border-0"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-right">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.gameImage}
                      alt={item.gameName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{item.gameName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{item.dateTime}</td>
                <td className="px-6 py-4">{item.participants} نفر</td>
                <td className="px-6 py-4">{item.amount}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReportPage;
