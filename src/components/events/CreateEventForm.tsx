// src/components/events/CreateEventForm.tsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// ✅ import DateObject
import DatePicker, { DateObject } from "react-multi-date-picker"; 
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const API_BASE = "https://fz-backoffice.linooxel.com/api";
const API_BRANCH = `${API_BASE}/venues/branch?status=a&page=1&page_size=20&order_by=-created_at`;

// ✅ تعریف دقیق‌تر ساختار فرم
interface FormData {
  category: string;
  event: string;
  branch: string;
  status: string;
  date: DateObject | null;
  startTime: DateObject | null;
  endTime: DateObject | null;
  min_capacity: string;
  max_capacity: string;
  price: string;
  terms_text: string;
  platform_rules: number[]; 
  cafe_rules: number[]; 
  new_rule: string;
}

interface Props {
  selectedCategory?: number | null; 
}

const CreateEventForm = ({ selectedCategory }: Props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [branches, setBranches] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [defaultEvent, setDefaultEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEventField, setShowEventField] = useState(false);

  const categoryRef = useRef<HTMLSelectElement>(null);
  const nextFieldRef = useRef<HTMLSelectElement>(null); 

  const initialFormData: FormData = {
    category: "",
    event: "",
    branch: "",
    status: "p",
    date: null,
    startTime: null,
    endTime: null,
    min_capacity: "",
    max_capacity: "",
    price: "",
    terms_text: "",
    platform_rules: [],
    cafe_rules: [],
    new_rule: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<keyof FormData | string, string | undefined>>({}); 
  const [formStep, setFormStep] = useState("form");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // ---

  // دریافت شعب و دسته‌بندی‌ها
  useEffect(() => {
    const fetchBranches = async () => {
        try {
            const branchRes = await fetch(API_BRANCH, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!branchRes.ok) {
                throw new Error(`Branch API failed with status ${branchRes.status}`);
            }
            const branchData = await branchRes.json();
            setBranches(branchData?.results || []);
        } catch (err) {
            console.error("❌ خطا در دریافت شعب (Branch):", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoryRes = await fetch(`${API_BASE}/venues/category/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!categoryRes.ok) {
                throw new Error(
                    `Category API failed with status ${categoryRes.status}`
                );
            }

            const categoryData = await categoryRes.json();
            const allCategories = Array.isArray(categoryData)
                ? categoryData
                : categoryData?.results || [];

            setCategories(allCategories);

            if (selectedCategory)
                setFormData((prev) => ({
                    ...prev,
                    category: selectedCategory.toString(),
                }));
        } catch (err) {
            console.error("❌ خطا در دریافت دسته‌بندی‌ها (Category):", err);
            setAlertMessage(
                "❌ خطا در بارگذاری دسته‌بندی‌ها. لطفاً دوباره تلاش کنید."
            );
        }
    };

    const fetchData = async () => {
        if (!token) {
            setAlertMessage("❌ خطا: ورود شما منقضی شده است.");
            setLoading(false);
            return;
        }

        await Promise.all([fetchBranches(), fetchCategories()]);
        setLoading(false);
    };

    fetchData();
  }, [token, selectedCategory]);

  // ---

  // گرفتن ایونت‌ها بر اساس دسته‌بندی (بدون تغییر)
  const fetchEvents = async (categoryId: string | number) => {
    if (!categoryId || !token) {
        setEvents([]);
        setDefaultEvent(null);
        setShowEventField(false);
        setFormData((prev) => ({ ...prev, event: "" }));
        return;
    }

    try {
        const res = await fetch(
            `${API_BASE}/venues/event?status=a&event_category=${categoryId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        const results = data?.results || data || [];

        const defaultTitle = "default";
        const def = results.find(
            (ev: any) =>
                ev.title?.toLowerCase() === defaultTitle ||
                ev.title_seo?.toLowerCase() === defaultTitle
        );

        const filtered = results.filter(
            (ev: any) =>
                ev.title?.toLowerCase() !== defaultTitle &&
                ev.title_seo?.toLowerCase() !== defaultTitle
        );

        setDefaultEvent(def || null);
        setEvents(filtered);

        setShowEventField(filtered.length > 0);

        if (def) {
            setFormData((prev) => ({
                ...prev,
                event: def.pk.toString(),
            }));
        } else if (filtered.length > 0) {
            setFormData((prev) => ({ ...prev, event: "" }));
        } else {
            setFormData((prev) => ({ ...prev, event: "" }));
        }
    } catch (err) {
        console.error("خطا در دریافت ایونت‌ها:", err);
        setEvents([]);
        setDefaultEvent(null);
        setShowEventField(false);
        setFormData((prev) => ({ ...prev, event: "" }));
    }
  };

  // ---

  // مدیریت تغییرات فرم (بدون تغییر)
  useEffect(() => {
    if (formData.category) {
      fetchEvents(formData.category);
    } else {
      setEvents([]);
      setDefaultEvent(null);
      setShowEventField(false);
      setFormData((prev) => ({ ...prev, event: "" }));
    }
    if (errors.event) setErrors((prev: any) => ({ ...prev, event: undefined })); 
  }, [formData.category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof FormData]: value } as FormData));
    if (name === "category") {
      setFormData((prev) => ({ ...prev, event: "" }));
    }
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: undefined })); 
  };

  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setFormData((prev) => ({ ...prev, branch: selectedId.toString() }));
  };

  // ✅ تابع کمکی برای تبدیل DateObject به Date یا استفاده از متد toDate
  const convertToDate = (value: DateObject | null): Date | null => {
    if (!value) return null;
    if (value.toDate) return value.toDate();
    // در صورتی که DateObject متد toDate نداشت، تلاش می‌کنیم آن را به Date تبدیل کنیم.
    // اما در حالت عادی، باید از متد toDate استفاده شود.
    return value as unknown as Date; 
  }

  // ✅ اصلاح تابع combineDateTime
  const combineDateTime = (date: DateObject | null, time: DateObject | null) => {
    if (!date || !time) return null;
    try {
      // ✅ رفع خطای TS2769: استفاده از .toDate() برای تبدیل به شیء Date
      const d = convertToDate(date); 
      const t = convertToDate(time); 

      if (!d || !t) return null;

      d.setHours(t.getHours(), t.getMinutes());
      return d.toISOString();
    } catch(err) {
      console.error("Error combining date/time:", err);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors: Record<keyof FormData | string, string | undefined> = {};
    if (!formData.category) newErrors.category = "انتخاب دسته‌بندی الزامی است.";
    if (showEventField && !formData.event)
      newErrors.event = "انتخاب ایونت الزامی است.";
    if (!formData.branch) newErrors.branch = "انتخاب شعبه الزامی است.";
    if (!formData.date) newErrors.date = "تاریخ الزامی است.";
    if (!formData.startTime) newErrors.startTime = "زمان شروع الزامی است.";
    if (!formData.max_capacity || Number(formData.max_capacity) < 1)
      newErrors.max_capacity = "ظرفیت باید حداقل ۱ نفر باشد.";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "قیمت معتبر نیست.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---

  // ارسال فرم (بدون تغییر)
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setAlertMessage(null);
    setFormSubmitted(true);

    const finalEventPk = formData.event || defaultEvent?.pk;

    if (!finalEventPk && !showEventField && formData.category) {
      setErrors((prev: any) => ({ 
        ...prev,
        event: "برای این دسته‌بندی ایونتی یافت نشد.",
      }));
      setAlertMessage("⚠️ لطفاً خطاهای فرم را برطرف کنید.");
      return;
    }

    if (!validateForm()) {
      setAlertMessage("⚠️ لطفاً خطاهای فرم را برطرف کنید.");
      return;
    }

    if ((formData.platform_rules?.length || 0) < 4) {
      alert("⚠️ لطفاً حداقل ۴ قانون پلتفرم را تأیید کنید.");
      return;
    }

    const starts_at = combineDateTime(formData.date, formData.startTime);
    const ends_at = combineDateTime(formData.date, formData.endTime);

    const payload = {
      event: Number(finalEventPk),
      branch: Number(formData.branch),
      status: formData.status,
      starts_at,
      ends_at,
      min_capacity: Number(formData.min_capacity) || 1,
      max_capacity: Number(formData.max_capacity),
      price: formData.price,
      terms_text:
        formData.terms_text || "Refund allowed until 24h before start.",
    };

    try {
      const res = await fetch(`${API_BASE}/venues/event-branch/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("خطا در ثبت:", errData);
        setAlertMessage(`❌ خطا در ثبت: ${errData.detail || "نامشخص"}`);
        return;
      }

      setFormStep("success");
    } catch (err) {
      console.error("Error sending event:", err);
      setAlertMessage("❌ خطا در اتصال به سرور.");
    }
  };

  // ---

  const SuccessMessage = () => (
    <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        ✅ رویداد با موفقیت ثبت شد!
      </h2>
      <button
        onClick={() => navigate("/orders")}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
      >
        مشاهده ایونت‌ها
      </button>
    </div>
  );

  if (loading) return <p className="text-center">در حال بارگذاری...</p>;
  if (formStep === "success") return <SuccessMessage />;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">ایجاد رویداد جدید</h2>

      {alertMessage && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-center mb-4">
          {alertMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* دسته‌بندی */}
        <div>
          <label className="block mb-2 font-semibold">دسته‌بندی</label>
          <select
            ref={categoryRef}
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
            disabled={loading}
          >
            <option value="">-- انتخاب کنید --</option>
            {categories.map((cat: any) => (
              <option key={cat.pk} value={cat.pk}>
                {cat.name}
              </option>
            ))}
          </select>
          {!loading && categories.length === 0 && !errors.category && (
            <p className="text-red-500 text-sm mt-1">
              داده‌های دسته‌بندی دریافت نشدند یا لیست خالی است.
            </p>
          )}
          {errors.category && <p className="text-red-500">{errors.category}</p>}
        </div>

        {/* ایونت‌ها */}
        {showEventField && (
          <div>
            <label className="block mb-2 font-semibold">ایونت</label>
            <select
              name="event"
              value={formData.event}
              onChange={handleInputChange}
              className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
            >
              <option value="">-- انتخاب کنید --</option>
              {events.map((ev: any) => (
                <option key={ev.pk} value={ev.pk}>
                  {ev.title_seo || ev.title}
                </option>
              ))}
            </select>
            {errors.event && <p className="text-red-500">{errors.event}</p>}
          </div>
        )}

        {/* شعبه */}
        <div>
          <label className="block mb-2 font-semibold">شعبه</label>
          <select
            value={formData.branch}
            onChange={handleBranchSelect}
            className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
            ref={nextFieldRef} 
            disabled={loading}
          >
            <option value="">-- انتخاب کنید --</option>
            {branches.map((item) => (
              <option key={item.pk} value={item.pk}>
                {item.name}
              </option>
            ))}
          </select>
          {!loading && branches.length === 0 && !errors.branch && (
            <p className="text-red-500 text-sm mt-1">
              داده‌های شعب دریافت نشدند یا لیست خالی است.
            </p>
          )}
          {errors.branch && <p className="text-red-500">{errors.branch}</p>}
        </div>

        {/* تاریخ و ساعت */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">تاریخ</label>
            <DatePicker
              value={formData.date}
              onChange={(d: DateObject | null) => setFormData((p) => ({ ...p, date: d }))} 
              calendar={persian}
              locale={persian_fa}
              inputClass="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block mb-2">شروع</label>
            <DatePicker
              disableDayPicker
              format="HH:mm"
              value={formData.startTime}
              onChange={(t: DateObject | null) => setFormData((p) => ({ ...p, startTime: t }))} 
              inputClass="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block mb-2">پایان</label>
            <DatePicker
              disableDayPicker
              format="HH:mm"
              value={formData.endTime}
              onChange={(t: DateObject | null) => setFormData((p) => ({ ...p, endTime: t }))} 
              inputClass="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            />
          </div>
        </div>

        {/* ظرفیت و قیمت */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">حداقل ظرفیت</label>
            <input
              type="number"
              name="min_capacity"
              value={formData.min_capacity}
              onChange={handleInputChange}
              className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block mb-2">حداکثر ظرفیت</label>
            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleInputChange}
              className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block mb-2">قیمت به تومان</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            />
          </div>
        </div>

        {/* 📜 قوانین پلتفرم و قوانین کافه */}
        <div className="mt-6 space-y-6">
          {/* ✅ قوانین پلتفرم برای کافه‌دار */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              قوانین فان زون برای کافه‌دار
            </h3>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {[
                "صحت اطلاعات رویداد را تأیید می‌کنم.",
                "قیمت‌گذاری رویداد مطابق قوانین فان‌زون خواهد بود.",
                "در صورت لغو، حداقل ۲۴ ساعت قبل اطلاع‌رسانی می‌کنم.",
                "قوانین و شئونات عمومی را رعایت می‌کنم.",
                "مسئولیت کامل اجرای رویداد بر عهده کافه است.",
                "در زمان برگزاری یا از طریق نماینده حضور خواهم داشت.",
                "فان‌زون مجاز به بررسی و حذف رویداد در صورت تخلف است.",
                "متعهد به رضایت و پاسخ‌گویی به شرکت‌کنندگان هستم.",
                "قوانین فان‌زون را مطالعه کرده‌ام و آن‌ها را می‌پذیرم.",
              ].map((rule, index) => (
                <div key={index} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.platform_rules?.includes(index)} 
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...(formData.platform_rules || []), index]
                        : (formData.platform_rules || []).filter(
                            (r: number) => r !== index 
                          );
                      setFormData({ ...formData, platform_rules: updated as number[] }); 
                    }}
                    className="mt-1 accent-orange-500 cursor-pointer"
                  />
                  <label className="cursor-pointer">{rule}</label>
                </div>
              ))}
            </div>

            {/* ⚠️ پیام هشدار در صورت تأیید نکردن */}
            {formSubmitted && (formData.platform_rules?.length || 0) < 4 && (
              <p className="text-red-500 text-sm mt-2">
                لطفاً حداقل ۴ قانون پلتفرم را تأیید کنید تا بتوانید ثبت‌نام را
                انجام دهید.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700"
        >
          ثبت رویداد
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;