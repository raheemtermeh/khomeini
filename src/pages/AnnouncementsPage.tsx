import React, { useState } from 'react';
import { IoMegaphoneOutline, IoBulbOutline, IoWalletOutline, IoShieldCheckmarkOutline, IoArrowForwardOutline, IoTrendingUp, IoWarning, IoCheckmarkCircleOutline, IoReaderOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { FiClock, FiLayers, FiCheckSquare } from 'react-icons/fi';

// =================================================================
// 📊 داده‌های استاتیک و محتوای توپ
// =================================================================

interface Announcement {
  id: number;
  type: 'system' | 'finance' | 'tip' | 'feature';
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  icon: React.ElementType;
  color: string; // Tailwind color class prefix
  is_read: boolean;
  link_to?: string; 
}

// داده‌ها را به بیرون از کامپوننت منتقل می‌کنیم و منطق is_read را درون State مدیریت می‌کنیم
const initialAnnouncements: Announcement[] = [
  { id: 1, type: 'feature', title: '🚀 امکان جدید: گزارش‌های ساعتی پیشرفته', excerpt: 'سیستم گزارش‌گیری مالی ما به‌روزرسانی شد! عملکرد فروش رویدادها را به صورت ساعتی مشاهده و تحلیل کنید.', date: '۱۴۰۳/۰۸/۰۵', tag: 'جدید | ویژگی', icon: IoShieldCheckmarkOutline, color: 'indigo', is_read: false, link_to: '/financial-report' },
  { id: 2, type: 'tip', title: '💡 نکته طلایی: ۳ راه برای افزایش ظرفیت رزرو', excerpt: 'با استفاده از ابزارهای جدید تحلیل ما، زمان‌های اوج تقاضا را پیدا کرده و رویدادهای خود را به طور استراتژیک زمان‌بندی کنید تا رزرو بیشتری بگیرید.', date: '۱۴۰۳/۰۸/۰۲', tag: 'ترفند | بازاریابی', icon: IoBulbOutline, color: 'yellow', is_read: false, },
  { id: 3, type: 'finance', title: '💰 اطلاعیه: کاهش نرخ کمیسیون در فصل پاییز', excerpt: 'به اطلاع می‌رساند که نرخ کمیسیون فان زون برای رویدادهای هنری در فصل پاییز با ۵٪ کاهش همراه شده است. این فرصت را از دست ندهید!', date: '۱۴۰۳/۰۷/۲۹', tag: 'مالی | مهم', icon: IoWalletOutline, color: 'teal', is_read: true, },
  { id: 4, type: 'system', title: '🛠️ رفع نقص: بهبود ۴۰٪ سرعت داشبورد', excerpt: 'مشکل کندی جزئی در بارگذاری اولیه داشبورد حل شد. اکنون بارگذاری صفحات تا ۴۰٪ سریع‌تر انجام می‌شود. از صبر شما متشکریم.', date: '۱۴۰۳/۰۷/۲۵', tag: 'سیستمی', icon: IoShieldCheckmarkOutline, color: 'red', is_read: true, },
  { id: 5, type: 'tip', title: '📸 راهنمای گالری: انتخاب بهترین عکس کافه', excerpt: 'کیفیت عکس‌های گالری شما مستقیماً بر نرخ تبدیل رزرو تأثیر دارد. توصیه‌های ما برای عکس‌برداری حرفه‌ای را بخوانید.', date: '۱۴۰۳/۰۷/۱۵', tag: 'آموزش | برندینگ', icon: IoReaderOutline, color: 'fuchsia', is_read: true, },
];

const featuredContent = [
    { title: 'کامل‌ترین راهنمای قیمت‌گذاری رویدادها', excerpt: 'نحوه تعیین قیمت بهینه برای هر نوع رویداد.' },
    { title: 'بسته افزایش فروش در روزهای کم‌کار', excerpt: 'استراتژی‌های تخفیف و تبلیغات هدفمند.' },
    { title: 'آشنایی با قوانین جدید مالیاتی ۱۴۰۳', excerpt: 'خلاصه تغییرات و تأثیر آن بر کسب‌وکار شما.' },
];

// =================================================================
// 🎨 کامپوننت کارت اطلاع‌رسانی
// =================================================================

const AnnouncementCard: React.FC<{ data: Announcement, onMarkRead: (id: number) => void }> = ({ data, onMarkRead }) => {
  const Icon = data.icon;
  const colorClass = `text-${data.color}-600 dark:text-${data.color}-400`;
  const bgClass = `bg-${data.color}-50 dark:bg-gray-800`;
  const hoverBorder = `border-${data.color}-500`;

  const isUnread = !data.is_read;
  const isFinance = data.type === 'finance';

  return (
    <a 
      href={data.link_to || '#'}
      className={`
      ${bgClass} p-5 pl-4 rounded-2xl shadow-xl border-l-4 border-r-4 border-transparent transition-all duration-300 transform 
      ${hoverBorder} group relative block overflow-hidden
      ${isUnread ? 'font-bold shadow-red-500/10' : 'opacity-90'}
    `}>
        {/* نوار کناری رنگی (Accent Bar) */}
        <div className={`absolute inset-y-0 right-0 w-1 ${data.color.replace('text-', 'bg-')}-500/80 group-hover:w-2 transition-all duration-300`}></div>

      <div className="flex justify-between items-start mb-3">
        {/* آیکون و تگ */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${colorClass}`}>
            <Icon size={24} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${data.color.replace('text-', 'bg-')}-50/50 dark:bg-gray-700 ${colorClass} transition-colors duration-300`}>
            {data.tag}
          </span>
        </div>
        {/* تاریخ و وضعیت */}
        <div className="flex flex-col items-end text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
                {data.date}
            </span>
            {isFinance && (
                 <span className="text-xs mt-1 flex items-center text-teal-600 dark:text-teal-400">
                    <IoWalletOutline className="mr-1" />
                    مالی
                </span>
            )}
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
        {data.title}
      </h3>
      
      <p className={`text-base leading-relaxed mb-4 ${isUnread ? 'text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
        {data.excerpt}
      </p>

      <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
        {/* دکمه مشاهده */}
        <button 
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg 
                        bg-indigo-600 text-white transition-all duration-300 hover:bg-indigo-700 
                        shadow-md shadow-indigo-500/30 w-fit`}
        >
            مشاهده کامل
            <IoArrowForwardOutline size={18} className="transform rotate-180" />
        </button>
        
        {/* دکمه خوانده شده/نخوانده شده */}
        <button 
            onClick={(e) => { e.preventDefault(); onMarkRead(data.id); }}
            className={`flex items-center gap-1.5 text-sm font-semibold p-2 rounded-full transition-colors duration-200
                        ${isUnread ? 'text-red-600 hover:bg-red-100 dark:hover:bg-gray-700' : 'text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-gray-700'}`}
            aria-label={isUnread ? "Mark as read" : "Mark as unread"}
        >
            {isUnread ? (
                <>
                    <IoCheckmarkCircleOutline size={20} /> علامت خوانده شده
                </>
            ) : (
                <>
                    <IoCloseCircleOutline size={20} /> علامت نخوانده
                </>
            )}
        </button>
      </div>
    </a>
  );
};


// =================================================================
// 🖥️ کامپوننت اصلی AnnouncementsPage
// =================================================================

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

    const unreadCount = announcements.filter(a => !a.is_read).length;
    const totalCount = announcements.length;
    const readingProgress = Math.round(((totalCount - unreadCount) / totalCount) * 100) || 0;


    const handleMarkRead = (id: number) => {
        setAnnouncements(prev => 
            prev.map(ann => 
                ann.id === id ? { ...ann, is_read: !ann.is_read } : ann
            ).sort((a, b) => (a.is_read === b.is_read) ? 0 : a.is_read ? 1 : -1) // جدیدها بالا قرار می‌گیرند
        );
    };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      
      {/* هدر اصلی */}
      <div className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          <IoMegaphoneOutline className="ml-3 text-red-500" />
          مرکز اطلاعیه‌های فان زون
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          مهم‌ترین به‌روزرسانی‌ها، نکات کارایی و اعلانات مالی برای کافه‌داران.
        </p>
      </div>
      
      {/* ✨ بخش ۱: خلاصه وضعیت و اطلاعیه‌های فوری (با انیمیشن و گرادیان) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* خلاصه وضعیت و پیشرفت */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-l-4 border-indigo-500 transition-shadow duration-300 hover:shadow-2xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2 flex items-center">
                <FiLayers className="ml-1" />
                خلاصه صندوق ورودی
              </p>
              <div className="flex justify-between items-center mb-4">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 animate-fadeIn">{unreadCount}</span>
                  <span className="text-base text-gray-600 dark:text-gray-300">
                    / {totalCount} اطلاعیه
                  </span>
              </div>
              
              {/* نوار پیشرفت خواندن */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${readingProgress}%` }}
                  ></div>
              </div>
              <p className={`text-sm mt-3 font-semibold ${unreadCount > 0 ? 'text-red-500' : 'text-teal-500'}`}>
                {readingProgress}% از اطلاعیه‌ها مطالعه شده
              </p>
          </div>
          
          {/* اطلاعیه‌های فوری (Critical Alerts) با گرادیان در Dark Mode */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-200 dark:from-red-950/70 dark:to-red-900/40 border-r-4 border-red-500 shadow-xl flex justify-between items-center transition-shadow duration-300 hover:shadow-red-500/30">
              <div className="flex items-start">
                  <IoWarning className="text-4xl text-red-600 dark:text-red-300 ml-3 flex-shrink-0 animate-pulse" />
                  <div>
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                        مهلت اقدام فوری!
                    </h3>
                    <p className="font-semibold text-red-800 dark:text-red-200 text-sm mt-1">
                        تایید گزارش مالی ماه گذشته، تا پایان امروز [۱۴۰۳/۰۸/۰۵] است. لطفاً اقدام کنید!
                    </p>
                  </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition flex-shrink-0 shadow-lg shadow-red-500/40">
                  تایید گزارش
              </button>
          </div>
      </div>
      
      {/* ✨ بخش ۲: محتوای ویژه و آموزشی */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl h-full transition-shadow duration-300 hover:shadow-indigo-500/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  محتوای آموزشی
              </h3>
              <ul className="space-y-3">
                  {featuredContent.map((item, index) => (
                      <li key={index} className="group cursor-pointer">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition">
                              {item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {item.excerpt}
                          </p>
                      </li>
                  ))}
              </ul>
          </div>
          
          {/* آرشیو اطلاعیه‌ها (فیلتر و لیست اصلی) */}
          <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                  <IoMegaphoneOutline className="ml-2" />
                  آرشیو اطلاعیه‌ها
              </h2>
              
              {/* فیلترها (اضافه کردن دکمه Mark All as Read) */}
              <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 text-sm rounded-full bg-red-500 text-white font-semibold">
                      همه ({totalCount})
                    </button>
                    <button className="px-4 py-2 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                      ویژگی‌های جدید
                    </button>
                    <button className="px-4 py-2 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                      مالی
                    </button>
                </div>
                
                {/* ✨ دکمه Mark All as Read */}
                {unreadCount > 0 && (
                    <button 
                        onClick={() => setAnnouncements(announcements.map(a => ({...a, is_read: true})))}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors duration-300 shadow-md animate-bounce-slow"
                    >
                        <FiCheckSquare size={18} />
                        علامت‌گذاری همه ({unreadCount})
                    </button>
                )}
              </div>

              {/* لیست کارت‌ها */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {announcements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} data={announcement} onMarkRead={handleMarkRead} />
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;