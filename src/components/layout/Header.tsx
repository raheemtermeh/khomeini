import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleTheme } from "../../features/theme/themeSlice";
import { usePwaInstall } from "../../app/usePwaInstall";
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoMenu,
  IoMoonOutline,
  IoSunnyOutline,
  IoAdd, 
  IoDownloadOutline, // مطمئن می‌شویم که این هم در اینجا Import شده باشد
} from "react-icons/io5";
import avatar from "../../assets/mmdi.jpg"; 
import { useNavigate } from "react-router-dom"; 

interface Props {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: Props) => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const { canInstall } = usePwaInstall(); 
  const navigate = useNavigate();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    // ✨ اصلاح فاصله دهی و پدینگ‌ها برای موبایل (m-4)
    <header className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm flex justify-between items-center m-3 sm:m-4 lg:m-0 lg:mt-4 lg:mx-6 transition-all duration-300">
      
      {/* ⬅️ بخش چپ: دکمه‌های اکشن (آواتار، رویداد جدید، هشدار) */}
      <div className="flex items-center gap-x-3 sm:gap-x-4">
        
        {/* ✨ دکمه منوی موبایل (انتقال به ابتدای سمت چپ در موبایل) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 dark:text-gray-300 p-1 sm:p-2"
          aria-label="Open Menu"
        >
          <IoMenu size={28} />
        </button>
        
        <a href="/profile">
          {/* ✨ آواتار با استایل شبیه عکس */}
          <div className="p-0.5 rounded-full bg-gradient-to-br from-primary-red to-indigo-600 transition-transform hover:scale-105">
             <img
              src={avatar}
              alt="User Avatar"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
             />
          </div>
        </a>
        
        {/* ✨ دکمه رویداد جدید (کوچک‌تر در موبایل) */}
        <button
          onClick={() => navigate('/events')} 
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 
                     bg-primary-red hover:bg-primary-red-dark
                     text-white text-sm sm:text-base font-bold rounded-xl shadow-lg 
                     shadow-primary-red/50 transition-all duration-300 transform hover:scale-[1.03]"
          aria-label="Create New Event"
        >
          <IoAdd size={20} className="stroke-2" />
          <span className="hidden sm:inline">رویداد جدید</span>
          <span className="sm:hidden">جدید</span>
        </button>
        
        {/* ✨ دکمه اعلان‌ها */}
        <a href="/notifications" className="relative hidden sm:block">
          <button className="relative text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Notifications">
            <IoNotificationsOutline size={24} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-red text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-800">
              3
            </span>
          </button>
        </a>
        
        {/* ✨ دکمه تم */}
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden md:block"
          aria-label="Toggle theme"
        >
          {mode === "light" ? (
            <IoMoonOutline size={22} />
          ) : (
            <IoSunnyOutline size={22} className="text-yellow-400" />
          )}
        </button>
        
      </div>

      {/* ➡️ بخش راست: جستجو و کنترل‌های اضافی */}
      <div className="flex items-center gap-4">
        
        {/* ✨ باکس جستجو با استایل جدید شبیه عکس (پنهان در موبایل کوچک) */}
        <div 
          className="relative hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full 
                     py-2 pr-10 pl-4 w-40 md:w-64 transition-all duration-300 border border-transparent 
                     focus-within:border-fuchsia-400 focus-within:ring-2 focus-within:ring-fuchsia-300/50"
        >
           {/* آیکون جستجو در سمت چپ (RTL) */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearchOutline className="text-gray-500 dark:text-gray-400" size={20} />
          </div>
           {/* آیکون کیبورد در سمت چپ آیکون جستجو، شبیه عکس */}
          <div className="absolute inset-y-0 left-0 hidden md:flex items-center pl-8 ml-3 pointer-events-none border-r border-gray-300 dark:border-gray-600">
             
          </div>

          <input
            type="text"
            placeholder="جستجو..."
            className="w-full bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-right pr-0 md:pl-14 pl-3"
          />
         
        </div>
        
        {/* دکمه دانلود PWA، اگر فعال باشد (فقط در صفحات بزرگتر از موبایل) */}
        {canInstall && (
          <button
            onClick={() => { /* logic to install PWA */ }}
            className="hidden sm:flex items-center text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Install App"
          >
            <IoDownloadOutline size={22} />
          </button>
        )}

      </div>
    </header>
  );
};

export default Header;