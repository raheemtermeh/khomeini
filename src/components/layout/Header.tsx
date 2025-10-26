import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleTheme } from "../../features/theme/themeSlice";
import { usePwaInstall } from "../../app/usePwaInstall";
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoMenu,
  IoMoonOutline,
  IoSunnyOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import avatar from "../../assets/mmdi.jpg";

interface Props {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: Props) => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const { canInstall, installApp } = usePwaInstall();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center m-4 lg:m-0 lg:mt-4 lg:mx-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 dark:text-gray-300"
        >
          <IoMenu size={28} />
        </button>

        <div className="relative hidden md:block w-full max-w-xs">
          <input
            type="text"
            placeholder="جستجو..."
            className="bg-red-500 placeholder:text-white dark:bg-red-700 rounded-full py-2 pr-10 pl-14 w-full focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <IoSearchOutline className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        {canInstall && (
          <button
            onClick={installApp}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <IoDownloadOutline size={20} />
            نصب اپ
          </button>
        )}

        <label
          htmlFor="dark-mode-toggle"
          className="flex items-center cursor-pointer"
        >
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
            aria-label="Toggle theme"
          >
            {mode === "light" ? (
              <IoMoonOutline size={20} />
            ) : (
              <IoSunnyOutline size={20} />
            )}
          </button>
        </label>
        <a href="/notifications">
          <button className="relative text-gray-600 dark:text-gray-300">
            <IoNotificationsOutline size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-red text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </a>
        <a href="/profile">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;
