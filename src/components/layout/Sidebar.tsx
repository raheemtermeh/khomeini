import { NavLink } from "react-router-dom";
import {
  IoHomeOutline,
  IoNotificationsOutline,
  IoPieChartOutline, 
  IoPersonOutline,
  IoHeadsetOutline,
  IoShieldCheckmarkOutline,
  IoInformationCircleOutline,
  IoLogOutOutline,
  IoPricetagOutline, 
} from "react-icons/io5";
import {
  BsReceipt,
  BsExclamationCircle,
  BsQuestionCircle,
} from "react-icons/bs";
import avatar from "../../assets/mmdi.jpg";

interface Props {
  onLogoutClick: () => void;
  isOpen: boolean;
  onCloseSidebar: () => void;
}

const Sidebar = ({ onLogoutClick, isOpen, onCloseSidebar }: Props) => {
  // این توابع حذف شدند زیرا در این فایل استفاده نشده و مربوط به context خارجی هستند
  // const dispatch = useAppDispatch();
  // const { mode } = useAppSelector((state) => state.theme);
  // const handleToggleTheme = () => { dispatch(toggleTheme()); };

  const menuItems = [
    {
      title: "مدیریت رویداد",
      icon: <IoPieChartOutline size={22} />,
      path: "/",
    },
    { 
      title: "رویداد ها", 
      icon: <IoPricetagOutline size={22} />, 
      path: "/events" 
    },
    { title: "سفارشات", icon: <BsReceipt size={22} />, path: "/orders" },
    // {
    //   title: "اعلانات",
    //   icon: <IoNotificationsOutline size={22} />,
    //   path: "/notifications",
    // },
    {
      title: "گزارش مالی",
      icon: <IoPieChartOutline size={22} />, 
      path: "/financial-report",
    },
    
    { title: "پروفایل", icon: <IoPersonOutline size={22} />, path: "/profile" },
    {
      title: "اطلاعات کافه",
      icon: <IoHomeOutline size={22} />, 
      path: "/cafe",
    },
    {
      title: "اطلاع رسانی",
      icon: <IoHomeOutline size={22} />, 
      path: "/announcements",
    },

  ];

  const supportItems = [
    {
      title: "گزارش مشکل",
      icon: <BsExclamationCircle size={22} />,
      path: "/report-issue",
    },
    {
      title: "تماس با پشتیبانی",
      icon: <IoHeadsetOutline size={22} />,
      path: "/support",
    },
    {
      title: "سوالات متداول",
      icon: <BsQuestionCircle size={22} />,
      path: "/faq",
    },
    {
      title: "قوانین و حریم خصوصی",
      icon: <IoShieldCheckmarkOutline size={22} />,
      path: "/privacy",
    },
    {
      title: "درباره ما",
      icon: <IoInformationCircleOutline size={22} />,
      path: "/about",
    },
  ];

  // ✨ استایل مدرن و دارای افکت Hover
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-x-4 p-3 rounded-2xl transition-all duration-300 transform font-medium relative overflow-hidden group ${
      isActive
        ? "text-white bg-primary-red shadow-xl shadow-red-500/50" // افکت فعال
        : "text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-gray-700"
    }`;
    
  // ✨ استایل آواتار: حفظ گرادیان و افزودن افکت Pulse در حالت عادی
  const avatarContainerClasses = `p-1 rounded-full bg-primary-red shadow-2xl shadow-primary-red/40 transition-transform duration-300 transform hover:scale-[1.05] relative after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-primary-red after:opacity-50 after:animate-pulse`;
  
  // ✨ استایل آواتار در حالت Hover (برای جلوگیری از تداخل با Pulse)
  const avatarImageClasses = "w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 relative z-10";


  return (
    // ✨ تغییرات: انیمیشن خفن‌تر (skew و translate) و Shadow رنگی
    <aside
      className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
        w-72 p-4 flex flex-col shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-900/50 flex-shrink-0
        fixed top-0 right-0 h-screen z-40 transition-all duration-500 ease-in-out
        lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:rounded-3xl lg:ml-4 lg:translate-x-0
        ${isOpen 
            ? "translate-x-0 rotate-0 skew-y-0" 
            : "translate-x-full rotate-1 skew-y-1" // افکت ورود/خروج 3D
        } lg:rotate-0 lg:skew-y-0`}
    >
      
      {/* 1. بخش آواتار و پروفایل */}
      <div className="flex flex-col items-center my-6">
        <div className={avatarContainerClasses}>
            <img
                src={avatar}
                alt="User Avatar"
                className={avatarImageClasses}
            />
        </div>
        
      </div>

      {/* 2. ناوبری اصلی */}
      <nav className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-none">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={linkClasses}
                end
                onClick={onCloseSidebar} 
              >
                 {/* ✨ افکت پس‌زمینه در Hover */}
                 <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>

                <div className="relative z-10 flex items-center gap-x-4">
                    {item.icon}
                    <span className="font-semibold">{item.title}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 3. بخش پشتیبانی و خروج */}
        <div>
          <ul className="space-y-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            {supportItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  className={linkClasses}
                  onClick={onCloseSidebar} 
                >
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                    <div className="relative z-10 flex items-center gap-x-4">
                        {item.icon}
                        <span className="font-semibold">{item.title}</span>
                    </div>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <div
              onClick={() => {
                onLogoutClick();
                onCloseSidebar();
              }}
              // ✨ استایل خروج: ساده و قابل تفکیک
              className="flex items-center gap-x-4 p-3 rounded-2xl transition-colors cursor-pointer text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-gray-700"
            >
              <IoLogOutOutline size={22} />
              <span className="font-semibold">خروج</span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* 4. حذف Overlay موبایل (طبق درخواست) */}
    </aside>
  );
};

export default Sidebar;