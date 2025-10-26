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

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) return;

    setIsSubmitting(true);
    try {
      console.debug("[VerifyOtpForm] verifying OTP", { token, code: otpValue });
      const { data } = await api.post("/user/check-sms-login-user", {
        token,
        code: otpValue,
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
