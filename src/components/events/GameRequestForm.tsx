// src/components/events/GameRequestForm.tsx

import { useState } from "react";
// ✅ کامپوننت createEvent را مستقیماً import می‌کنیم.
import { createEvent } from "../../services/eventService"; 

// --- آیکون‌ها ---

// ✅ اضافه شدن تایپ برای props شامل className
const CheckCircleIcon = ({ className }: { className: string }) => ( 
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="3em"
    width="3em"
    className={className} // ✅ استفاده از className
  >
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
  </svg>
);

// ✅ تعریف اینترفیس برای FormData و Errors
interface FormData {
  minPlayers: string;
  maxPlayers: string;
  duration: string;
  description: string;
}

// برای سادگی، Errors را از روی FormData می‌سازیم
type Errors = Record<keyof FormData, string | undefined>; 

// ✅ تعریف اینترفیس برای Props کامپوننت
interface GameRequestFormProps { 
  category: string;
  onBack: () => void;
}

// ✅ اضافه شدن تایپ برای props
const GameRequestForm = ({ category, onBack }: GameRequestFormProps) => { 
  const [formData, setFormData] = useState<FormData>({ // ✅ تعریف نوع برای useState
    minPlayers: "",
    maxPlayers: "",
    duration: "",
    description: "",
  });
  const [errors, setErrors] = useState<Errors>({} as Errors); // ✅ تعریف نوع برای errors
  const [formStep, setFormStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const inputBaseClasses =
    "w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 text-gray-800 dark:text-gray-200 transition-all duration-300";

  // ✅ تعریف صریح نوع برای newErrors
  const validateForm = () => { 
    const newErrors: Partial<Errors> = {}; // از Partial استفاده کردیم
    const min = parseInt(formData.minPlayers);
    const max = parseInt(formData.maxPlayers);

    if (!formData.minPlayers || min <= 0)
      newErrors.minPlayers = "حداقل نفرات باید عددی مثبت باشد.";
    if (!formData.maxPlayers || max <= 0)
      newErrors.maxPlayers = "حداکثر نفرات باید عددی مثبت باشد.";
    else if (min && max && max < min)
      newErrors.maxPlayers = "حداکثر باید بیشتر از حداقل باشد.";
    if (!formData.duration || parseInt(formData.duration) <= 0)
      newErrors.duration = "زمان بازی باید عددی مثبت باشد.";
    if (!formData.description.trim())
      newErrors.description = "توضیحات بازی الزامی است.";

    setErrors(newErrors as Errors); // ✅ Cast کردن به Errors
    return Object.keys(newErrors).length === 0;
  };

  // ✅ اضافه شدن تایپ برای e در handleInputChange
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // ✅ استفاده از name به عنوان keyof FormData
    setFormData((prev) => ({ ...prev, [name as keyof FormData]: value })); 
    
    // ✅ رفع خطای TS7053/TS7006 با چک کردن صریح نوع errors
    if (errors[name as keyof FormData]) 
        setErrors((prev) => ({ ...prev, [name as keyof FormData]: undefined }));
  };

  // ✅ اضافه شدن تایپ برای e در handleSubmit
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 🧠 ساخت داده برای ارسال
      const eventPayload = {
        title: category,
        description: formData.description,
        min_players: parseInt(formData.minPlayers), // تبدیل به عدد
        max_players: parseInt(formData.maxPlayers), // تبدیل به عدد
        duration: parseInt(formData.duration), // تبدیل به عدد
        status: "a",
        title_seo: category,
        description_seo: formData.description || " ",
      };

      await createEvent(eventPayload); // ارسال به بک
      setFormStep("success");
    } catch (err) {
      // ✅ رفع خطای TS18046: 'err' is of type 'unknown'.
      const error = err as Error; 
      setApiError(error.message || "خطا در برقراری ارتباط با سرور.");
      console.error("❌ createEvent error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (formStep === "success") {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center animate-fade-in">
        {/* ✅ className به آیکون پاس داده شد */}
        <CheckCircleIcon className="text-green-500 mx-auto mb-4" /> 
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          درخواست با موفقیت ثبت شد!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          نتیجه بررسی طی ۷۲ ساعت آینده اعلام خواهد شد.
        </p>
        <button
          onClick={onBack}
          className="mt-6 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
        >
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg animate-fade-in max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8 border-b pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          درخواست بازی: <span className="text-red-500">{category}</span>
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
           
          <span className="dark:text-slate-100">بازگشت</span>
        </button>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <fieldset className="border dark:border-gray-600 p-4 rounded-lg">
          <legend className="px-2 font-semibold text-gray-700 dark:text-gray-300">
            تعداد نفرات <span className="text-red-500">*</span>
          </legend>
          <div className="flex items-center gap-4">
            <input
              name="minPlayers"
              type="number"
              value={formData.minPlayers}
              onChange={handleInputChange}
              placeholder="حداقل"
              className={`${inputBaseClasses} text-center`}
            />
            <span className="text-gray-400 font-bold">–</span>
            <input
              name="maxPlayers"
              type="number"
              value={formData.maxPlayers}
              onChange={handleInputChange}
              placeholder="حداکثر"
              className={`${inputBaseClasses} text-center`}
            />
          </div>
          {/* ✅ دسترسی به خطاهای تایپ شده */}
          {(errors.minPlayers || errors.maxPlayers) && ( 
            <p className="text-red-500 text-sm mt-2">
              {errors.minPlayers || errors.maxPlayers}
            </p>
          )}
        </fieldset>

        <div>
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            مدت زمان بازی (دقیقه) <span className="text-red-500">*</span>
          </label>
          <input
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="مثلاً: ۶۰"
            className={inputBaseClasses}
          />
          {/* ✅ دسترسی به خطای تایپ شده */}
          {errors.duration && ( 
            <p className="text-red-500 text-sm mt-2">{errors.duration}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            توضیحات بازی <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="توضیحات کامل درباره‌ی بازی..."
            className={`${inputBaseClasses} resize-none`}
          />
          {/* ✅ دسترسی به خطای تایپ شده */}
          {errors.description && ( 
            <p className="text-red-500 text-sm mt-2">{errors.description}</p>
          )}
        </div>

        {apiError && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg text-center">
            {apiError}
          </div>
        )}

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-red-700 transition-all duration-300 transform ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:scale-105 shadow-lg shadow-red-500/40"
            }`}
          >
            {loading ? "در حال ارسال..." : "ارسال به پشتیبانی"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameRequestForm;