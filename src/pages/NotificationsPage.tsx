import avatar from "../assets/mmdi.jpg"; 

// کامپوننت برای نمایش ستاره‌های امتیاز
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex" dir="ltr">
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.392c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ))}
  </div>
);

// کامپوننت هر آیتم نظر
const NotificationItem = ({
  name,
  avatar,
  rating,
  date,
  comment,
}: {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}) => (
  <div className="flex items-start space-x-4 space-x-reverse border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0">
    <img
      src={avatar}
      alt={name}
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="mb-2 sm:mb-0">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {comment}
          </p>
          <div className="flex items-center mt-1 space-x-2 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
            <StarRating rating={rating} />
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
        <button className="text-sm text-primary-red font-semibold hover:underline flex-shrink-0">
          پاسخ
        </button>
      </div>
    </div>
  </div>
);

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      name: "کاربر اول",
      avatar,
      rating: 5,
      date: "۴ اردیبهشت ۱۴۰۳",
      comment: "همه چیز عالی بود",
    },
    {
      id: 2,
      name: "کاربر دوم",
      avatar,
      rating: 5,
      date: "۶ فروردین ۱۴۰۳",
      comment: "بهترین تجربه ای بود که داشتم، دمتون گرم",
    },
    {
      id: 3,
      name: "کاربر سوم",
      avatar,
      rating: 3,
      date: "۶ مرداد ۱۴۰۳",
      comment: "کارکنان پاسخگویی خوبی نداشتند",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
      
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            پاسخ به نظرات کاربران
          </h1>
          <button className="text-primary-red font-semibold border border-primary-red rounded-full px-4 py-1 text-sm hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">
            همه نظرات
          </button>
        </div>
        <div>
          {notifications.map((item) => (
            <NotificationItem key={item.id} {...item} />
          ))}
        </div>
    
    </div>
  );
};

export default NotificationsPage;
