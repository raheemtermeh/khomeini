import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import avatar from "../assets/mmdi.jpg"; // (فرض می‌کنیم آواتار در این مسیر است)

// کامپوننت برای نمایش اطلاعات بالای صفحه
const InfoChip = ({
  icon,
  text,
  className = "",
}: {
  icon: React.ReactNode;
  text: string;
  className?: string;
}) => (
  <div
    className={`flex items-center gap-2 text-gray-700 dark:text-gray-300 ${className}`}
  >
    {icon}
    <span className="font-semibold">{text}</span>
  </div>
);

// کامپوننت برای نمایش تایمر
const CountdownTimer = () => {
  // این بخش برای نمایش زمان پویا نیاز به یک state و useEffect دارد
  // در اینجا برای سادگی به صورت استاتیک نمایش داده شده
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl text-center">
      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
        مانده تا برگزاری...
      </div>
      <div className="flex justify-center items-baseline gap-1">
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          <span className="w-8 inline-block">01</span>:
          <span className="w-8 inline-block">12</span>:
          <span className="w-8 inline-block">44</span>:
          <span className="w-8 inline-block">28</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-around mt-1">
        <span>ثانیه</span>
        <span>دقیقه</span>
        <span>ساعت</span>
        <span>روز</span>
      </div>
    </div>
  );
};

const OrderDetailsPage = () => {
  const participants = [
    {
      id: 1,
      name: "زهرا نصاری",
      avatar,
      orderId: "SF542365",
      tickets: 5,
      date: "1403/02/23 - 22:19",
      amount: "500,000 تومان",
    },
    // بقیه شرکت کنندگان را می‌توان به صورت داینامیک اضافه کرد
    ...Array(4).fill(null),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
      {/* بخش هدر */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            مافیا
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">game66</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <InfoChip
            icon={<IoPeopleOutline size={20} />}
            text="ظرفیت (30 نفر)"
          />
          <InfoChip icon={<IoCalendarOutline size={20} />} text="28 اردیبهشت" />
          <InfoChip icon={<IoTimeOutline size={20} />} text="22:00" />
        </div>
        <div className="w-full sm:w-auto">
          <CountdownTimer />
        </div>
      </div>

      {/* بخش جدول شرکت کنندگان */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
            لیست شرکت‌کنندگان
          </h2>
          <div className="bg-red-100 text-primary-red font-bold text-sm py-1 px-3 rounded-full">
            باقی مانده 5 نفر
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-primary-red">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-r-lg">
                  ردیف
                </th>
                <th scope="col" className="px-6 py-3">
                  نام کاربری
                </th>
                <th scope="col" className="px-6 py-3">
                  تعداد
                </th>
                <th scope="col" className="px-6 py-3">
                  شماره سفارش
                </th>
                <th scope="col" className="px-6 py-3">
                  تاریخ و ساعت رزرو
                </th>
                <th scope="col" className="px-6 py-3 rounded-l-lg">
                  مبلغ کل
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr
                  key={participant?.id || index}
                  className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  {participant ? (
                    <>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-semibold">
                          {participant.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">{participant.tickets}</td>
                      <td className="px-6 py-4">{participant.orderId}</td>
                      <td className="px-6 py-4">{participant.date}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {participant.amount}
                      </td>
                    </>
                  ) : (
                    // ردیف‌های خالی برای نمایش جای خالی
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      -
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
