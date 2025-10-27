// src/components/events/CreateEventForm.tsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// ✅ import DateObject
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { IoWarning } from "react-icons/io5"; // آیکون هشدار

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

// ❌ تعریف یک نوع برای خطاهای اعتبارسنجی
type FormErrors = Record<keyof FormData | string, string | undefined>;

// ✅ تابع کمکی برای تبدیل DateObject به Date یا استفاده از متد toDate
const convertToDate = (value: DateObject | null): Date | null => {
  if (!value) return null;
  return value.toDate ? value.toDate() : (value as unknown as Date);
};

// ✅ اصلاح تابع combineDateTime
const combineDateTime = (date: DateObject | null, time: DateObject | null) => {
  if (!date || !time) return null;
  try {
    const d = convertToDate(date);
    const t = convertToDate(time);

    if (!d || !t) return null;

    const combinedDate = new Date(d.getTime());
    combinedDate.setHours(t.getHours(), t.getMinutes(), 0, 0);

    return combinedDate.toISOString();
  } catch (err) {
    console.error("Error combining date/time:", err);
    return null;
  }
};

const CreateEventForm = ({ selectedCategory }: Props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [branches, setBranches] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [defaultEvent, setDefaultEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEventField, setShowEventField] = useState(false);

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [formStep, setFormStep] = useState("form");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const refs = useRef<{
    [key: string]: HTMLSelectElement | HTMLInputElement | HTMLDivElement | null;
  }>({});
  const datePickerRef = useRef<any>(null); // برای DatePicker

  // ---

  // دریافت شعب و دسته‌بندی‌ها (بدون تغییر)
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
    if (errors.event) setErrors((prev) => ({ ...prev, event: undefined }));
  }, [formData.category]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) => ({ ...prev, [name as keyof FormData]: value } as FormData)
    );
    if (name === "category") {
      setFormData((prev) => ({ ...prev, event: "" }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setFormData((prev) => ({ ...prev, branch: selectedId }));
    if (errors.branch) setErrors((prev) => ({ ...prev, branch: undefined }));
  };

  const handleDateChange = (name: keyof FormData) => (d: DateObject | null) => {
    setFormData((p) => ({ ...p, [name]: d } as FormData));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ----------------------------------------------------
  // 📝 تابع اعتبارسنجی فرانت‌اند (با منطق‌های جدید)
  // ----------------------------------------------------
  const validateForm = () => {
    const newErrors: FormErrors = {};
    let firstErrorKey: keyof FormData | string | undefined = undefined;

    const setFirstError = (key: keyof FormData | string, message: string) => {
      newErrors[key] = message;
      if (!firstErrorKey) firstErrorKey = key;
    };

    if (branches.length === 0) {
      setFirstError(
        "branch",
        "شما هنوز شعبه‌ای ثبت نکرده‌اید. لطفاً ابتدا اطلاعات پروفایل خود را تکمیل کرده و سپس در صفحه اطلاعات کافه، شعبه جدید ثبت کنید."
      );
    }

    // 1. اعتبارسنجی فیلدهای اجباری
    if (!formData.category)
      setFirstError("category", "انتخاب دسته‌بندی الزامی است.");
    if (showEventField && !formData.event)
      setFirstError("event", "انتخاب ایونت الزامی است.");

    if (!formData.branch) {
      setFirstError(
        "branch",
        "انتخاب شعبه الزامی است. اگر شعبه‌ای ثبت نکرده‌اید، لطفاً در صفحه پروفایل ثبت‌نام کرده و سپس در صفحه اطلاعات کافه، شعبه خود را ثبت کنید."
      );
    }

    if (!formData.date) setFirstError("date", "تاریخ رویداد الزامی است.");
    if (!formData.startTime)
      setFirstError("startTime", "زمان شروع رویداد الزامی است.");
    if (!formData.endTime)
      setFirstError("endTime", "زمان پایان رویداد الزامی است.");

    // 2. اعتبارسنجی منطق زمانی
    if (formData.date && formData.startTime && formData.endTime) {
      const starts_at_date = convertToDate(formData.date);
      const starts_at_time = convertToDate(formData.startTime);
      const ends_at_time = convertToDate(formData.endTime);

      const starts_at = new Date(starts_at_date!.getTime());
      starts_at.setHours(
        starts_at_time!.getHours(),
        starts_at_time!.getMinutes()
      );

      const ends_at = new Date(starts_at_date!.getTime());
      ends_at.setHours(ends_at_time!.getHours(), ends_at_time!.getMinutes());

      // ساعت پایان نباید قبل یا مساوی ساعت شروع باشد
      if (ends_at.getTime() <= starts_at.getTime()) {
        setFirstError("endTime", "زمان پایان باید بعد از زمان شروع باشد.");
      }

      // تاریخ نباید مربوط به گذشته باشد (با اغماض چند دقیقه)
      if (starts_at.getTime() < Date.now() - 60000) {
        setFirstError("date", "تاریخ و زمان شروع نمی‌تواند در گذشته باشد.");
      }
    }

    // 3. اعتبارسنجی ظرفیت و قیمت
    const minCap = Number(formData.min_capacity);
    const maxCap = Number(formData.max_capacity);
    const price = Number(formData.price);

    if (!maxCap || maxCap < 1)
      setFirstError("max_capacity", "حداکثر ظرفیت باید حداقل ۱ نفر باشد.");
    if (minCap && maxCap && minCap > maxCap)
      setFirstError(
        "min_capacity",
        "حداقل ظرفیت نمی‌تواند بیشتر از حداکثر ظرفیت باشد."
      );
    if (!price || price < 0)
      setFirstError("price", "قیمت باید معتبر و غیر منفی باشد.");

    // 4. اعتبارسنجی قوانین
    if ((formData.platform_rules?.length || 0) < 4) {
      setFirstError("platform_rules", "تایید حداقل ۴ قانون پلتفرم الزامی است.");
    }

    setErrors(newErrors);

    // ✨ مدیریت فوکوس و اسکرول ✨
    if (firstErrorKey) {
      const ref = refs.current[firstErrorKey];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });

        if ((ref as HTMLSelectElement | HTMLInputElement).focus) {
          (ref as HTMLSelectElement | HTMLInputElement).focus();
        } else if (
          firstErrorKey.includes("date") ||
          firstErrorKey.includes("Time")
        ) {
          const datePickerInput = (ref as HTMLDivElement)?.querySelector(
            "input"
          );
          if (datePickerInput) datePickerInput.focus();
        }
      }
    }

    return Object.keys(newErrors).length === 0;
  };
  // ----------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);
    setFormSubmitted(true);

    if (!validateForm()) {
      setAlertMessage("⚠️ لطفاً خطاهای موجود در فرم را برطرف کنید.");
      return;
    }

    const finalEventPk = formData.event || defaultEvent?.pk;

    if (!finalEventPk && !showEventField && formData.category) {
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

  // ✅ کامپوننت کمکی برای نمایش خطا زیر فیلد
  const ErrorMessage = ({ name }: { name: keyof FormErrors }) =>
    errors[name] ? (
      <p className="flex items-center text-red-500 text-sm mt-1">
        <IoWarning className="ml-1" />
        {errors[name]}
      </p>
    ) : null;

  // ✅ تابع کمکی برای اعمال استایل‌های کلاس
  const getInputClass = (name: keyof FormData | string) => {
    const isError = errors[name];

    // ✨ منطق اصلاح شده: در حالت خطا، رنگ پس‌زمینه قرمز روشن (bg-red-50) و در حالت عادی، رنگ‌های اصلی (با dark mode)
    const baseClasses = "w-full p-3 rounded-lg transition-colors duration-200";
    const errorClasses = "border-2 border-red-500 bg-red-50 dark:bg-red-900/50";
    const defaultClasses = "bg-gray-100 dark:bg-gray-700";

    return `${baseClasses} ${isError ? errorClasses : defaultClasses}`;
  };

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
            ref={(el) => (refs.current["category"] = el)} // ✨ Ref
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={getInputClass("category")}
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
          <ErrorMessage name="category" />
        </div>

        {/* ایونت‌ها */}
        {showEventField && (
          <div>
            <label className="block mb-2 font-semibold">ایونت</label>
            <select
              ref={(el) => (refs.current["event"] = el)} // ✨ Ref
              name="event"
              value={formData.event}
              onChange={handleInputChange}
              className={getInputClass("event")}
            >
              <option value="">-- انتخاب کنید --</option>
              {events.map((ev: any) => (
                <option key={ev.pk} value={ev.pk}>
                  {ev.title_seo || ev.title}
                </option>
              ))}
            </select>
            <ErrorMessage name="event" />
          </div>
        )}

        {/* شعبه */}
        <div>
          <label className="block mb-2 font-semibold">شعبه</label>
          <select
            ref={(el) => (refs.current["branch"] = el)} // ✨ Ref
            name="branch" // اضافه شدن نام برای مدیریت خطا
            value={formData.branch}
            onChange={handleBranchSelect}
            className={getInputClass("branch")}
            disabled={loading}
          >
            <option value="">-- انتخاب کنید --</option>
            {branches.map((item) => (
              <option key={item.pk} value={item.pk}>
                {item.name}
              </option>
            ))}
          </select>
          <ErrorMessage name="branch" />
          <span className="text-yellow-300 mt-4">
      اگر شعبه‌ای ثبت نکرده‌اید، لطفاً در صفحه
            پروفایل ثبت‌نام کرده و سپس در صفحه اطلاعات کافه، شعبه خود را ثبت
            کنید.
          </span>
        </div>

        {/* تاریخ و ساعت */}
        <div className="grid md:grid-cols-3 gap-4">
          <div ref={(el) => (refs.current["date"] = el)}>
            {" "}
            {/* Ref برای تاریخ */}
            <label className="block mb-2">تاریخ</label>
            <DatePicker
              value={formData.date}
              onChange={handleDateChange("date")}
              calendar={persian}
              locale={persian_fa}
              ref={datePickerRef}
              inputClass={getInputClass("date")}
            />
            <ErrorMessage name="date" />
          </div>
          <div ref={(el) => (refs.current["startTime"] = el)}>
            {" "}
            {/* Ref برای شروع */}
            <label className="block mb-2">شروع</label>
            <DatePicker
              disableDayPicker
              format="HH:mm"
              value={formData.startTime}
              onChange={handleDateChange("startTime")}
              inputClass={getInputClass("startTime")}
            />
            <ErrorMessage name="startTime" />
          </div>
          <div ref={(el) => (refs.current["endTime"] = el)}>
            {" "}
            {/* Ref برای پایان */}
            <label className="block mb-2">پایان</label>
            <DatePicker
              disableDayPicker
              format="HH:mm"
              value={formData.endTime}
              onChange={handleDateChange("endTime")}
              inputClass={getInputClass("endTime")}
            />
            <ErrorMessage name="endTime" />
          </div>
        </div>

        {/* ظرفیت و قیمت */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">حداقل ظرفیت</label>
            <input
              ref={(el) => (refs.current["min_capacity"] = el)} // ✨ Ref
              type="number"
              name="min_capacity"
              value={formData.min_capacity}
              onChange={handleInputChange}
              className={getInputClass("min_capacity")}
            />
            <ErrorMessage name="min_capacity" />
          </div>
          <div>
            <label className="block mb-2">حداکثر ظرفیت</label>
            <input
              ref={(el) => (refs.current["max_capacity"] = el)} // ✨ Ref
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleInputChange}
              className={getInputClass("max_capacity")}
            />
            <ErrorMessage name="max_capacity" />
          </div>
          <div>
            <label className="block mb-2">قیمت به تومان</label>
            <input
              ref={(el) => (refs.current["price"] = el)} // ✨ Ref
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={getInputClass("price")}
            />
            <ErrorMessage name="price" />
          </div>
        </div>

        {/* 📜 قوانین پلتفرم */}
        <div className="mt-6 space-y-6">
          <div ref={(el) => (refs.current["platform_rules"] = el)}>
            {" "}
            {/* Ref برای قوانین */}
            <h3 className="text-lg font-semibold mb-3">
              قوانین فان زون برای کافه‌دار
            </h3>
            <div
              className={`p-4 rounded-lg space-y-2 text-sm ${
                errors.platform_rules
                  ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/50"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
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
                      setFormData({
                        ...formData,
                        platform_rules: updated as number[],
                      });

                      if (updated.length >= 4 && errors.platform_rules) {
                        setErrors((prev) => ({
                          ...prev,
                          platform_rules: undefined,
                        }));
                      }
                    }}
                    className="mt-1 accent-orange-500 cursor-pointer"
                  />
                  <label className="cursor-pointer">{rule}</label>
                </div>
              ))}
            </div>
            <ErrorMessage name="platform_rules" />
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
