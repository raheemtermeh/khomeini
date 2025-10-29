import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleTheme } from "../../features/theme/themeSlice";
import {
  IoHomeOutline,
  IoNotificationsOutline,
  IoPieChartOutline,
  IoPersonOutline,
  IoHeadsetOutline,
  IoShieldCheckmarkOutline,
  IoInformationCircleOutline,
  IoLogOutOutline,
  IoSunnyOutline,
  IoMoonOutline,
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
  onCloseSidebar: () => void; // ✅ پراپ جدید
}

const Sidebar = ({ onLogoutClick, isOpen, onCloseSidebar }: Props) => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const menuItems = [
    { title: "رویداد ها", icon: <IoHomeOutline size={22} />, path: "/events" },
    { title: "سفارشات", icon: <BsReceipt size={22} />, path: "/orders" },
    {
      title: "اعلانات",
      icon: <IoNotificationsOutline size={22} />,
      path: "/notifications",
    },
    {
      title: "گزارش مالی",
      icon: <IoPieChartOutline size={22} />,
      path: "/financial-report",
    },
    {
      title: " مدیریت رویداد",
      icon: <IoPieChartOutline size={22} />,
      path: "/",
    },
    { title: "پروفایل", icon: <IoPersonOutline size={22} />, path: "/profile" },
    {
      title: "اطلاعات کافه",
      icon: <IoPersonOutline size={22} />,
      path: "/cafe",
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

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-x-4 p-3 rounded-xl transition-colors cursor-pointer ${
      isActive
        ? "bg-primary-red text-white shadow-md"
        : "hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <aside
      className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
        w-72 p-4 flex flex-col shadow-lg flex-shrink-0
        fixed top-0 right-0 h-screen z-30 transition-transform duration-300 ease-in-out
        lg:sticky lg:top-4 lg:h-2/3 lg:rounded-3xl lg:ml-4 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex flex-col items-center justify-center my-6">
        <img
          src={avatar}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
        <button
          onClick={handleToggleTheme}
          className="mt-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700"
          aria-label="Toggle theme"
        >
          {mode === "light" ? (
            <IoMoonOutline size={20} />
          ) : (
            <IoSunnyOutline size={20} />
          )}
        </button>
      </div>

      <nav className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-none">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={linkClasses}
                end
                onClick={onCloseSidebar} // ✅ سایدبار بسته می‌شود
              >
                {item.icon}
                <span className="font-semibold">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div>
          <ul className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {supportItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  className={linkClasses}
                  onClick={onCloseSidebar} // ✅ در این بخش هم بسته می‌شود
                >
                  {item.icon}
                  <span className="font-semibold">{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <div
              onClick={() => {
                onLogoutClick();
                onCloseSidebar(); // ✅ موقع خروج هم بسته می‌شود
              }}
              className="flex items-center gap-x-4 p-3 rounded-xl transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <IoLogOutOutline size={22} />
              <span className="font-semibold">خروج</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
