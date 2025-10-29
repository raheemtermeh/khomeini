import React from 'react';
import { IoRocketOutline, IoEyeOutline, IoHeartOutline, IoTimeOutline, IoPeopleOutline, IoCodeSlashOutline, IoLayersOutline, IoFlaskOutline, IoLaptopOutline, IoBulbOutline, IoLocationOutline, IoCallOutline, IoMegaphoneOutline, IoAnalyticsOutline, IoBarChartOutline, IoRibbonOutline, IoSparklesOutline, IoLockClosedOutline, IoWalletOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { FiTarget, FiBriefcase, FiZap } from 'react-icons/fi';
import { BsCheckCircle } from 'react-icons/bs';

// =================================================================
// 🎨 کامپوننت‌های کمکی
// =================================================================

// کامپوننت کارت محتوا (با استایل مینیمال - بدون حاشیه رنگی)
const ContentBlock: React.FC<{ icon: React.ElementType, title: string, description: string, delay: number, color: string }> = ({ icon: Icon, title, description, delay, color }) => (
    <div 
        className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out border-l-4 border-transparent hover:border-${color}-500/50 animate-slideUp transform hover:shadow-xl hover:shadow-gray-400/10`}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
        <div className="flex items-start mb-4">
            <div className={`p-3 rounded-full bg-${color}-500/10 dark:bg-${color}-900/50 flex-shrink-0 ml-3`}>
                <Icon size={24} className={`text-${color}-600 dark:text-${color}-400`} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                {title}
            </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm pr-1">
            {description}
        </p>
    </div>
);

// کامپوننت عضو تیم (با استایل دایره‌ای ساده)
const TeamMemberCard: React.FC<{ name: string, role: string, icon: React.ElementType, color: string }> = ({ name, role, icon: Icon, color }) => (
    <div className={`p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col items-center border-t-4 border-${color}-500/50 transform hover:scale-[1.05] transition-transform duration-300`}>
        <div className={`p-4 rounded-full bg-${color}-500/10 dark:bg-${color}-900/50 mb-3`}>
            <Icon size={30} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
        <h4 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
    </div>
);

// =================================================================
// 🖥️ کامپوننت اصلی About
// =================================================================

const About = () => {
    
    // محتوای عمیق
    const coreValues = [
        { icon: IoHeartOutline, title: 'اعتماد محوری', description: 'ایجاد رابطه بر اساس گزارش‌های دقیق مالی و حفظ حریم خصوصی کاربران نهایی.', color: 'indigo' },
        { icon: IoCodeSlashOutline, title: 'نوآوری پیوسته', description: 'استفاده از هوش مصنوعی برای پیش‌بینی تقاضا و بهینه‌سازی ظرفیت رویدادهای شما.', color: 'red' },
        { icon: IoLayersOutline, title: 'شفافیت عملیاتی', description: 'تمامی قوانین، کمیسیون‌ها و آمارهای عملکردی شما کاملاً شفاف و بدون ابهام ارائه می‌شوند.', color: 'teal' },
        { icon: IoFlaskOutline, title: 'رشد متقابل', description: 'موفقیت ما در گرو افزایش درآمد و پایداری کسب‌وکار شرکای کافه است.', color: 'yellow' },
    ];
    
    const achievements = [
        { title: 'بیش از ۱۲۰ کافه فعال', description: 'تثبیت حضور در ۵ شهر بزرگ ایران', icon: IoLocationOutline, color: 'indigo' },
        { title: 'رشد سالانه ۲۵٪', description: 'درآمد ثبت‌شده رویدادها در سال ۱۴۰۳', icon: IoBarChartOutline, color: 'red' },
        { title: '۹۹.۹٪ رضایت کیفی', description: 'بر اساس بازخورد مهمانان و کاربران ثبت‌نام‌شده', icon: IoRibbonOutline, color: 'teal' },
        { title: 'اولین پلتفرم هوشمند', description: 'در زمینه پیشنهاد قیمت و زمان‌بندی رویداد با هوش مصنوعی', icon: IoSparklesOutline, color: 'yellow' },
    ];
    
    const futureVision = [
        { icon: IoTimeOutline, title: 'فاز ۱: تثبیت عملیاتی (تا ۱۴۰۴)', description: 'هدف: یکپارچه‌سازی کامل سیستم مدیریت موجودی (Inventory) با رویدادها.', isCurrent: false, delay: 200 },
        { icon: IoRocketOutline, title: 'فاز ۲: هوش تجاری (۱۴۰۴-۱۴۰۵)', description: 'هدف: راه‌اندازی ماژول تحلیل رقابتی و ابزارهای پیش‌بینی خودکار قیمت.', isCurrent: true, delay: 400 },
        { icon: IoEyeOutline, title: 'فاز ۳: گسترش ملی (۱۴۰۶ به بعد)', description: 'هدف: گسترش حضور فان زون به ۱۰ استان کشور و ورود به خدمات مشاوره برندینگ رویداد.', isCurrent: false, delay: 600 },
    ];

    const teamMembers = [
        { name: 'محمدی (CEO)', role: 'استراتژی و توسعه', icon: FiBriefcase, color: 'indigo' },
        { name: 'رضایی (CTO)', role: 'فناوری و محصول', icon: IoCodeSlashOutline, color: 'red' },
        { name: 'نوری (CMO)', role: 'بازاریابی و محتوا', icon: IoPeopleOutline, color: 'teal' },
    ];
    
    const contactDepartments = [
        { title: 'واحد پشتیبانی و عملیات', role: 'پاسخگویی به مشکلات روزمره و فنی', icon: IoCallOutline, color: 'teal' },
        { title: 'واحد مالی و حسابداری', role: 'تسویه حساب و پیگیری کمیسیون', icon: IoWalletOutline, color: 'indigo' },
        { title: 'واحد توسعه همکاری', role: 'قراردادها و طرح‌های رشد جدید', icon: IoLocationOutline, color: 'yellow' },
    ];


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">

            {/* ✨ بخش ۱: هدر و ماموریت - مینیمال، متمرکز و با پدینگ کمتر */}
            <div className="bg-white dark:bg-gray-800 p-8 md:p-20 shadow-lg mb-12 animate-fadeIn text-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-md font-semibold uppercase text-red-500 dark:text-red-400 mb-2 flex items-center justify-center">
                        <FiBriefcase className="ml-2" />
                        ماموریت ما: رشد هوشمند برای فضاهای اجتماعی
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 leading-snug">
                        ما <span className="text-indigo-600 dark:text-indigo-400">شریک استراتژیک</span> شما در بازار رویدادهای پرتقاضا هستیم.
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        فان زون با تکیه بر تحلیل داده و فناوری‌های نوین، ظرفیت‌های پنهان درآمدی کافه شما را فعال می‌کند تا رویدادهای شما همیشه **پرتقاضا** و **سودآور** باشند.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 sm:p-0">
                
                {/* بخش ۲: ارزش‌های اصلی - چیدمان جریان ستونی (Column Flow) */}
                <div className="py-12 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-12">
                        ارزش‌های محوری و تعهد ما
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreValues.map((value, index) => (
                            <ContentBlock key={index} {...value} delay={200 + index * 100} color={value.color} />
                        ))}
                    </div>
                </div>
                
                {/* ✨ بخش ۳: فناوری و رویکرد داده‌محور (محتوای بیشتر) */}
                <div className="py-12 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
                        <IoLaptopOutline className="ml-3 text-indigo-500" />
                        تیم تکنولوژی و رویکرد داده‌محور ما
                    </h2>
                    <div className="grid lg:grid-cols-3 gap-8 text-gray-700 dark:text-gray-300">
                        
                         <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-r-4 border-red-500 animate-slideUp">
                            <IoAnalyticsOutline size={30} className="mb-3 text-red-500" />
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">هوش مصنوعی و قیمت‌گذاری</h3>
                            <p className="leading-loose text-sm mt-2">
                                الگوریتم‌های ما به صورت مستمر داده‌های بازار را تحلیل می‌کنند تا بهترین نقطه قیمتی را برای رویدادهای شما پیشنهاد دهند و سود شما را به حداکثر برسانند.
                            </p>
                        </div>
                        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-r-4 border-teal-500 animate-slideUp" style={{ animationDelay: '200ms' }}>
                            <IoLockClosedOutline size={30} className="mb-3 text-teal-500" />
                            <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400">امنیت ۱۰۰٪ داده‌ها</h3>
                            <p className="leading-loose text-sm mt-2">
                                تمامی تراکنش‌ها و اطلاعات شخصی در زیرساخت ابری رمزنگاری‌شده نگهداری می‌شوند. ما متعهد به حفاظت از حریم خصوصی شما و مشتریانتان هستیم.
                            </p>
                        </div>
                        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-r-4 border-yellow-500 animate-slideUp" style={{ animationDelay: '400ms' }}>
                            <FiZap size={30} className="mb-3 text-yellow-500" />
                            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">تضمین پایداری</h3>
                            <p className="leading-loose text-sm mt-2">
                                زیرساخت ما با آپتایم ۹۹.۹۹٪ آماده سرویس‌دهی است تا شما هرگز رزروی را به دلیل اختلال فنی از دست ندهید.
                            </p>
                        </div>
                    </div>
                </div>

                {/* بخش ۴: تیم بنیان‌گذار (Human Touch) */}
                <div className="py-12 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-10">
                        تیم ما: خالقان فان زون
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <TeamMemberCard key={index} {...member} icon={member.icon} color={member.color} />
                        ))}
                    </div>
                </div>
                
                {/* ✨ بخش ۵: دستاوردها و تعهدنامه پایداری */}
                <div className="py-12 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-10 flex items-center justify-center">
                        <IoRibbonOutline className="ml-3 text-red-500" />
                        دستاوردها و تعهدات ما
                    </h2>
                    
                    {/* دستاوردها */}
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        {achievements.map((item, index) => (
                            <div 
                                key={index} 
                                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-indigo-500/50 animate-slideUp"
                                style={{ animationDelay: `${300 + index * 100}ms` }}
                            >
                                <item.icon size={40} className={`text-${item.color}-600 dark:text-${item.color}-400 mx-auto mb-2`} />
                                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* تعهدنامه پایداری */}
                    <div className="bg-red-50 dark:bg-red-900/40 p-8 rounded-2xl shadow-xl border-r-8 border-red-500 animate-fadeIn" style={{ animationDelay: '800ms' }}>
                        <h3 className="text-2xl font-extrabold text-red-700 dark:text-red-300 mb-4 flex items-center">
                            <IoBarChartOutline className="ml-3" />
                            تعهدنامه پایداری و رشد
                        </h3>
                        <p className="text-lg text-red-800 dark:text-red-200 leading-relaxed">
                            ما متعهد می‌شویم که سرمایه‌گذاری خود را در بخش **هوش تجاری** و **امنیت داده‌ها** به صورت سالانه افزایش دهیم. همچنین، هدف ما این است که تا پایان سال ۱۴۰۵، **۱۰۰٪** از کافه‌های همکار به سوددهی از طریق رویدادها برسند.
                        </p>
                    </div>
                </div>

                {/* بخش ۶: چشم‌انداز آینده و مسیر حرکت - Timeline */}
                <div className="py-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-10 flex items-center justify-center">
                        <IoRocketOutline className="ml-3 text-indigo-500" />
                        مسیر حرکت و چشم‌انداز آینده
                    </h2>
                    
                    <div className="max-w-4xl mx-auto space-y-6">
                        {futureVision.map((phase, index) => (
                            // استفاده از کلاس‌های ساده‌تر برای Timeline
                            <div 
                                key={index} 
                                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ease-out border-r-4 border-dashed animate-slideUp
                                           ${phase.isCurrent ? 'border-red-500 bg-red-50 dark:bg-gray-700/50 shadow-md' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                                style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'both' }}
                            >
                                <div className={`p-3 rounded-full flex-shrink-0 ${phase.isCurrent ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    <phase.icon size={20} />
                                </div>
                                <div>
                                    <h4 className={`font-extrabold ${phase.isCurrent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {phase.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {phase.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* بخش ۷: تماس با تیم‌ها */}
                <div className="py-12 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-10 flex items-center justify-center">
                        <IoCallOutline className="ml-3 text-red-500" />
                        نیاز به پشتیبانی دارید؟ تماس با دپارتمان‌ها
                    </h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {contactDepartments.map((dept, index) => (
                             <div 
                                key={index}
                                className={`p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-b-4 border-${dept.color}-500/80 animate-slideUp transform hover:scale-[1.02]`}
                                style={{ animationDelay: `${200 + index * 150}ms`, animationFillMode: 'both' }}
                            >
                                <IoMegaphoneOutline size={30} className={`text-${dept.color}-600 dark:text-${dept.color}-400 mb-3`} />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{dept.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{dept.role}</p>
                                <a href="/support" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-bold flex items-center">
                                    <IoArrowForwardOutline className="transform rotate-180 ml-1" />
                                    ارسال درخواست همکاری
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ⚠️ باکس نهایی: تغییر بک‌گراند به رنگ تخت و سایه مینیمال */}
                <div className="mt-16 text-center p-8 md:p-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white animate-fadeInUp">
                    <p className="text-3xl font-extrabold mb-3">
                        ما بیش از یک پلتفرم رزرو، ما شریک رشد شما هستیم.
                    </p>
                    <a href="/support" className="inline-flex items-center px-10 py-4 bg-white text-indigo-600 font-bold rounded-lg shadow-md hover:bg-gray-200 transition-transform duration-300 transform hover:scale-[1.05]">
                        شروع همکاری
                    </a>
                </div>

            </div>
        </div>
    );
};

export default About;