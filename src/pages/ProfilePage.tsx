// src/pages/ProfilePage.tsx

import {
  IoPencil,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarning,
} from "react-icons/io5"; // IoWarning اضافه شد
import { useEffect, useState, useRef } from "react"; // useRef اضافه شد
import LocationPicker from "../components/profileComponents/LocationPicker";
import { getProfile, updateProfile } from "../services/profileService";
import { FiSave, FiMapPin, FiCamera } from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";

// 📅 کتابخانه تقویم شمسی
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";

type Status = "verified" | "unverified";

interface Profile {
  mobile?: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  city_id?: string;
  address?: string;
  birthday?: string; // فرمت میلادی YYYY-MM-DD
  link?: string;
  national_code?: string;
  sheba?: string;
  pk?: number;
  is_finalized?: boolean;
}

// تعریف یک نوع برای خطاها
type ProfileErrors = {
  [key in keyof Profile | "location" | "rules"]?: string;
};

// ✅ تابع کمکی: تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (str: string | undefined): string | undefined => {
  if (!str) return str;
  const persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g / g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  for (let i = 0; i < 10; i++) {
    str = str.replace(persianNumbers[i], String(i));
  }
  return str;
};

// ✅ تابع کمکی برای تبدیل تاریخ شمسی به میلادی
const persianToGregorian = (persianDate: string): string => {
  try {
    const date = new DateObject({ date: persianDate, calendar: persian });
    return date.convert(gregorian).format("YYYY-MM-DD");
  } catch {
    return persianDate; // fallback
  }
};

// -------------------------------

const InfoField = ({
  label,
  name,
  value,
  status,
  onChange,
  editable = true,
  error, // پروپ جدید
  inputRef, // پروپ جدید
}: {
  label: string;
  name: keyof Profile; // اطمینان از نام‌های صحیح فیلدها
  value?: string;
  status: Status;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) => {
  const isReadOnly = !editable;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <label
          className={`text-sm font-semibold ${
            error
              ? "text-red-600 dark:text-red-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {label}
        </label>
        {status === "verified" ? (
          <IoCheckmarkCircle
            className="text-teal-500 text-xl"
            title="تایید شده"
          />
        ) : (
          <IoCloseCircle
            className="text-red-500 text-xl"
            title="نیاز به تایید"
          />
        )}
      </div>

      {/* ⚠️ پیام خطا */}
      {error && (
        <p className="flex items-center text-xs text-red-600 dark:text-red-400 mb-1">
          <IoWarning className="ml-1" />
          {error}
        </p>
      )}

      <div className="relative">
        <input
          type="text"
          name={name}
          value={value || ""}
          readOnly={isReadOnly}
          onChange={onChange}
          ref={inputRef} // ارجاع برای فوکوس
          className={`w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl p-3 pr-10 border ${
            error
              ? "border-red-500 focus:ring-4 focus:ring-red-500/50"
              : "border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-teal-500/50"
          } focus:outline-none ${
            isReadOnly ? "cursor-default opacity-80" : ""
          } transition-all duration-300`}
        />
        {!isReadOnly && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <IoPencil className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({});
  const [cafeLocation, setCafeLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [birthDate, setBirthDate] = useState<DateObject | null>(null);
  const [isProfileFinalized, setIsProfileFinalized] = useState(false);

  // ❌ حالت خطا و ارجاع‌دهنده‌ها
  const [errors, setErrors] = useState<ProfileErrors>({});
  const fieldRefs = useRef<{
    [key: string]: HTMLInputElement | HTMLDivElement | null;
  }>({});
  const locationRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);

  // 🚀 دریافت پروفایل از API
  useEffect(() => {
    const fetchProfile = async () => {
      // ... (منطق fetchProfile بدون تغییر)
      try {
        setLoading(true);
        const data = await getProfile();

        const finalizedStatus = !!data.national_code; // یا data.is_finalized
        setIsProfileFinalized(finalizedStatus);

        const englishBirthday = data.birthday
          ? toEnglishDigits(data.birthday)
          : undefined;

        const normalizedBirthday =
          englishBirthday && englishBirthday.startsWith("13")
            ? persianToGregorian(englishBirthday)
            : englishBirthday;

        const cleanedData: Profile = {
          ...data,
          birthday: normalizedBirthday,
        };

        setProfile(cleanedData);

        if (cleanedData.address) setCafeLocation(cleanedData.address);

        if (normalizedBirthday) {
          const persianDateObj = new DateObject({
            date: normalizedBirthday,
            calendar: gregorian,
          }).convert(persian);
          setBirthDate(persianDateObj);
        }
      } catch (err) {
        console.error("❌ خطا در گرفتن پروفایل:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const isEditable = !isProfileFinalized;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined })); // پاک کردن خطای مربوطه
  };

  const handleDateChange = (date: DateObject | DateObject[] | null) => {
    if (!isEditable) return;
    setErrors((prev) => ({ ...prev, birthday: undefined })); // پاک کردن خطای تاریخ

    const selectedDate = Array.isArray(date) ? date[0] : date;
    setBirthDate(selectedDate);

    if (selectedDate) {
      const gregorianDate = selectedDate
        .convert(gregorian)
        .format("YYYY-MM-DD");
      setProfile((prev) => ({ ...prev, birthday: gregorianDate }));
    } else {
      setProfile((prev) => ({ ...prev, birthday: undefined }));
    }
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    if (!isEditable) return;
    setCafeLocation(location.address);
    setProfile({ ...profile, address: location.address });
    setErrors((prev) => ({ ...prev, location: undefined })); // پاک کردن خطای لوکیشن
  };

  // ----------------------------------------------------
  // 📝 تابع اعتبارسنجی فرانت‌اند
  // ----------------------------------------------------
  const validateForm = (): boolean => {
    const newErrors: ProfileErrors = {};
    let firstErrorKey: string | undefined = undefined;

    // 1. اعتبارسنجی فیلدهای متنی اجباری
    const requiredFields: (keyof Profile)[] = [
      "full_name",
      "national_code",
      "last_name",
      "email",
      "birthday",
      "sheba",
      "link",
    ];

    requiredFields.forEach((field) => {
      if (!profile[field] || String(profile[field]).trim() === "") {
        newErrors[field] = "این فیلد اجباری است و نمی‌تواند خالی باشد.";
        if (!firstErrorKey) firstErrorKey = field;
      }
    });

    // 2. اعتبارسنجی کد ملی
    const englishNationalCode = toEnglishDigits(profile.national_code);
    if (englishNationalCode && !/^\d{10}$/.test(englishNationalCode)) {
      newErrors.national_code = "کد ملی باید دقیقاً 10 رقم باشد.";
      if (!firstErrorKey) firstErrorKey = "national_code";
    }

    // 3. اعتبارسنجی ایمیل (ساده)
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      newErrors.email = "فرمت ایمیل نامعتبر است.";
      if (!firstErrorKey) firstErrorKey = "email";
    }

    // 4. اعتبارسنجی موقعیت مکانی
    if (!profile.address || cafeLocation === "") {
      newErrors.location = "انتخاب موقعیت مکانی روی نقشه الزامی است.";
      if (!firstErrorKey) firstErrorKey = "location";
    }

    // 5. اعتبارسنجی قوانین
    const rulesChecked = document.getElementById("rules") as HTMLInputElement;
    if (!rulesChecked || !rulesChecked.checked) {
      newErrors.rules = "تایید قوانین ثبت نام الزامی است.";
      if (!firstErrorKey) firstErrorKey = "rules";
    }

    setErrors(newErrors);

    // ✨ مدیریت فوکوس و اسکرول ✨
    if (firstErrorKey) {
      // برای فیلدهای معمول
      const ref = fieldRefs.current[firstErrorKey];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        (ref as HTMLInputElement)?.focus?.();
      }
      // برای LocationPicker
      else if (firstErrorKey === "location" && locationRef.current) {
        locationRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      // برای قوانین
      else if (firstErrorKey === "rules" && rulesRef.current) {
        rulesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    return Object.keys(newErrors).length === 0;
  };
  // ----------------------------------------------------

  // 🧾 ارسال فرم
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditable) return;

    if (!validateForm()) {
      alert("لطفاً خطاهای موجود در فرم را تصحیح کنید.");
      return;
    }

    setIsSavingProfile(true);

    const payload = { ...profile };

    // تبدیل تاریخ شمسی به میلادی در لحظه ارسال
    if (birthDate) {
      const g = birthDate.convert(gregorian).format("YYYY-MM-DD");
      payload.birthday = toEnglishDigits(g);
    } else if (payload.birthday) {
      payload.birthday = toEnglishDigits(payload.birthday);
    }

    try {
      await updateProfile(payload);
      alert("✅ اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
      setIsProfileFinalized(true);
    } catch (err: any) {
      console.error("❌ خطا در ذخیره پروفایل:", err);
      alert("خطا در ذخیره اطلاعات پروفایل! لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 🌀 لودینگ
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-xl font-semibold text-teal-500 animate-pulse">
          <FiCamera className="inline-block mr-3 text-3xl" /> در حال بارگذاری
          اطلاعات پروفایل...
        </div>
      </div>
    );
  }

  // 🎨 UI اصلی
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-[#0f172a] dark:to-[#111827] px-4 py-10 dark:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl border-t-4 border-indigo-600 p-8 space-y-8 transition-all duration-500">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IoPencil className="ml-3 text-indigo-600" /> اطلاعات حساب کاربری
            {isProfileFinalized && (
              <span className="mr-4 text-sm font-normal text-teal-600 dark:text-teal-400 border border-teal-600 dark:border-teal-400 px-3 py-1 rounded-full">
                ✅ ثبت نهایی شده
              </span>
            )}
          </h2>

          {isProfileFinalized && (
            <div className="p-4 rounded-xl bg-yellow-100 dark:bg-yellow-800/50 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 font-medium">
              <p className="flex items-start">
                <IoCloseCircle className="text-2xl flex-shrink-0 ml-2 mt-0.5" />
                **توجه:** اطلاعات پروفایل شما **ثبت نهایی** شده و دیگر قابل
                ویرایش نیستند. در صورت نیاز به تغییر در اطلاعات ثبت شده، لطفاً
                با **پشتیبانی** تماس حاصل فرمایید.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmitProfile}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6"
          >
            <InfoField
              label="نام و نام خانوادگی (اجباری)"
              name="full_name"
              value={profile.full_name}
              status={profile.full_name ? "verified" : "unverified"}
              onChange={handleChange}
              editable={isEditable}
              error={errors.full_name}
              inputRef={(el) => (fieldRefs.current["full_name"] = el)}
            />
            <InfoField
              label="کد ملی (10 رقم اجباری)"
              name="national_code"
              value={profile.national_code}
              status={profile.national_code ? "verified" : "unverified"}
              onChange={handleChange}
              editable={isEditable}
              error={errors.national_code}
              inputRef={(el) => (fieldRefs.current["national_code"] = el)}
            />

            <InfoField
              label="نام کاربری"
              name="first_name"
              value={profile.first_name}
              status={profile.first_name ? "verified" : "unverified"}
              onChange={handleChange}
              editable={false}
            />

            <InfoField
              label=" نام خانوادگی لاتین (اجباری)"
              name="last_name"
              value={profile.last_name}
              status={profile.last_name ? "verified" : "unverified"}
              onChange={handleChange}
              editable={isEditable}
              error={errors.last_name}
              inputRef={(el) => (fieldRefs.current["last_name"] = el)}
            />

            <InfoField
              label="ایمیل (اجباری)"
              name="email"
              value={profile.email}
              status={profile.email ? "verified" : "unverified"}
              onChange={handleChange}
              editable={isEditable}
              error={errors.email}
              inputRef={(el) => (fieldRefs.current["email"] = el)}
            />

            <InfoField
              label="شماره موبایل"
              name="mobile"
              value={profile.mobile}
              status={profile.mobile ? "verified" : "unverified"}
              onChange={handleChange}
              editable={false}
            />

            {/* 📅 تاریخ تولد شمسی */}
            <div className="w-full">
              <label
                className={`text-sm font-semibold block mb-1 ${
                  errors.birthday
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                تاریخ تولد (اجباری)
              </label>
              {errors.birthday && (
                <p className="flex items-center text-xs text-red-600 dark:text-red-400 mb-1">
                  <IoWarning className="ml-1" />
                  {errors.birthday}
                </p>
              )}
              <DatePicker
                value={birthDate}
                onChange={handleDateChange}
                format="YYYY/MM/DD"
                calendar={persian}
                locale={persian_fa}
                readOnly={!isEditable}
                // ✨ ارجاع دهنده برای فوکوس (اگرچه ممکن است DatePicker اجازه فوکوس ندهد)
                ref={(el) => {
                  // اطمینان حاصل کنید که el وجود دارد
                  if (el && el.container) {
                    // استفاده از Optional Chaining برای دسترسی ایمن
                    fieldRefs.current["birthday"] = el.container
                      .children[0] as HTMLInputElement;
                  } else if (el === null) {
                    // در صورت Unmount، مرجع را پاک کن
                    fieldRefs.current["birthday"] = null;
                  }
                }}
                inputClass={`w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl p-3 pr-10 border ${
                  errors.birthday
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/50"
                    : "border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-teal-500/50"
                } focus:outline-none ${
                  !isEditable ? "cursor-default opacity-80" : ""
                } transition-all duration-300`}
              />
            </div>

            <InfoField
              label="شماره شبا (اجباری)"
              name="sheba"
              value={profile.sheba}
              status={profile.sheba ? "verified" : "unverified"}
              onChange={handleChange}
              editable={isEditable}
              error={errors.sheba}
              inputRef={(el) => (fieldRefs.current["sheba"] = el)}
            />

            <InfoField
              label="لینک سایت یا پیج اینستاگرام شما! (اجباری)"
              name="link"
              value={profile.link}
              status={profile.link ? "verified" : "unverified"}
              onChange={handleChange}
              editable={isEditable}
              error={errors.link}
              inputRef={(el) => (fieldRefs.current["link"] = el)}
            />

            {/* 📍 موقعیت مکانی */}
            <div
              className="w-full md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700"
              ref={locationRef}
            >
              <div className="flex justify-between items-center mb-3">
                <label
                  className={`text-lg font-bold flex items-center ${
                    errors.location
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <FiMapPin className="ml-2 text-indigo-600" /> موقعیت مکانی
                  شعبه اصلی (اجباری)
                </label>
                {cafeLocation ? (
                  <IoCheckmarkCircle className="text-teal-500 text-2xl" />
                ) : (
                  <IoCloseCircle className="text-red-500 text-2xl" />
                )}
              </div>
              {errors.location && (
                <p className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  <IoWarning className="ml-1 text-lg" />
                  {errors.location}
                </p>
              )}
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                currentLocation={cafeLocation}
              />
              {!cafeLocation && isEditable && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  برای انتخاب موقعیت دقیق کافه روی نقشه کلیک کنید
                </p>
              )}
            </div>

            {/* ✅ دکمه ثبت - فقط در صورت نهایی نشدن نمایش داده می‌شود */}
            {isEditable && (
              <div className="md:col-span-2 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                <div className="flex items-center" ref={rulesRef}>
                  <input
                    id="rules"
                    type="checkbox"
                    className={`h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors ${
                      errors.rules ? "border-red-500" : ""
                    }`}
                    // required
                  />
                  <label
                    htmlFor="rules"
                    className={`mr-3 text-sm ${
                      errors.rules
                        ? "text-red-600 dark:text-red-400 font-bold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    موافق{" "}
                    <a
                      href="#"
                      className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                    >
                      قوانین
                    </a>{" "}
                    ثبت نام هستم.
                    {errors.rules && (
                      <span className="mr-2 text-xs font-normal">
                        ({errors.rules})
                      </span>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-12 rounded-xl shadow-lg shadow-indigo-600/40 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.03] disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isSavingProfile ? (
                    <>
                      <IoIosRefresh className="animate-spin ml-2 text-xl" /> در
                      حال ذخیره...
                    </>
                  ) : (
                    <>
                      <FiSave className="ml-3 text-xl" /> ثبت نهایی و ذخیره
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
