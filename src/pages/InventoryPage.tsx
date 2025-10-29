import React, { useState, useMemo } from 'react';
import { 
    IoBarChartOutline, IoAlertCircleOutline, IoCheckmarkCircleOutline, IoRemoveCircleOutline, 
    IoAddCircleOutline, IoSettingsOutline, IoTimeOutline, IoCafeOutline, IoPricetagOutline, 
    IoSearchOutline, IoBasketOutline, IoWarning, IoTrendingUp, IoCubeOutline, 
    IoFlashOutline, IoBusinessOutline, IoCallOutline, IoCalendarOutline, IoLocationOutline, 
    IoLayersOutline, IoChatbubblesOutline 
} from 'react-icons/io5';
import { FiFilter, FiDollarSign } from 'react-icons/fi';

// =================================================================
// 📊 ساختار داده و داده‌های استاتیک عمیق‌تر
// =================================================================

interface Supplier {
    id: number;
    name: string;
    phone: string;
    delivery_time_days: number; // ✨ زمان تحویل به روز
}

interface InventoryItem {
    id: number;
    name: string;
    unit: string;
    current_stock: number;
    low_threshold: number;
    category: 'مواد اولیه قهوه' | 'لبنیات و طعم‌دهنده‌ها' | 'محصولات نهایی پختنی' | 'لوازم یکبار مصرف' | 'ابزار و تجهیزات';
    cost_per_unit: number;
    daily_consumption: number;
    last_updated: string;
    supplier_id: number;
}

const initialSuppliers: Supplier[] = [
    { id: 101, name: 'تأمین‌کننده حبوبات آرتا', phone: '0912-111-2233', delivery_time_days: 3 },
    { id: 102, name: 'پخش لبنیات طلایی', phone: '021-4455-6677', delivery_time_days: 1 },
    { id: 103, name: 'فروشگاه ظروف یکتا', phone: '0919-888-7766', delivery_time_days: 5 },
];

const initialInventory: InventoryItem[] = [
    { id: 1, name: 'دانه قهوه روبوستا (برزیل)', unit: 'کیلوگرم', current_stock: 5, low_threshold: 10, category: 'مواد اولیه قهوه', cost_per_unit: 500000, daily_consumption: 1.5, last_updated: '۱۴۰۳/۰۸/۰۴ - ۱۶:۰۰', supplier_id: 101 },
    { id: 2, name: 'شیر کامل محلی', unit: 'لیتر', current_stock: 2, low_threshold: 15, category: 'لبنیات و طعم‌دهنده‌ها', cost_per_unit: 35000, daily_consumption: 4, last_updated: '۱۴۰۳/۰۸/۰۴ - ۱۱:۰۰', supplier_id: 102 },
    { id: 3, name: 'کیک ردولوت (قطعه)', unit: 'عدد', current_stock: 15, low_threshold: 5, category: 'محصولات نهایی پختنی', cost_per_unit: 45000, daily_consumption: 6, last_updated: '۱۴۰۳/0۸/۰۴ - ۰۹:۰۰', supplier_id: 102 },
    { id: 4, name: 'سیروپ کارامل', unit: 'بطری', current_stock: 1, low_threshold: 2, category: 'لبنیات و طعم‌دهنده‌ها', cost_per_unit: 180000, daily_consumption: 0.2, last_updated: '۱۴۰۳/۰۷/۲۸ - ۱۲:۰۰', supplier_id: 102 },
    { id: 5, name: 'لیوان کاغذی (کوچک)', unit: 'بسته ۱۰۰ عددی', current_stock: 3, low_threshold: 10, category: 'لوازم یکبار مصرف', cost_per_unit: 25000, daily_consumption: 0.8, last_updated: '۱۴۰۳/۰۷/۱۵ - ۱۰:۰۰', supplier_id: 103 },
    { id: 6, name: 'چای کیسه‌ای سیاه', unit: 'جعبه', current_stock: 25, low_threshold: 5, category: 'مواد اولیه قهوه', cost_per_unit: 80000, daily_consumption: 0.5, last_updated: '۱۴۰۳/۰۸/۰۲ - ۱۷:۰۰', supplier_id: 101 },
    { id: 7, name: 'فوم شیر ساز', unit: 'عدد', current_stock: 0, low_threshold: 1, category: 'ابزار و تجهیزات', cost_per_unit: 75000, daily_consumption: 0, last_updated: '۱۴۰۳/۰۸/۰۳ - ۰۸:۰۰', supplier_id: 103 },
];

// =================================================================
// 🎨 کامپوننت کارت موجودی (با Mini-Chart و Reorder Point)
// =================================================================

interface InventoryCardProps {
    item: InventoryItem;
    onUpdateStock: (id: number, amount: number) => void;
    supplier: Supplier | undefined;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item, onUpdateStock, supplier }) => {
    
    const isCritical = item.current_stock === 0;
    const isLow = item.current_stock <= item.low_threshold && item.current_stock > 0;
    const daysLeft = isCritical ? 0 : Math.floor(item.current_stock / item.daily_consumption) || '∞';
    
    // Reorder Point (نقطه سفارش مجدد) = (زمان تحویل * مصرف روزانه) + موجودی ایمنی
    // موجودی ایمنی را معادل آستانه هشدار (Low Threshold) در نظر می‌گیریم.
    const leadTime = supplier?.delivery_time_days || 3; // فرض ۳ روز در صورت عدم وجود تامین کننده
    const safetyStock = item.low_threshold;
    const reorderPoint = (leadTime * item.daily_consumption) + safetyStock;
    const needsImmediateOrder = item.current_stock <= reorderPoint;

    const getStatusStyle = () => {
        if (isCritical) return { icon: IoAlertCircleOutline, text: 'بحرانی', color: 'red' };
        if (needsImmediateOrder) return { icon: IoWarning, text: 'سفارش فوری', color: 'yellow' };
        return { icon: IoCheckmarkCircleOutline, text: 'مناسب', color: 'teal' };
    };

    const status = getStatusStyle();
    const statusColor = `text-${status.color}-600 dark:text-${status.color}-400`;

    // Mini Chart (برای نمایش بصری موجودی در برابر آستانه)
    const stockRatio = Math.min(100, (item.current_stock / item.low_threshold) * 20); // مقیاس بصری
    const chartColor = isCritical ? 'red' : needsImmediateOrder ? 'yellow' : 'teal';

    return (
        <div 
            className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl 
                        border-r-4 border-${status.color}-500/80 animate-slideUp`}
            style={{ animationDelay: '100ms' }}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-${status.color}-500/10 dark:bg-${status.color}-900/50`}>
                        <IoCubeOutline size={24} className={statusColor} />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                            {item.name}
                        </h3>
                        <p className={`text-xs font-semibold mt-0.5 text-gray-500 dark:text-gray-400`}>
                            {item.category}
                        </p>
                    </div>
                </div>
                {/* وضعیت و Reorder Point */}
                <div className={`text-sm font-bold flex flex-col items-end ${statusColor}`}>
                    <span className='flex items-center'>
                       <status.icon size={20} className="ml-1 animate-pulse-low" />
                       {status.text}
                    </span>
                    <span className='text-xs mt-1 text-gray-500 dark:text-gray-400'>
                        نقطه سفارش: {Math.ceil(reorderPoint)} {item.unit}
                    </span>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-3">
                
                {/* Mini Chart - نمایش گرافیکی */}
                <div className='flex items-end justify-center h-10 mb-4'>
                    <div className='flex items-end h-full gap-1 w-full'>
                        <div className={`w-1/2 h-full bg-gray-200 dark:bg-gray-700 rounded-lg relative`}>
                            {/* خط آستانه */}
                            <div className='absolute inset-y-0 right-0 w-1 bg-yellow-500'></div>
                            {/* موجودی فعلی */}
                            <div 
                                className={`h-full rounded-lg absolute bottom-0 right-0 transition-all duration-700 bg-${chartColor}-500`}
                                style={{ width: `${Math.min(100, (item.current_stock / reorderPoint) * 100)}%` }}
                            ></div>
                        </div>
                         <div className='w-1/2 flex flex-col items-end'>
                            <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                                {item.current_stock}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({item.unit})
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* کنترل موجودی لوکال */}
                <div className="flex justify-around gap-2 mt-4">
                    <button 
                        onClick={() => onUpdateStock(item.id, item.current_stock - 1)}
                        className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 font-bold transition hover:bg-red-500/20"
                        disabled={item.current_stock <= 0}
                    >
                        <IoRemoveCircleOutline size={20} className="inline ml-1" />
                        کاهش
                    </button>
                    <button 
                        onClick={() => onUpdateStock(item.id, item.current_stock + 1)}
                        className="flex-1 py-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold transition hover:bg-teal-500/20"
                    >
                        <IoAddCircleOutline size={20} className="inline ml-1" />
                        افزایش
                    </button>
                    <button 
                        className="p-2 rounded-lg bg-gray-500/10 text-gray-600 dark:text-gray-400 transition hover:bg-gray-500/20"
                        title="تنظیمات"
                    >
                        <IoSettingsOutline size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// 🖥️ کامپوننت اصلی InventoryPage
// =================================================================

const InventoryPage = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
    const [filter, setFilter] = useState<'همه' | 'بحرانی' | 'مناسب'>('همه');
    const [searchTerm, setSearchTerm] = useState('');
    const [newStockEntry, setNewStockEntry] = useState<{ id: number | null, amount: number }>({ id: null, amount: 0 });

    const formatPrice = (price: number) => price.toLocaleString('fa-IR') + ' تومان';

    // ✨ توابع کمکی محاسباتی
    const { criticalCount, lowCount, totalValue, avgDaysLeft } = useMemo(() => {
        const criticalCount = inventory.filter(item => item.current_stock === 0).length;
        const lowCount = inventory.filter(item => item.current_stock <= item.low_threshold && item.current_stock > 0).length;
        const totalValue = inventory.reduce((sum, item) => sum + (item.current_stock * item.cost_per_unit), 0);
        
        const validItems = inventory.filter(item => item.daily_consumption > 0 && item.current_stock > 0);
        const totalDaysLeft = validItems.reduce((sum, item) => sum + (item.current_stock / item.daily_consumption), 0);
        const avgDaysLeft = validItems.length > 0 ? Math.floor(totalDaysLeft / validItems.length) : 0;
        
        return { criticalCount, lowCount, totalValue, avgDaysLeft };
    }, [inventory]);

    // ✨ منطق ثبت ورود محموله جدید
    const handleShipmentEntry = () => {
        if (newStockEntry.id === null || newStockEntry.amount <= 0) return;
        
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === newStockEntry.id ? { 
                    ...item, 
                    current_stock: item.current_stock + newStockEntry.amount, 
                    last_updated: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) 
                } : item
            )
        );
        setNewStockEntry({ id: null, amount: 0 }); // ریست کردن فرم
    };

    // ✨ هندلر لوکال برای به‌روزرسانی موجودی
    const handleUpdateStock = (id: number, newStock: number) => {
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === id ? { 
                    ...item, 
                    current_stock: Math.max(0, newStock), 
                    last_updated: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) 
                } : item
            )
        );
    };

    // ✨ منطق فیلترینگ و جستجو
    const filteredInventory = useMemo(() => {
        let items = inventory;
        if (searchTerm) {
            items = items.filter(item => item.name.includes(searchTerm) || item.category.includes(searchTerm));
        }
        if (filter === 'بحرانی') {
            return items.filter(item => {
                const supplier = suppliers.find(s => s.id === item.supplier_id);
                const leadTime = supplier?.delivery_time_days || 3;
                const safetyStock = item.low_threshold;
                const reorderPoint = (leadTime * item.daily_consumption) + safetyStock;
                return item.current_stock <= reorderPoint;
            });
        }
        if (filter === 'مناسب') {
            return items.filter(item => {
                const supplier = suppliers.find(s => s.id === item.supplier_id);
                const leadTime = supplier?.delivery_time_days || 3;
                const safetyStock = item.low_threshold;
                const reorderPoint = (leadTime * item.daily_consumption) + safetyStock;
                return item.current_stock > reorderPoint;
            });
        }
        return items;
    }, [inventory, filter, searchTerm, suppliers]);

    const itemsToOrder = useMemo(() => {
        return inventory.filter(item => {
                const supplier = suppliers.find(s => s.id === item.supplier_id);
                const leadTime = supplier?.delivery_time_days || 3;
                const safetyStock = item.low_threshold;
                const reorderPoint = (leadTime * item.daily_consumption) + safetyStock;
                return item.current_stock <= reorderPoint;
            })
            .map(item => ({
                ...item,
                needed: item.low_threshold - item.current_stock, // مقدار مورد نیاز برای رسیدن به Low Threshold
                estimated_cost: (item.low_threshold - item.current_stock) * item.cost_per_unit
            }));
    }, [inventory, suppliers]);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
            
            {/* هدر اصلی */}
            <div className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
                    <IoBarChartOutline className="ml-3 text-red-500" />
                    مرکز کنترل موجودی و لجستیک
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    ابزار هوشمند برای ردیابی کسری موجودی، پیش‌بینی مصرف و مدیریت تأمین‌کنندگان.
                </p>
            </div>
            
            {/* ✨ بخش ۱: داشبورد وضعیت موجودی و پیش‌بینی */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
                {/* کارت کل موجودی */}
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-b-4 border-indigo-500">
                    <IoCubeOutline size={30} className="text-indigo-500 mb-2" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">کل اقلام</p>
                    <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{inventory.length}</p>
                </div>
                {/* کارت نیاز به سفارش */}
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-b-4 border-yellow-500">
                    <IoAlertCircleOutline size={30} className="text-yellow-500 mb-2" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">نیاز به سفارش</p>
                    <p className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400 mt-1">{itemsToOrder.length}</p>
                </div>
                 {/* کارت ارزش مالی */}
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-b-4 border-teal-500">
                    <FiDollarSign size={30} className="text-teal-500 mb-2" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">ارزش کل موجودی</p>
                    <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">{formatPrice(totalValue)}</p>
                </div>
                {/* ✨ کارت پیش‌بینی */}
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-b-4 border-indigo-500">
                    <IoCalendarOutline size={30} className="text-indigo-500 mb-2" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">متوسط عمر موجودی</p>
                    <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{avgDaysLeft} روز</p>
                </div>
                 {/* ✨ کارت تامین کنندگان */}
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-b-4 border-red-500">
                    <IoBusinessOutline size={30} className="text-red-500 mb-2" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">تعداد تأمین‌کننده</p>
                    <p className="text-4xl font-extrabold text-red-600 dark:text-red-400 mt-1">{suppliers.length}</p>
                </div>
            </div>

            {/* ✨ بخش ۲: ابزار سریع ثبت ورود محموله */}
            <div className='mb-8 bg-indigo-50 dark:bg-indigo-900/40 p-5 rounded-xl shadow-lg border-l-4 border-indigo-500'>
                <h3 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center mb-3">
                    <IoFlashOutline className="ml-2" />
                    ثبت سریع ورود محموله جدید
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">کالا</label>
                        <select 
                            value={newStockEntry.id || ''}
                            onChange={(e) => setNewStockEntry(prev => ({ ...prev, id: Number(e.target.value) }))}
                            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                        >
                            <option value="">-- انتخاب کالا --</option>
                            {inventory.map(item => (
                                <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مقدار ورودی</label>
                         <input
                            type="number"
                            value={newStockEntry.amount || ''}
                            onChange={(e) => setNewStockEntry(prev => ({ ...prev, amount: Number(e.target.value) }))}
                            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                            placeholder="مقدار"
                        />
                    </div>
                    <button 
                        onClick={handleShipmentEntry}
                        disabled={!newStockEntry.id || newStockEntry.amount <= 0}
                        className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg font-bold transition hover:bg-teal-700 disabled:bg-gray-500 shadow-md"
                    >
                        ثبت ورود محموله
                    </button>
                </div>
            </div>

            {/* ✨ بخش ۳: ابزار جستجو و فیلتر */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                
                {/* جستجو */}
                <div className="relative w-full md:w-1/3">
                    <IoSearchOutline className="absolute right-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="جستجوی نام یا دسته..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 px-10 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                    />
                </div>
                
                {/* فیلتر وضعیت */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => setFilter('همه')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === 'همه' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                        همه ({inventory.length})
                    </button>
                    <button 
                        onClick={() => setFilter('بحرانی')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === 'بحرانی' ? 'bg-yellow-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                        نیاز به سفارش ({itemsToOrder.length})
                    </button>
                    <button 
                        onClick={() => setFilter('مناسب')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === 'مناسب' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                        مناسب ({inventory.length - itemsToOrder.length})
                    </button>
                </div>
            </div>

            {/* لیست کارت‌های موجودی */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInventory.length === 0 ? (
                    <p className="md:col-span-3 text-center text-gray-500 dark:text-gray-400 mt-8">
                        هیچ آیتمی برای نمایش با فیلتر یا جستجوی فعلی وجود ندارد.
                    </p>
                ) : (
                    filteredInventory.map(item => (
                        <InventoryCard 
                            key={item.id} 
                            item={item} 
                            onUpdateStock={handleUpdateStock} 
                            supplier={suppliers.find(s => s.id === item.supplier_id)}
                        />
                    ))
                )}
            </div>
            
            {/* ✨ بخش ۴: سفارشات مورد نیاز (جدول) */}
            {itemsToOrder.length > 0 && (
                 <div className="mt-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center mb-6">
                        <IoBasketOutline className="ml-3 text-red-500" />
                        لیست سفارشات مورد نیاز (Suggested Order)
                    </h2>
                    
                    <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl overflow-x-auto'>
                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        نام کالا
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        نیاز فوری (مقدار)
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        تأمین‌کننده (تلفن)
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ارزش تخمینی
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        عملیات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {itemsToOrder.map((item) => {
                                    const supplier = suppliers.find(s => s.id === item.supplier_id);
                                    return (
                                        <tr key={item.id} className={item.current_stock === 0 ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 dark:text-red-400">
                                                {item.needed} {item.unit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400">
                                                {supplier?.name} 
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600 dark:text-teal-400">
                                                {formatPrice(item.estimated_cost)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <a 
                                                    href={`tel:${supplier?.phone}`} 
                                                    className='text-white bg-indigo-600 hover:bg-indigo-700 py-1 px-3 rounded-full text-xs font-bold'
                                                >
                                                    <IoCallOutline className='inline mr-1' /> تماس سریع
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className='mt-4 text-left text-sm font-bold text-gray-600 dark:text-gray-300'>
                            مجموع هزینه مورد نیاز: {formatPrice(itemsToOrder.reduce((sum, item) => sum + item.estimated_cost, 0))}
                        </div>
                    </div>
                 </div>
            )}
            
             {/* ✨ بخش ۵: مدیریت تأمین‌کنندگان */}
            <div className="mt-12">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center mb-6">
                    <IoBusinessOutline className="ml-3 text-indigo-500" />
                    فهرست تأمین‌کنندگان (Suppliers)
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {suppliers.map(supplier => (
                         <div 
                            key={supplier.id} 
                            className='bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border-b-4 border-teal-500/80'
                        >
                            <h4 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>{supplier.name}</h4>
                            <p className='text-sm text-gray-600 dark:text-gray-300 flex items-center mb-1'>
                                <IoCallOutline className='ml-1' /> {supplier.phone}
                            </p>
                            <p className='text-sm text-gray-600 dark:text-gray-300 flex items-center'>
                                <IoTimeOutline className='ml-1' /> زمان تحویل: {supplier.delivery_time_days} روز
                            </p>
                        </div>
                    ))}
                     <div className='p-5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition'>
                        <span className='text-indigo-600 dark:text-indigo-400 font-bold flex items-center'>
                            <IoAddCircleOutline className='ml-2' /> افزودن تأمین‌کننده جدید
                        </span>
                    </div>
                </div>
            </div>

            {/* ✨ بخش ۶: راهنمای پایین صفحه */}
            <div className="mt-12 p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 border-r-4 border-indigo-500 shadow-lg">
                <p className="font-semibold text-indigo-800 dark:text-indigo-200">
                    نکته: **Reorder Point** (نقطه سفارش مجدد) به صورت هوشمند محاسبه می‌شود: (زمان تحویل تأمین‌کننده × مصرف روزانه) + موجودی ایمنی. هنگام رسیدن موجودی شما به این نقطه، سفارش فوری توصیه می‌شود.
                </p>
            </div>
        </div>
    );
};

export default InventoryPage;