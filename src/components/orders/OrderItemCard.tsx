import { FaCalendar, FaUsers, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import gameImage from "../../assets/game-image.jpg";

interface OrderItemProps {
  id: number;
  title: string;
  category: string;
  date: string;
  capacity: number;
  remaining: number;
}

const OrderItemCard = ({
  id,
  title,
  category,
  date,
  capacity,
  remaining,
}: OrderItemProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row items-center p-4 gap-4 transition-shadow hover:shadow-lg">
      <img
        src={gameImage}
        alt={title}
        className="w-full md:w-32 h-32 md:h-24 object-cover rounded-lg"
      />

      <div className="flex-1 flex flex-col md:flex-row items-center justify-between w-full">
        {/* بخش اطلاعات اصلی */}
        <div className="text-center md:text-right mb-4 md:mb-0">
          <p className="text-primary-red font-semibold text-sm mb-1">
            # {category}
          </p>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>

        {/* بخش جزئیات */}
        <div className="flex items-center gap-x-6 text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <FaCalendar />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers />
            <span>{capacity} نفر</span>
          </div>
          <div className="flex items-center gap-2 text-green-500 font-semibold">
            <FaCheckCircle />
            <span>{remaining} جای خالی مانده</span>
          </div>
        </div>

        {/* بخش دکمه */}
        <div className="mt-4 md:mt-0">
          <Link
            to={`/orders/${id}`}
            className="text-primary-red font-bold py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
          >
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
