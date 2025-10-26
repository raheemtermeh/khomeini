import React from "react";
import {
  IoCallOutline,
  IoPaperPlaneOutline,
  IoLogoInstagram,
  IoMailOutline,
  IoGlobeOutline,
} from "react-icons/io5";

// کامپوننت برای هر ردیف از اطلاعات تماس
const ContactInfo = ({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-3 text-lg text-gray-700 dark:text-gray-300 hover:text-primary-red dark:hover:text-primary-red transition-colors"
  >
    {icon}
    <span className="font-semibold tracking-wider" dir="ltr">
      {text}
    </span>
  </a>
);

// لوگوی زونکو به صورت SVG
const ZoncoLogo = () => (
  <svg
    className="w-24 h-24 text-gray-800 dark:text-gray-200"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
      fill="currentColor"
    />
    <path
      d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8Z"
      fill="currentColor"
    />
    <path
      d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z"
      fill="currentColor"
    />
  </svg>
);

const SupportPage = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md mx-auto p-8 text-center">
        <div className="flex justify-center mb-4">
          <ZoncoLogo />
        </div>

        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          شماره تماس های پشتیبانی زونکو
        </h1>

        <div className="space-y-5 mt-8">
          <ContactInfo
            icon={<IoGlobeOutline size={22} />}
            text="www.zonco.ir"
            href="http://www.zonco.ir"
          />
          <ContactInfo
            icon={<IoCallOutline size={22} />}
            text="۰۹۱۲۳۴۵۶۷۸۹"
            href="tel:09123456789"
          />
          <ContactInfo
            icon={<IoCallOutline size={22} />}
            text="۰۲۱۱۲۳۴۵۶۷۸"
            href="tel:02112345678"
          />
          <ContactInfo
            icon={<IoPaperPlaneOutline size={22} />}
            text="funzone"
            href="https://t.me/funzone"
          />
          <ContactInfo
            icon={<IoLogoInstagram size={22} />}
            text="funzone"
            href="https://instagram.com/funzone"
          />
          <ContactInfo
            icon={<IoMailOutline size={22} />}
            text="funzone@gmail.com"
            href="mailto:funzone@gmail.com"
          />
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
