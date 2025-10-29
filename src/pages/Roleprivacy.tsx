import React, { useState } from 'react';
import { IoShieldCheckmarkOutline, IoLockClosedOutline, IoPeopleOutline, IoDocumentTextOutline, IoTimeOutline, IoArrowForwardOutline, IoLocationOutline, IoAnalyticsOutline, IoChevronDown, IoWarning, IoWalletOutline, IoCodeSlashOutline } from 'react-icons/io5';
import { FiDatabase, FiSettings } from 'react-icons/fi';

// =================================================================
// 📊 داده‌های استاتیک: محتوای عمیق و معنی‌دار مربوط به فان زون
// =================================================================

interface ContentItem {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string; // Tailwind color class
    content: JSX.Element;
}

// ✨ محتوای خییییلی بیشتر در ۹ بخش حیاتی
const policyContent: ContentItem[] = [
    {
        id: 'overview',
        title: '۱. مقدمه، دامنه و تعهدات ما',
        icon: IoDocumentTextOutline,
        color: 'text-indigo-500',
        content: (
            <div className="space-y-4">
                <p className="leading-relaxed border-r-4 border-indigo-500/50 pr-3 font-semibold text-gray-800 dark:text-gray-200">
                    این سند قرارداد جامع بین شما (به عنوان شریک کافه یا مدیر رویداد) و فان زون است. با استفاده از پلتفرم ما، شما با تمامی تعهدات عملیاتی و سیاست‌های حریم خصوصی موافقت می‌نمایید.
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">تعهد فان زون:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>حفظ پایداری ۹۹.۹٪ سیستم و دسترسی به پنل مدیریت.</li>
                    <li>تضمین شفافیت کامل در گزارش‌های مالی و محاسبات کمیسیون.</li>
                    <li>حفاظت از داده‌های مشتریان نهایی بر اساس بالاترین استانداردهای امنیتی.</li>
                </ul>
                <div className="bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-sm">
                    <p className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center">
                        <IoTimeOutline className="ml-2" /> آخرین به‌روزرسانی: ۱۴۰۳/۰۸/۰۸
                    </p>
                    <span className="bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs font-bold">الزامی</span>
                </div>
            </div>
        ),
    },
    {
        id: 'roles',
        title: '۲. مسئولیت‌های عملیاتی و مدیریت رویداد',
        icon: IoPeopleOutline,
        color: 'text-red-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold border-r-4 border-red-500 pr-2 text-red-600 dark:text-red-400">تعهد به اجرای رویداد (SLA)</h3>
                <p className="leading-relaxed">
                    هرگونه عدم تطابق در زمان، ظرفیت یا محتوای رویداد با آنچه در پلتفرم ثبت شده، نقض قرارداد عملیاتی محسوب می‌شود. در صورت لغو رویداد، بازپرداخت‌ها شامل هزینه‌های عملیاتی کنسلی است که از درآمد بعدی شما کسر خواهد شد.
                </p>
                <h3 className="text-xl font-bold border-r-4 border-red-500 pr-2 text-red-600 dark:text-red-400">قوانین ظرفیت و اورسلینگ (Overselling)</h3>
                <p className="leading-relaxed">
                    کافه‌دار موظف است حداکثر ظرفیت واقعی و ایمن کافه را ثبت نماید. فروش بلیط بیشتر از ظرفیت اعلامی (Overselling) ممنوع است و تمامی خسارات ناشی از آن بر عهده کافه‌دار خواهد بود.
                </p>
            </div>
        ),
    },
    {
        id: 'financial_liability',
        title: '۳. مسئولیت‌های مالی و حل اختلاف',
        icon: IoWalletOutline,
        color: 'text-teal-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold border-r-4 border-teal-500 pr-2 text-teal-600 dark:text-teal-400">سیاست پرداخت و کمیسیون</h3>
                <p className="leading-relaxed">
                    تسویه حساب‌ها به صورت دوره‌ای (هفتگی/ماهانه) پس از کسر نرخ کمیسیون فان زون انجام می‌گردد. نرخ کمیسیون بر اساس نوع رویداد و حجم فروش متغیر بوده و در پنل مدیریت قابل مشاهده است.
                </p>
                <h3 className="text-xl font-bold border-r-4 border-teal-500 pr-2 text-teal-600 dark:text-teal-400">حل اختلافات مالی</h3>
                <p className="leading-relaxed">
                    در صورت بروز اختلاف بر سر تراکنش‌ها یا مبلغ تسویه، کافه‌دار موظف است اعتراض خود را ظرف مدت ۷ روز کاری پس از دریافت گزارش، ثبت کند. مرجع نهایی حل اختلاف، واحد حسابرسی داخلی فان زون است.
                </p>
            </div>
        ),
    },
    {
        id: 'privacy_data',
        title: '۴. حریم خصوصی و مالکیت داده‌های عملیاتی',
        icon: IoLockClosedOutline,
        color: 'text-purple-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold border-r-4 border-purple-500 pr-2 text-purple-600 dark:text-purple-400">کنترل بر داده‌ها</h3>
                <p className="leading-relaxed">
                    **مالکیت داده‌های عملکردی** (آمار رزرو، درآمد، نرخ پر شدن کافه) کاملاً متعلق به کافه‌دار است. فان زون این داده‌ها را تنها برای ارائه خدمات بهتر و گزارش‌دهی به خود شما استفاده می‌کند.
                </p>
                <h3 className="text-xl font-bold border-r-4 border-purple-500 pr-2 text-purple-600 dark:text-purple-400">ردیابی و تحلیل رفتار</h3>
                <p className="leading-relaxed">
                    ما از ابزارهای تحلیلی (مانند کوکی‌ها) برای ردیابی تعاملات شما با پنل مدیریت استفاده می‌کنیم تا تجربه کاربری را بهبود دهیم. این داده‌ها هرگز با اطلاعات هویتی شما مرتبط نمی‌شوند.
                </p>
            </div>
        ),
    },
    {
        id: 'data_retention',
        title: '۵. نگهداری و حذف داده‌ها (Data Retention)',
        icon: FiDatabase,
        color: 'text-orange-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold border-r-4 border-orange-500 pr-2 text-orange-600 dark:text-orange-400">دوره نگهداری داده‌های مالی</h3>
                <p className="leading-relaxed">
                    به دلیل الزامات قانونی و مالی، داده‌های مربوط به تراکنش‌ها و تسویه‌حساب‌ها به مدت **حداقل ۷ سال** پس از پایان همکاری نگهداری خواهند شد.
                </p>
                <h3 className="text-xl font-bold border-r-4 border-orange-500 pr-2 text-orange-600 dark:text-orange-400">درخواست حذف داده</h3>
                <p className="leading-relaxed">
                    شما می‌توانید درخواست حذف داده‌های غیرضروری (مانند توضیحات رویدادهای قدیمی) را ثبت کنید. اما داده‌های اصلی مالی و هویتی طبق قانون بایگانی می‌شوند.
                </p>
            </div>
        ),
    },
    {
        id: 'ip_rights',
        title: '۶. حقوق مالکیت فکری (IP) و محتوا',
        icon: IoCodeSlashOutline,
        color: 'text-blue-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold border-r-4 border-blue-500 pr-2 text-blue-600 dark:text-blue-400">مالکیت محتوای کافه</h3>
                <p className="leading-relaxed">
                    تصاویر، لوگوها و توضیحات متنی رویداد که شما در پلتفرم آپلود می‌کنید، همچنان تحت مالکیت شما باقی می‌ماند. شما به فان زون مجوز غیرقابل فسخ برای نمایش و تبلیغ آن محتوا را می‌دهید.
                </p>
                <h3 className="text-xl font-bold border-r-4 border-blue-500 pr-2 text-blue-600 dark:text-blue-400">استفاده از برند فان زون</h3>
                <p className="leading-relaxed">
                    استفاده از لوگو، نام و علائم تجاری فان زون برای مقاصد تبلیغاتی خارج از توافق‌نامه، مستلزم کسب اجازه کتبی از بخش حقوقی ماست.
                </p>
            </div>
        ),
    },
    {
        id: 'location',
        title: '۷. قوانین مکان‌یابی و نقشه‌ها',
        icon: IoLocationOutline,
        color: 'text-lime-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold border-r-4 border-lime-500 pr-2 text-lime-600 dark:text-lime-400">دقت مکان کافه</h3>
                <p className="leading-relaxed">
                    شما باید مختصات جغرافیایی (Latitude/Longitude) کافه را با دقت حداکثری وارد کنید تا کاربران نهایی در مسیریابی دچار مشکل نشوند. ارائه مختصات غلط، تخلف عملیاتی محسوب می‌شود.
                </p>
                <h3 className="text-xl font-bold border-r-4 border-lime-500 pr-2 text-lime-600 dark:text-lime-400">حریم خصوصی کاربر نهایی</h3>
                <p className="leading-relaxed">
                    فان زون موقعیت مکانی کاربران نهایی را بدون رضایت صریح آنها جمع‌آوری، ذخیره یا به کافه‌دار ارائه نمی‌کند.
                </p>
            </div>
        ),
    },
    {
        id: 'compliance',
        title: '۸. انطباق قانونی و حوزه قضایی',
        icon: IoShieldCheckmarkOutline,
        color: 'text-pink-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold border-r-4 border-pink-500 pr-2 text-pink-600 dark:text-pink-400">قوانین حاکم</h3>
                <p className="leading-relaxed">
                    این سند و قرارداد همکاری تحت قوانین جمهوری اسلامی ایران تنظیم شده و کلیه اختلافات در دادگاه‌های عمومی تهران رسیدگی خواهد شد.
                </p>
                <h3 className="text-xl font-bold border-r-4 border-pink-500 pr-2 text-pink-600 dark:text-pink-400">وظیفه انطباق با قوانین محلی</h3>
                <p className="leading-relaxed">
                    کافه‌دار شخصاً مسئول انطباق با کلیه قوانین محلی کسب‌وکار، مجوزها و مقررات بهداشتی و انتظامی است.
                </p>
            </div>
        ),
    },
    {
        id: 'updates',
        title: '۹. تغییرات در سیاست‌ها و اطلاع‌رسانی',
        icon: IoTimeOutline,
        color: 'text-yellow-500',
        content: (
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                    فان زون حق دارد هر زمان که صلاح بداند، تغییراتی در این سند ایجاد کند. شما حداقل **۳۰ روز قبل** از اعمال تغییرات مهم، از طریق ایمیل یا اطلاعیه‌های پنل مدیریت مطلع خواهید شد.
                </p>
                <p className="leading-relaxed font-bold">
                    ادامه استفاده از پلتفرم پس از تاریخ اعمال تغییرات، به منزله پذیرش نسخه جدید قوانین است.
                </p>
            </div>
        ),
    },
];

// =================================================================
// 🎨 کامپوننت AccordionItem (با انیمیشن)
// =================================================================

const AccordionItem: React.FC<{ item: ContentItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
    const Icon = item.icon;
    
    return (
        <div 
            className="rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-all duration-500 hover:shadow-xl dark:hover:shadow-indigo-500/10 border border-gray-100 dark:border-gray-700"
            style={{ overflow: 'hidden' }}
        >
            {/* سربرگ آکاردئون */}
            <button
                onClick={onClick}
                className="flex justify-between items-center w-full p-5 text-right transition-colors duration-300 dark:hover:bg-gray-700/50"
            >
                <div className="flex items-center gap-3">
                    <Icon size={24} className={`flex-shrink-0 transition-transform duration-300 ${item.color} ${isOpen ? 'animate-pulse' : ''}`} />
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                        {item.title}
                    </h2>
                </div>
                <IoChevronDown 
                    size={20} 
                    className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
                />
            </button>

            {/* محتوای آکاردئون (با انیمیشن باز شدن) */}
            <div 
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-5 pt-0 text-base border-t border-dashed border-gray-200 dark:border-gray-700">
                        {item.content}
                    </div>
                </div>
            </div>
        </div>
    );
};


// =================================================================
// 🖥️ کامپوننت اصلی RolePrivacy
// =================================================================

const Roleprivacy = () => {
    // برای مدیریت وضعیت آکاردئون‌ها، یک آرایه از IDهای باز شده استفاده می‌کنیم
    const [openSections, setOpenSections] = useState<string[]>([]);

    const handleAccordionClick = (id: string) => {
        setOpenSections(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) // بستن
                : [...prev, id] // باز کردن
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
            
            {/* هدر اصلی صفحه */}
            <div className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
                    <IoShieldCheckmarkOutline className="ml-3 text-red-500" />
                    قوانین و حریم خصوصی فان زون
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    تعهدنامه جامع همکاری، مسئولیت‌ها و سیاست‌های حفاظت از داده‌ها در ۹ بخش کلیدی.
                </p>
            </div>

            {/* بخش اصلی محتوا (آکاردئون‌های پرمحتوا) */}
            <div className="max-w-4xl mx-auto space-y-4">
                {policyContent.map((item) => (
                    <AccordionItem 
                        key={item.id}
                        item={item}
                        isOpen={openSections.includes(item.id)}
                        onClick={() => handleAccordionClick(item.id)}
                    />
                ))}
            </div>

            {/* بخش خلاصه و فراخوان نهایی */}
            <div className="max-w-4xl mx-auto mt-12 p-6 rounded-2xl bg-gradient-to-l from-black-600 to-red-500 dark:from-[#101725]-800 dark:to-black-700 shadow-2xl shadow-red-500/30 text-black animate-fadeInUp dark:text-white">
                <h3 className="text-2xl font-extrabold mb-3 flex items-center">
                    <IoWarning size={28} className="ml-2" />
                    فراخوان نهایی: پذیرش قوانین
                </h3>
                <p className="font-medium">
                    ما به شما توصیه می‌کنیم که تمامی ۹ بخش این سند را به دقت مطالعه کنید. ادامه فعالیت شما در پنل مدیریت، به منزله **تایید و پذیرش بدون قید و شرط** تمامی قوانین و تعهدات فان زون است.
                </p>
                <button className="mt-4 px-6 py-3 bg-[#c20404] text-black-600 rounded-lg font-bold hover:bg-primary-red transition-transform duration-300 transform hover:scale-[1.02] shadow-lg">
                    تایید قوانین و ادامه به داشبورد
                </button>
            </div>
        </div>
    );
}

export default Roleprivacy;