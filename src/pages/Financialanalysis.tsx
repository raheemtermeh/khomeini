import React from 'react';
import { IoBarChartOutline, IoPeopleOutline, IoCalendarOutline, IoTrendingUp, IoArrowUpOutline, IoArrowDownOutline, IoTimeOutline, IoCheckmarkCircleOutline, IoLocationOutline } from 'react-icons/io5';
import { FiDollarSign, FiZap } from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// ثبت اجزای مورد نیاز Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// =================================================================
// 📊 داده‌های استاتیک برای شبیه‌سازی طرح
// =================================================================

const topStats = [
  {
    icon: FiDollarSign,
    title: 'درآمد کل',
    value: '۲۴.۳۴۴ تومان',
    percentage: 18.3,
    isPositive: true,
    color: 'bg-orange-500',
    statColor: 'text-orange-500',
  },
  {
    icon: IoPeopleOutline,
    title: 'کل شرکت‌کنندگان',
    value: '۳,۴۶۷',
    percentage: 25.8,
    isPositive: true,
    color: 'bg-blue-600',
    statColor: 'text-blue-600',
  },
  {
    icon: FiZap,
    title: 'رویدادهای فعال',
    value: '۸',
    percentage: 3.2,
    isPositive: true,
    color: 'bg-teal-500',
    statColor: 'text-teal-500',
  },
  {
    icon: IoCalendarOutline,
    title: 'کل رویدادها',
    value: '۱۲۳',
    percentage: 12.5,
    isPositive: true,
    color: 'bg-purple-600',
    statColor: 'text-purple-600',
  },
];

const activityData = [
  { title: 'مریم کریمی رویداد جدید ایجاد کرد', time: '۱۰ دقیقه پیش', user: 'مریم کریمی', status: 'ایجاد رویداد' },
  { title: 'علی محمدی ثبت‌نام خود را لغو کرد', time: '۲ ساعت پیش', user: 'علی محمدی', status: 'لغو ثبت‌نام' },
  { title: 'شب شعر مدرن', time: '۴ ساعت پیش', user: 'شب شعر مدرن', status: 'ورود به سامانه' },
  { title: 'سارا حسینی رویداد را به‌روزرسانی کرد', time: '۵ ساعت پیش', user: 'سارا حسینی', status: 'آپدیت ایونت' },
  { title: 'حسین رضایی در رویداد ثبت‌نام کرد', time: '۶ ساعت پیش', user: 'حسین رضایی', status: 'ثبت‌نام جدید' },
  { title: 'فاطمه نوری نظر جدید ثبت کرد', time: '۸ ساعت پیش', user: 'فاطمه نوری', status: 'ثبت کامنت' },
];

const upcomingEvents = [
  { 
    title: 'شب موسیقی زنده', 
    category: 'موسیقی سنتی', 
    date: '۱۴۰۲/۰۸/۲۲', 
    time: '۲۰:۰۰',
    capacity: '۴۵/۵۰', 
    progress: 90, 
    color: 'text-teal-500',
    location: 'سالن اصلی'
  },
  { 
    title: 'ورکشاپ قهوه‌سازان حرفه‌ای', 
    category: 'ورکشاپ', 
    date: '۱۴۰۲/۰۸/۲۲', 
    time: '۱۹:۰۰',
    capacity: '۲۰/۲۰', 
    progress: 100, 
    color: 'text-orange-500',
    location: 'فضای آموزش'
  },
  { 
    title: 'شب شعر مدرن', 
    category: 'شعر', 
    date: '۱۴۰۲/۰۸/۲۲', 
    time: '۱۹:۴۵',
    capacity: '۱۳/۴۰', 
    progress: 38, 
    color: 'text-purple-500',
    location: 'سالن اصلی'
  },
  { 
    title: 'نمایش استعداد کمدی', 
    category: 'نمایش', 
    date: '۱۴۰۲/۰۸/۲۵', 
    time: '۲۱:۰۰',
    capacity: '۳۸/۵۰', 
    progress: 76, 
    color: 'text-red-500',
    location: 'سالن اصلی'
  },
];

const categoryLegendItems = [
    { label: 'شب شعر', color: '#EC4899', percentage: 20 },
    { label: 'موسیقی زنده', color: '#34D399', percentage: 25 },
    { label: 'ورکشاپ', color: '#6366F1', percentage: 35 },
    { label: 'تئاتر', color: '#FBBF24', percentage: 15 },
    { label: 'دیگر', color: '#9CA3AF', percentage: 5 },
];


// =================================================================
// 🎨 کامپوننت‌های کمکی
// =================================================================

// 📊 کامپوننت کارت آمار بالایی (بدون تغییر)
const StatCard = ({ icon: Icon, title, value, percentage, isPositive, color, statColor }: typeof topStats[0] & { icon: React.ElementType }) => (
  <div className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border-t-4 ${color} transition-all duration-300 hover:shadow-xl`}>
    <div className="flex justify-between items-center mb-3">
      <div className={`p-3 rounded-full ${color.replace('bg-', 'bg-')} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${statColor}`} />
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {title}
      </span>
    </div>
    
    <div className="flex flex-col">
      <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-1" dir="ltr">
        {value}
      </div>
      <div className="flex items-center text-sm font-semibold">
        {isPositive ? (
          <IoArrowUpOutline className="w-4 h-4 text-green-500 ml-1" />
        ) : (
          <IoArrowDownOutline className="w-4 h-4 text-red-500 ml-1" />
        )}
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
          {percentage}%
        </span>
        <span className="text-gray-500 dark:text-gray-400 mr-1">از ماه قبل</span>
      </div>
    </div>
  </div>
);

// 📈 نمودار خطی شرکت کنندگان (با استایل Dark Mode بهتر)
const ParticipantChart = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#E5E7EB' : '#4B5563'; // gray-200 / gray-600
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB'; // gray-700 / gray-200

  const chartData = {
    labels: ['۱۵ مهر', '۲۰ مهر', '۲۵ مهر', '۳۰ مهر', '۵ آبان', '۱۰ آبان'],
    datasets: [
      {
        label: 'تعداد شرکت کنندگان',
        data: [100, 500, 300, 800, 600, 1000],
        fill: true,
        backgroundColor: 'rgba(52, 211, 153, 0.2)', 
        borderColor: 'rgb(52, 211, 153)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(52, 211, 153)',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: textColor }
        },
        y: {
            grid: { color: gridColor },
            ticks: { color: textColor }
        }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-96">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center justify-between">
        آمار رویدادها و شرکت کنندگان
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          روند ۶ ماه اخیر
        </span>
      </h3>
      <div className="h-[85%]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// 🍩 نمودار دایره‌ای دسته‌بندی‌ها (با جزئیات طرح)
const CategoryChart = () => {
  const data = {
    labels: categoryLegendItems.map(item => item.label),
    datasets: [
      {
        data: categoryLegendItems.map(item => item.percentage),
        backgroundColor: categoryLegendItems.map(item => item.color),
        borderWidth: 0,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    cutout: '70%', 
  };

  // ✅ اضافه کردن عنصر مرکزی و چیدمان دقیق لیست
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-96 flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
        دسته‌بندی پرطرفدار رویدادها
      </h3>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 mb-6">
          <Doughnut data={data} options={options} />
          {/* عنصر مرکزی */}
          <div className="absolute inset-0 flex items-center justify-center text-center">
             <div className="flex flex-col items-center">
                <span className="text-lg font-extrabold text-gray-900 dark:text-gray-100">۸۰٪</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">تکمیل</span>
             </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 w-full px-4">
          {categoryLegendItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center w-full">
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full ml-2 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span>{item.label}</span>
              </div>
              <span className="font-bold">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 📰 لیست فعالیت‌های اخیر (بدون تغییر)
const RecentActivities = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full">
    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
      فعالیت‌های اخیر
    </h3>
    <div className="space-y-4">
      {activityData.map((activity, index) => (
        <div key={index} className="flex items-start justify-between border-b last:border-b-0 border-gray-100 dark:border-gray-700 py-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
              <IoBarChartOutline className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.status} - {activity.user}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {activity.time}
          </p>
        </div>
      ))}
    </div>
    <button className="w-full mt-4 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
      مشاهده همه
    </button>
  </div>
);

// 📅 رویدادهای آینده (با جزئیات تاریخ و مکان)
const UpcomingEventsList = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full">
    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
      رویدادهای آینده
    </h3>
    <div className="space-y-6">
      {upcomingEvents.map((event, index) => (
        <div key={index} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 transition duration-300">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-gray-900 dark:text-gray-100">
              {event.title}
            </h4>
            <span className={`text-xs font-semibold ${event.color} bg-opacity-10 px-2 py-1 rounded-full`}>
              {event.category}
            </span>
          </div>
          
          {/* جزئیات رویداد */}
          <div className="grid grid-cols-2 text-sm text-gray-600 dark:text-gray-400 mb-3 gap-y-1">
            <div className="flex items-center">
              <IoTimeOutline className="ml-1 text-base text-indigo-500" />
              <span>{event.time} | {event.date}</span>
            </div>
            <div className="flex items-center">
              <IoLocationOutline className="ml-1 text-base text-indigo-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <IoPeopleOutline className="ml-1 text-base text-indigo-500" />
              <span>{event.capacity}</span>
            </div>
            <div className="flex items-center">
              <IoCheckmarkCircleOutline className="ml-1 text-base text-indigo-500" />
              <span>تایید شده</span>
            </div>
          </div>
          
          {/* نوار پیشرفت */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${event.color.replace('text-', 'bg-')}`}
              style={{ width: `${event.progress}%` }}
              title={`ظرفیت: ${event.progress}%`}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
            <span>{event.progress}% پر شده</span>
            <span>ظرفیت</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);


// =================================================================
// 🖥️ کامپوننت اصلی Financialanalysis
// =================================================================

const Financialanalysis = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
        خوش آمدید
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        نمای کلی عملکرد، آمار و رویدادهای کافه شما.
      </p>

      {/* 1. آمار بالایی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {topStats.map((stat, index) => (
          <StatCard key={index} {...stat} icon={stat.icon} />
        ))}
      </div>

      {/* 2. نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ParticipantChart />
        </div>
        <div className="lg:col-span-1">
          <CategoryChart />
        </div>
      </div>

      {/* 3. لیست‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <UpcomingEventsList />
      </div>
    </div>
  );
};

export default Financialanalysis;