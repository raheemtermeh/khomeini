// src/pages/auth/VerifyOtpForm.tsx
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent, FormEvent } from "react";
import api from "../../services/api";

interface Props {
  phoneNumber: string;
  token: string;
  onSubmit: () => void;
  onEditPhone: () => void;
}

const OTP_LENGTH = 5;
const RESEND_TIMEOUT = 120;

// ✅ تابع کمکی: تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (str: string): string => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let newStr = str;
  for (let i = 0; i < 10; i++) {
    newStr = newStr.replace(persianNumbers[i], englishDigits[i]);
  }
  return newStr;
};

const VerifyOtpForm = ({ phoneNumber, token, onSubmit, onEditPhone }: Props) => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // ✨ اصلاح شده: مدیریت ورودی و پرش به جلو
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const rawValue = e.target.value;
    
    // اگر ورودی پاک شد (چه با Backspace از طریق JS یا Delete)، فقط اجازه می‌دهیم خالی شود
    if (rawValue === "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        return; 
    }
    
    // تبدیل ورودی (شامل فارسی) به انگلیسی و گرفتن فقط کاراکتر اول
    const englishValue = toEnglishDigits(rawValue);
    const value = englishValue.charAt(0);

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // پرش خودکار به فیلد بعدی
      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // ✨ اصلاح شده: مدیریت Backspace و Delete برای پاک کردن و پرش به عقب
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // اگر Backspace زده شد
    if (e.key === "Backspace") {
      // جلوگیری از عملکرد پیش‌فرض مرورگر
      e.preventDefault(); 

      const newOtp = [...otp];
      
      // اگر فیلد فعلی پر است، ابتدا آن را پاک کن
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } 
      // اگر فیلد فعلی خالی است و فیلد قبلی وجود دارد، به عقب بپر
      else if (index > 0) {
        newOtp[index - 1] = ""; // پاک کردن فیلد قبلی (اختیاری)
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } 
    // مدیریت کلید Delete برای پاک کردن فیلد فعلی
    else if (e.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const storeTokensFromResponse = (resData: any) => {
    console.debug("[VerifyOtpForm] storeTokensFromResponse", resData);
    // حمایت از چند فرمت مختلف پاسخ
    const possibleAccess =
      resData?.access ||
      resData?.data?.accessToken ||
      resData?.data?.access ||
      resData?.accessToken ||
      resData?.data?.token;
    const possibleRefresh =
      resData?.refresh ||
      resData?.data?.refreshToken ||
      resData?.refreshToken ||
      resData?.data?.refresh;

    if (possibleAccess) {
      localStorage.setItem("accessToken", possibleAccess);
      console.debug("[VerifyOtpForm] saved accessToken");
    }
    if (possibleRefresh) {
      localStorage.setItem("refreshToken", possibleRefresh);
      console.debug("[VerifyOtpForm] saved refreshToken");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const rawOtpValue = otp.join("");
    if (rawOtpValue.length !== OTP_LENGTH) {
        alert("لطفاً کد تایید را کامل وارد کنید.");
        return;
    }

    // اطمینان از ارسال کد تایید به فرمت انگلیسی
    const otpValueToSend = toEnglishDigits(rawOtpValue);

    setIsSubmitting(true);
    try {
      console.debug("[VerifyOtpForm] verifying OTP", { token, code: otpValueToSend });
      const { data } = await api.post("/user/check-sms-login-user", {
        token,
        code: otpValueToSend, // ارسال کد انگلیسی
        action: "verify",
      });

      console.debug("[VerifyOtpForm] server response", data);
      storeTokensFromResponse(data || {});

      onSubmit();
    } catch (err: any) {
      console.error("[VerifyOtpForm] verify failed", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert("کد تایید معتبر نیست یا خطا در سرور رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setTimeLeft(RESEND_TIMEOUT);
    setCanResend(false);
    setOtp(new Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();

    try {
      console.debug("[VerifyOtpForm] resend code request", { token });
      const { data } = await api.post("/user/check-sms-login-user", {
        token,
        action: "send_again",
      });
      console.debug("[VerifyOtpForm] resend response", data);
    } catch (err: any) {
      console.error("[VerifyOtpForm] resend failed", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
      <h2 className="text-2xl font-extrabold mb-4">کد تایید</h2>
      <div className="mb-6">
        <p className="text-gray-500">کد ارسال شده به شماره زیر را وارد کنید:</p>
        <div className="flex items-center justify-center gap-2 mt-2 font-semibold" dir="ltr">
          <span>{phoneNumber}</span>
        </div>
        <button type="button" onClick={onEditPhone} className="text-sm text-[#717171] hover:underline">
          ویرایش شماره موبایل
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => void (inputRefs.current[index] = el)}
              type="text"
              // برای مدیریت کامل پاک کردن، maxLength باید در حالت onKeyDown مدیریت شود
              maxLength={1} 
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg"
            />
          ))}
        </div>
        <div className="mt-4">
          {canResend ? (
            <button type="button" onClick={handleResendCode} className="text-primary-red hover:underline">
              ارسال مجدد کد
            </button>
          ) : (
            <p className="text-gray-400 text-sm">ارسال مجدد کد تا {timeLeft} ثانیه دیگر</p>
          )}
        </div>
        <button type="submit" disabled={otp.join("").length !== OTP_LENGTH || isSubmitting} className="w-full bg-primary-red text-white font-bold p-3 rounded-lg mt-6">
          {isSubmitting ? "در حال ارسال..." : "تایید"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpForm;