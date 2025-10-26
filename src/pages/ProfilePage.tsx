// src/pages/ProfilePage.tsx

import { IoPencil, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
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
}

// ✅ تابع کمکی: تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (str: string | undefined): string | undefined => {
  if (!str) return str;
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
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
}: {
  label: string;
  name: string;
  value?: string;
  status: Status;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
}) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {status === "verified" ? (
        <IoCheckmarkCircle className="text-teal-500 text-xl" title="تایید شده" />
      ) : (
        <IoCloseCircle className="text-red-500 text-xl" title="نیاز به تایید" />
      )}
    </div>
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value || ""}
        readOnly={!editable}
        onChange={onChange}
        className={`w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl p-3 pr-10 border border-gray-300 dark:border-gray-600 focus:outline-none ${
          editable
            ? "focus:ring-4 focus:ring-teal-500/50"
            : "cursor-default opacity-80"
        } transition-all duration-300`}
      />
      {editable && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <IoPencil className="w-4 h-4" />
        </div>
      )}
    </div>
  </div>
);

// -------------------------------

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({});
  const [cafeLocation, setCafeLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [birthDate, setBirthDate] = useState<DateObject | null>(null);

  // 🚀 دریافت پروفایل از API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();

        const englishBirthday = data.birthday
          ? toEnglishDigits(data.birthday)
          : undefined;

        // اگر تاریخ به‌صورت شمسی وارد شده (مثلاً ۱۴۰۴-۰۸-۰۱)، آن را به میلادی تبدیل کن
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 📅 مدیریت تغییر تاریخ تولد
  const handleDateChange = (date: DateObject | DateObject[] | null) => {
    const selectedDate = Array.isArray(date) ? date[0] : date;
    setBirthDate(selectedDate);

    if (selectedDate) {
      const gregorianDate = selectedDate.convert(gregorian).format("YYYY-MM-DD");
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
    setCafeLocation(location.address);
    setProfile({ ...profile, address: location.address });
  };

  // 🧾 ارسال فرم
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err: any) {
      console.error("❌ خطا در ذخیره پروفایل:", err);
      alert("خطا در ذخیره اطلاعات پروفایل!");
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
          </h2>

          <form
            onSubmit={handleSubmitProfile}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6"
          >
            <InfoField label="نام و نام خانوادگی" name="full_name" value={profile.full_name} status={profile.full_name ? "verified" : "unverified"} onChange={handleChange} />
            <InfoField label="کد ملی" name="national_code" value={profile.national_code} status={profile.national_code ? "verified" : "unverified"} onChange={handleChange} />
            <InfoField label="نام کاربری" name="first_name" value={profile.first_name} status={profile.first_name ? "verified" : "unverified"} onChange={handleChange} editable={false}/>
            <InfoField label=" نام خانوادگی لاتین" name="last_name" value={profile.last_name} status={profile.last_name ? "verified" : "unverified"} onChange={handleChange} />
            <InfoField label="ایمیل" name="email" value={profile.email} status={profile.email ? "verified" : "unverified"} onChange={handleChange} />
            <InfoField label="شماره موبایل" name="mobile" value={profile.mobile} status={profile.mobile ? "verified" : "unverified"} onChange={handleChange} editable={false} />

            {/* 📅 تاریخ تولد شمسی */}
            <div className="w-full">
              <label className="text-sm font-semibold block text-gray-700 dark:text-gray-300 mb-1">
                تاریخ تولد
              </label>
              <DatePicker
                value={birthDate}
                onChange={handleDateChange}
                format="YYYY/MM/DD"
                calendar={persian}
                locale={persian_fa}
                inputClass="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl p-3 pr-10 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transition-all duration-300"
              />
            </div>

            <InfoField label="شماره شبا" name="sheba" value={profile.sheba} status={profile.sheba ? "verified" : "unverified"} onChange={handleChange} />
            <InfoField label="لینک سایت یا پیج اینستاگرام شما!" name="link" value={profile.link} status={profile.link ? "verified" : "unverified"} onChange={handleChange} />

            {/* 📍 موقعیت مکانی */}
            <div className="w-full md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                  <FiMapPin className="ml-2 text-indigo-600" /> موقعیت مکانی شعبه اصلی
                </label>
                {cafeLocation ? (
                  <IoCheckmarkCircle className="text-teal-500 text-2xl" />
                ) : (
                  <IoCloseCircle className="text-red-500 text-2xl" />
                )}
              </div>
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                currentLocation={cafeLocation}
              />
              {!cafeLocation && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  برای انتخاب موقعیت دقیق کافه روی نقشه کلیک کنید
                </p>
              )}
            </div>

            {/* ✅ دکمه ثبت */}
            <div className="md:col-span-2 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-300 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  id="rules"
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors"
                  required
                />
                <label htmlFor="rules" className="mr-3 text-sm text-gray-700 dark:text-gray-300">
                  موافق{" "}
                  <a href="#" className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">
                    قوانین
                  </a>{" "}
                  ثبت نام هستم.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-12 rounded-xl shadow-lg shadow-indigo-600/40 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.03] disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isSavingProfile ? (
                  <>
                    <IoIosRefresh className="animate-spin ml-2 text-xl" /> در حال ذخیره...
                  </>
                ) : (
                  <>
                    <FiSave className="ml-3 text-xl" /> ثبت نهایی و ذخیره
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

