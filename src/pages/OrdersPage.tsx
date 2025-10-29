import { useEffect, useState } from "react";
import { IoTimeOutline, IoPeopleOutline, IoTicketOutline, IoWarning, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

// --- ساختار داده‌ها ---

interface Event {
    pk: number;
    event_name: string;
    branch_name: string;
    price: string;
    starts_at: string;
    duration_minutes: number;
    min_capacity: number;
    max_capacity: number;
    terms_text: string;
    branch_data: {
        pk: number;
        name: string;
        phone: string;
        address: string | null;
        open_hours: { mon_fri: string };
        latitude: number;
        longitude: number;
        gallery_data: { image: string }[];
    };
}

// ✨ Reservation interface remains the same
interface Reservation {
    id: number;
    event_branch: number;
    user: number;
    guests_count: number;
    status: string;
    status_display: string;
    hold_expires_at: string;
    unit_price: string;
    total_price: string;
    payment_status: string;
    payment_status_display: string;
    created_at: string;
    updated_at: string;
    note: string;
}

const ACCENT_COLORS = [
  "border-red-500/70",
  "border-blue-500/70",
  "border-green-500/70",
  "border-purple-500/70",
  "border-yellow-500/70",
];

// ✨ URL رزروها برای فیلتر بر اساس event_id
const RESERVATION_API_BASE_URL = "https://fz-backoffice.linooxel.com/api/venues/proxy/event-reservations/";
const EVENT_API_URL = "https://fz-backoffice.linooxel.com/api/venues/event-branch?starts_at__gte=1999-10-11 00:00&status=p&page=1&page_size=20";


const OrdersPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingReservations, setLoadingReservations] = useState(false); // در ابتدا False است چون منتظر Events هستیم
    const [expandedEventPk, setExpandedEventPk] = useState<number | null>(null);

    const accessToken = localStorage.getItem("accessToken");
    
    // --- توابع Fetch ---
    
    /**
     * ✨ تابع جدید: گرفتن رزروها برای لیست PK ایونت‌ها
     */
    const fetchReservationsForEvents = async (eventPks: number[]) => {
        if (!accessToken || eventPks.length === 0) {
            setReservations([]);
            setLoadingReservations(false);
            return;
        }

        setLoadingReservations(true);
        
        // ایجاد آرایه‌ای از وعده‌ها (Promises) برای هر فراخوانی API
        const reservationPromises = eventPks.map(pk => {
            const url = `${RESERVATION_API_BASE_URL}?event_id=${pk}`;
            return fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }).then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch reservations for event ${pk}`);
                }
                return res.json();
            });
        });

        try {
            // اجرای موازی تمام فراخوانی‌ها
            const results = await Promise.all(reservationPromises);
            
            // تجمیع نتایج در یک آرایه مسطح (Flattening the array of arrays)
            const allReservations: Reservation[] = results.flat();
            
            setReservations(allReservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            setReservations([]);
        } finally {
            setLoadingReservations(false);
        }
    };


    /**
     * گرفتن ایونت‌ها و شروع فرآیند گرفتن رزروها
     */
    const fetchEvents = async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(EVENT_API_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            const fetchedEvents = data.results || data || [];
            
            setEvents(fetchedEvents);
            
            // ✨ گام جدید: استخراج pk ها و شروع گرفتن رزروها
            const eventPks = fetchedEvents.map((event: Event) => event.pk);
            await fetchReservationsForEvents(eventPks); 
            
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchEvents();
        // fetchReservationsForEvents در اینجا دیگر فراخوانی نمی‌شود
        // بلکه پس از گرفتن events در تابع fetchEvents فراخوانی می‌شود.
    }, [accessToken]);
    
    // --- منطق استایل‌دهی وضعیت پرداخت/رزرو ---
    
    const getStatusClasses = (status: string, paymentStatus: string) => {
        // ... (منطق بدون تغییر)
        let classes = {
            background: 'bg-gray-100 dark:bg-gray-700',
            text: 'text-gray-700 dark:text-gray-300',
            icon: IoWarning
        };

        if (paymentStatus === 's') { // موفق (Success)
            classes.background = 'bg-green-100 dark:bg-green-900/50';
            classes.text = 'text-green-700 dark:text-green-300';
            classes.icon = IoCheckmarkCircle;
        } else if (paymentStatus === 'p') { // در انتظار (Pending)
            classes.background = 'bg-yellow-100 dark:bg-yellow-900/50';
            classes.text = 'text-yellow-700 dark:text-yellow-300';
            classes.icon = IoWarning;
        } else if (paymentStatus === 'f') { // ناموفق (Failed)
            classes.background = 'bg-red-100 dark:bg-red-900/50';
            classes.text = 'text-red-700 dark:text-red-300';
            classes.icon = IoCloseCircle;
        }
        
        if (status === 'e' || status === 'x') {
            classes.background = 'bg-gray-200 dark:bg-gray-900';
            classes.text = 'text-gray-500 dark:text-gray-400';
            classes.icon = IoCloseCircle;
        }

        return classes;
    }

    // --- توابع کمکی ---

    const getAccentColor = (index: number) =>
        ACCENT_COLORS[index % ACCENT_COLORS.length];

    const toggleExpand = (pk: number) => {
        setExpandedEventPk(pk === expandedEventPk ? null : pk);
    };

    const formatDateTime = (isoDate: string) => {
        return new Date(isoDate).toLocaleString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    const formatPrice = (price: string) => {
        const number = parseFloat(price);
        return number.toLocaleString("fa-IR"); 
    }

    // --- رندر UI ---
    
    return (
        <div className="space-y-12 p-4 sm:p-6 md:p-8">
            
            {/* --- بخش رزروهای من - استفاده از API جدید --- */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        سفارشات ایونت‌های شما
                    </h1>
                    {/* Select Box - (بدون تغییر) */}
                    <div className="relative">
                        <select className="appearance-none w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-primary-red">
                            <option>سفارشات جاری</option>
                            <option>سفارشات پیشین</option>
                            <option>کنسلی‌ها</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                {/* نمایش وضعیت لودینگ / خالی بودن */}
                {(loadingReservations || loading) ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">در حال بارگذاری سفارشات...</p>
                ) : reservations.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">هیچ سفارشی برای ایونت‌های شما ثبت نشده است.</p>
                ) : (
                    <div className="space-y-4">
                        {reservations.map((reservation) => {
                            const statusStyles = getStatusClasses(reservation.status, reservation.payment_status);
                            const StatusIcon = statusStyles.icon;

                            return (
                                <div 
                                    key={reservation.id} 
                                    className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border-r-4 border-indigo-500 flex flex-col md:flex-row justify-between items-start md:items-center transition-shadow duration-300 hover:shadow-lg`}
                                >
                                    <div className="space-y-1 md:space-y-0 md:space-x-4 flex-grow flex flex-wrap gap-x-6 gap-y-1">
                                        {/* عنوان/شناسه رزرو */}
                                        <div className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
                                            <IoTicketOutline className="ml-2 text-indigo-500" />
                                            <span>سفارش #{reservation.id}</span>
                                        </div>

                                        {/* تاریخ ایجاد */}
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <IoTimeOutline className="ml-1 text-base text-teal-500" />
                                            <span>ثبت شده در: {formatDateTime(reservation.created_at)}</span>
                                        </div>
                                        
                                        {/* تعداد مهمانان */}
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <IoPeopleOutline className="ml-1 text-base text-teal-500" />
                                            <span>تعداد مهمان: {reservation.guests_count} نفر</span>
                                        </div>
                                        
                                        {/* قیمت کل */}
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <span className="text-base text-green-600 dark:text-green-400 font-bold ml-1">
                                                {formatPrice(reservation.total_price)}
                                            </span>
                                            <span className="text-xs">تومان</span>
                                        </div>
                                        
                                        {/* توضیحات (اگر وجود دارد) */}
                                        {reservation.note && (
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 w-full">
                                                <IoWarning className="ml-1 text-base text-yellow-500" />
                                                <span>توضیحات: {reservation.note}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* وضعیت پرداخت و رزرو (بر اساس پلن اساسی) */}
                                    <div className="mt-3 md:mt-0 flex-shrink-0">
                                        <span 
                                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${statusStyles.background} ${statusStyles.text}`}
                                        >
                                            <StatusIcon className="ml-1 text-base" />
                                            {reservation.status_display} ({reservation.payment_status_display})
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- بخش ایونت‌ها - طرح جدید و تعاملی --- */}
            <div className="border-t border-gray-300 dark:border-gray-700 pt-10">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
                    ایونت‌های ثبت شده شما
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
                ) : events.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">هیچ ایونتی ثبت نشده است.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event, index) => {
                            const isExpanded = event.pk === expandedEventPk;
                            const accentColor = getAccentColor(index);
                            
                            return (
                                <div
                                    key={event.pk}
                                    className={`
                                        relative p-6 rounded-3xl shadow-2xl 
                                        bg-white dark:bg-gray-800/80 
                                        border-t-4 ${accentColor} 
                                        ${!isExpanded ? 'hover:scale-[1.03] hover:shadow-xl' : 'scale-[1.01] shadow-2xl ring-2 ring-opacity-70 ring-red-500/50'}
                                        transition-all duration-300 ease-in-out 
                                        overflow-hidden group flex flex-col justify-between
                                    `}
                                >
                                    {/* Visual Effect - Light/Dark adapted */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 dark:hidden"
                                        style={{
                                            backgroundImage: `radial-gradient(circle at top right, rgba(255,255,255,0.4), rgba(255,255,255,0))`,
                                        }}
                                    ></div>

                                    {/* 1. بخش اطلاعات اصلی */}
                                    <div className="relative z-10 space-y-3 text-right">
                                        <span className="text-xs font-medium uppercase tracking-widest text-red-600 dark:text-red-400">
                                            ایونت #{event.pk}
                                        </span>

                                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white transition duration-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                                            {event.event_name}
                                        </h3>

                                        <div className="text-sm space-y-2">
                                            
                                            {/* نام شعبه - RTL Corrected */}
                                            <div className="flex items-center flex-row-reverse justify-start text-gray-600 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-1 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-4 0H5m4 0h6m-3 0V7m-4 4h10m-10 4h.01M16 12h.01"></path></svg>
                                                <span className="font-medium">شعبه:</span>
                                                <span className="mr-1 font-semibold">{event.branch_name}</span>
                                            </div>
                                            
                                            {/* تاریخ و زمان - RTL Corrected */}
                                            <div className="flex items-center flex-row-reverse justify-start text-gray-600 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-1 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span className="font-medium">شروع:</span>
                                                <span className="mr-1 font-semibold">{formatDateTime(event.starts_at)}</span>
                                            </div>
                                            
                                            {/* قیمت و مدت - RTL Corrected */}
                                            <div className="flex items-center flex-row-reverse justify-start text-gray-600 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-1 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                <span className="font-medium">قیمت:</span>
                                                <span className="mr-1 font-semibold">{event.price} تومان</span> ({event.duration_minutes} دقیقه)
                                            </div>

                                                {/* ظرفیت - RTL Corrected */}
                                                <div className="flex items-center flex-row-reverse justify-start text-gray-600 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-1 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m4-10a4 4 0 11-8 0 4 4 0 018 0zM7 13H3v-2a3 3 0 015.356-1.857M16 12h2m-2 2h4m-4 2h2m-6-10h4M4 14h6m-6-6h6"></path></svg>
                                                <span className="font-medium">ظرفیت:</span>
                                                <span className="mr-1 font-semibold">{event.min_capacity} تا {event.max_capacity} نفر</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. بخش دکمه باز و بسته کردن */}
                                    <div className="relative z-10 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => toggleExpand(event.pk)}
                                            className={`w-full py-2 rounded-lg text-sm font-bold transition-colors duration-200 
                                                ${isExpanded 
                                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                                    : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-gray-700 dark:text-red-400'
                                                }`}
                                        >
                                            {isExpanded ? "بستن جزئیات" : "مشاهده جزئیات بیشتر"}
                                            <svg className={`w-4 h-4 inline-block ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                    </div>

                                    {/* 3. بخش جزئیات گسترش یافته (Expandable Section) */}
                                    {isExpanded && (
                                        <div 
                                            className="relative z-10 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 text-right animate-slideDown"
                                            style={{ animationDuration: '0.3s' }}
                                        >
                                            
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">اطلاعات تکمیلی شعبه ({event.branch_name})</h4>
                                            
                                            <div className="text-sm space-y-3">
                                                
                                                {/* تلفن - RTL Corrected */}
                                                <div className="flex items-center flex-row-reverse justify-start text-gray-700 dark:text-gray-300">
                                                    <svg className="w-4 h-4 mr-1 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                    <span className="font-medium">تلفن تماس:</span>
                                                    <a href={`tel:${event.branch_data.phone}`} className="mr-1 font-mono text-red-600 dark:text-red-400 hover:text-red-500">{event.branch_data.phone}</a>
                                                </div>
                                                
                                                {/* ساعات کاری - RTL Corrected */}
                                                <div className="flex items-center flex-row-reverse justify-start text-gray-700 dark:text-gray-300">
                                                    <svg className="w-4 h-4 mr-1 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <span className="font-medium">ساعات کاری:</span>
                                                    <span className="mr-1 font-medium">{event.branch_data.open_hours.mon_fri}</span>
                                                </div>
                                            </div>

                                            <div className="text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-dashed border-gray-300 dark:border-gray-700 text-justify">
                                                **قوانین ایونت:** {event.terms_text}
                                            </div>

                                            {/* دکمه نقشه */}
                                            <a 
                                                href={`http://googleusercontent.com/maps.google.com/4?q=${event.branch_data.latitude},${event.branch_data.longitude}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full py-2 px-4 rounded-lg text-sm font-bold text-center bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center mt-3"
                                            >
                                                مشاهده موقعیت شعبه روی نقشه
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;