import React from 'react';
import { IoDownloadOutline, IoShareOutline, IoWarning, IoArrowUpOutline, IoArrowDownOutline, IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoCalculatorOutline } from 'react-icons/io5';
import { Bar, Doughnut } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// ثبت اجزای مورد نیاز Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// =================================================================
// 📊 داده‌های استاتیک برای شبیه‌سازی طرح
// =================================================================

const topColoredStats = [
  { title: 'کل فروش', value: '۳۳.۳م تومان', percentage: 18.3, isPositive: true, color: 'bg-red-500' },
  { title: 'سود خالص', value: '۱۸.۲م تومان', percentage: 15.5, isPositive: true, color: 'bg-teal-500' },
  { title: 'هزینه کل', value: '۷.۱م تومان', percentage: 3.2, isPositive: false, color: 'bg-purple-600' },
  { title: 'تخفیف داده شده', value: '۱.۲م تومان', percentage: 0.8, isPositive: false, color: 'bg-pink-500' },
];

const barChartData = {
  labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
  datasets: [
    {
      label: 'فروش',
      data: [15, 25, 30, 18, 22, 35, 28],
      backgroundColor: '#34D399', // سبز روشن
      borderRadius: 4,
    },
    {
      label: 'سود',
      data: [12, 20, 25, 15, 18, 30, 24],
      backgroundColor: '#F472B6', // صورتی
      borderRadius: 4,
    },
  ],
};

const incomeDetails = [
  { title: 'درآمد اصلی', value: '۲۴.۳۴۴ تومان', color: 'text-green-500', dot: 'bg-green-500' },
  { title: 'درآمد تسهیلات', value: '۳.۰۰۰ تومان', color: 'text-orange-500', dot: 'bg-orange-500' },
  { title: 'کمیسیون', value: '۱.۰۵۰ تومان', color: 'text-blue-500', dot: 'bg-blue-500' },
  { title: 'حق شارژ', value: '۲۰۰ تومان', color: 'text-purple-500', dot: 'bg-purple-500' },
];

const expenseDetails = [
  { title: 'اجاره و قبوض', value: '۵.۰۰۰ تومان', color: 'text-red-500', dot: 'bg-red-500' },
  { title: 'حقوق و دستمزد', value: '۲.۰۰۰ تومان', color: 'text-yellow-500', dot: 'bg-yellow-500' },
];

const donutChartData = {
  labels: ['تامین خدمات', 'تأمین کالا', 'دستمزد', 'سود'],
  datasets: [
    {
      data: [35, 20, 10, 35],
      backgroundColor: ['#6366F1', '#EC4899', '#34D399', '#FBBF24'],
      borderWidth: 0,
    },
  ],
};

const ordersData = [
    { orderId: 123-445, type: 'خدمات', item: 'ورکشاپ', price: '۳۰۰,۰۰۰ تومان', status: 'تکمیل شده', date: '۱۴۰۲/۰۶/۲۰' },
    { orderId: 445-667, type: 'کالا', item: 'لته', price: '۵۰,۰۰۰ تومان', status: 'لغو شده', date: '۱۴۰۲/۰۶/۱۹' },
    { orderId: 789-101, type: 'خدمات', item: 'شب شعر', price: '۱۰۰,۰۰۰ تومان', status: 'تکمیل شده', date: '۱۴۰۲/۰۶/۱۸' },
    { orderId: 112-131, type: 'کالا', item: 'کیک', price: '۸۰,۰۰۰ تومان', status: 'در انتظار', date: '۱۴۰۲/۰۶/۱۷' },
    // ... اضافه کردن داده‌های بیشتر برای پر کردن جدول
    { orderId: 112-132, type: 'خدمات', item: 'ورکشاپ', price: '۲۰۰,۰۰۰ تومان', status: 'تکمیل شده', date: '۱۴۰۲/۰۶/۱۶' },
    { orderId: 112-133, type: 'کالا', item: 'چای', price: '۳۰,۰۰۰ تومان', status: 'لغو شده', date: '۱۴۰۲/۰۶/۱۵' },
];

// =================================================================
// 🎨 کامپوننت‌های کمکی
// =================================================================

// 📊 کامپوننت کارت آمار رنگی
const ColoredStatCard = ({ title, value, percentage, isPositive, color }: typeof topColoredStats[0]) => (
  <div className={`p-4 rounded-xl shadow-lg text-white ${color}`}>
    <div className="text-sm font-medium opacity-80 mb-1">{title}</div>
    <div className="text-2xl font-extrabold">{value}</div>
    <div className="flex items-center text-sm font-semibold mt-1">
      {isPositive ? (
        <IoArrowUpOutline className="w-4 h-4 ml-1" />
      ) : (
        <IoArrowDownOutline className="w-4 h-4 ml-1" />
      )}
      <span>{percentage}%</span>
      <span className="mr-1 opacity-70">از ماه قبل</span>
    </div>
  </div>
);

// 📈 نمودار ستونی فروش/سود
const SalesBarChart = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#E5E7EB' : '#4B5563'; 
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB'; 

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: textColor
        }
      },
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
    },
    barThickness: 30, // کنترل پهنای ستون‌ها
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-96">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center justify-between">
        نمودار درآمد و شارژ ماهانه
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center ml-3"><span className="w-3 h-3 bg-teal-500 rounded-full ml-1"></span> فروش</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-pink-400 rounded-full ml-1"></span> سود</span>
        </div>
      </h3>
      <div className="h-[80%]">
        <Bar data={barChartData} options={options} />
      </div>
    </div>
  );
};

// 🍩 نمودار دایره‌ای توزیع درآمد
const DistributionDonutChart = () => {
  const donutData = {
    labels: donutChartData.labels,
    datasets: donutChartData.datasets,
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
    
  const legendItems = [
      { label: 'تامین خدمات', color: '#6366F1' },
      { label: 'تأمین کالا', color: '#EC4899' },
      { label: 'دستمزد', color: '#34D399' },
      { label: 'سود', color: '#FBBF24' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
        توزیع درآمد (سالیانه)
      </h3>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 mb-4">
          <Doughnut data={donutData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center text-center">
             <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100">۸۰٪</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">کل درآمد</span>
             </div>
          </div>
        </div>
        <div className="mt-4 w-full">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                کل درآمد: ۳۳.۳م تومان
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                {legendItems.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full ml-2" style={{ backgroundColor: item.color }}></span>
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};


// =================================================================
// 🖥️ کامپوننت اصلی FinancialReportPage
// =================================================================

const FinancialReportPage = () => {
  
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'تکمیل شده':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'لغو شده':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'در انتظار':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      
      {/* هدر صفحه و دکمه‌های کنترلی */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          گزارش مالی شهریور ۱۴۰۲
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-4">
            (سال مالی: ۱۴۰۲-۱۴۰۳)
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium">
            <IoShareOutline className="ml-2" />
            اشتراک‌گذاری
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm font-medium">
            <IoDownloadOutline className="ml-2" />
            PDF دانلود
          </button>
        </div>
      </div>

      {/* 1. آمار بالایی رنگی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {topColoredStats.map((stat, index) => (
          <ColoredStatCard key={index} {...stat} />
        ))}
      </div>
      
      {/* 2. نمودار ستونی */}
      <div className="mb-8">
        <SalesBarChart />
      </div>

      {/* 3. تفکیک درآمد و توزیع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* ستون چپ: تفکیک درآمد */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                تفکیک درآمد/هزینه
            </h3>
            
            <div className="space-y-4">
                <h4 className="font-semibold text-teal-600 dark:text-teal-400">درآمد (۲۸.۵۹۴ تومان)</h4>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {incomeDetails.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="flex items-center">
                                <span className={`w-2.5 h-2.5 rounded-full ml-2 ${item.dot}`}></span>
                                {item.title}
                            </span>
                            <span className={`font-semibold ${item.color}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
                
                <h4 className="font-semibold text-red-600 dark:text-red-400 pt-3 border-t border-gray-200 dark:border-gray-700">هزینه‌ها (۷.۰۰۰ تومان)</h4>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {expenseDetails.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="flex items-center">
                                <span className={`w-2.5 h-2.5 rounded-full ml-2 ${item.dot}`}></span>
                                {item.title}
                            </span>
                            <span className={`font-semibold ${item.color}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    سود نهایی: ۲۰.۵۹۴ تومان
                </p>
            </div>
        </div>
        
        {/* ستون میانی و راست: توزیع درآمد و جزئیات بیشتر */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DistributionDonutChart />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                    نسبت‌های مالی
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium border-b border-gray-100 dark:border-gray-700 pb-2">
                        <span>سود خالص / درآمد کل</span>
                        <span className="font-bold text-teal-500">۴۲.۶٪</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium border-b border-gray-100 dark:border-gray-700 pb-2">
                        <span>هزینه / درآمد</span>
                        <span className="font-bold text-red-500">۲۱.۱٪</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium border-b border-gray-100 dark:border-gray-700 pb-2">
                        <span>مالیات و عوارض</span>
                        <span className="font-bold text-purple-500">۲.۳٪</span>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-xl font-extrabold text-gray-600 dark:text-gray-300">
                        سود ناخالص: ۳۳.۳م تومان
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* 4. جدول جزئیات سفارشات */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
            جزئیات سفارشات اخیر
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  شماره سفارش
                </th>
                <th scope="col" className="px-6 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  نوع
                </th>
                <th scope="col" className="px-6 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  آیتم
                </th>
                <th scope="col" className="px-6 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  مبلغ نهایی
                </th>
                <th scope="col" className="px-6 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  وضعیت
                </th>
                <th scope="col" className="px-6 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  تاریخ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {ordersData.map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{order.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{order.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{order.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 5. نوار فوتر اطلاعات مالی (Bottom Footer Bar) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl p-4 border-t border-gray-200 dark:border-gray-700 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm font-medium">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                <IoCalculatorOutline className="text-xl text-indigo-500" />
                <span className="font-bold text-lg">خلاصه مالی ماه</span>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex flex-col text-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">مالیات</span>
                    <span className="font-extrabold text-red-500">۲.۵م</span>
                </div>
                <div className="flex flex-col text-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">سود</span>
                    <span className="font-extrabold text-teal-500">۲۰.۶م</span>
                </div>
                <div className="flex flex-col text-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">درآمد کل</span>
                    <span className="font-extrabold text-indigo-500">۳۳.۳م</span>
                </div>
                <div className="px-3 py-1 bg-indigo-500 text-white rounded-lg font-bold">
                    گزارشات کامل
                </div>
            </div>
        </div>
      </div>
      
      {/* فضای خالی برای فوتر ثابت */}
      <div className="h-20"></div> 
    </div>
  );
};

export default FinancialReportPage;