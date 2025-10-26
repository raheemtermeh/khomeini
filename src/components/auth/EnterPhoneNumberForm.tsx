// src/pages/auth/EnterPhoneNumberForm.tsx
import { useState, useRef } from "react";
import type { FormEvent } from "react";
// import { generateCaptcha } from "../../services/captchaService"; // 🔒 فعلاً غیرفعال شد

interface Props {
  onSubmit: (data: { phone: string; token: string; code: string }) => void;
}

const MAX_ATTEMPTS = 5;
const COOLDOWN_PERIOD = 5 * 60 * 1000;

const EnterPhoneNumberForm = ({ onSubmit }: Props) => {
  // ✅ کپچا موقتاً غیرفعال شد
  /*
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string>("");
  */

  // useEffect(() => {
  //   fetchCaptcha();
  // }, []);

  /*
  const fetchCaptcha = async () => {
    try {
      const res = await generateCaptcha();
      console.log("Captcha API Response:", res);
      if (res?.success) {
        setCaptchaImage(`data:image/jpeg;base64,${res.data.image}`);
        setCaptchaToken(res.data.token);
      }
    } catch (err) {
      console.error("Failed to load captcha:", err);
    }
  };
  */

  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    return (
      cleanPhone.length === 11 &&
      cleanPhone.startsWith("09") &&
      /^09[0-9]{9}$/.test(cleanPhone)
    );
  };

  const isInCooldown = (): boolean => {
    return (
      attempts >= MAX_ATTEMPTS && Date.now() - lastAttemptTime < COOLDOWN_PERIOD
    );
  };

  const getRemainingCooldown = (): number => {
    return Math.ceil(
      (COOLDOWN_PERIOD - (Date.now() - lastAttemptTime)) / 1000 / 60
    );
  };

  const formatPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const handleInputChange = (value: string) => {
    setPhone(formatPhoneNumber(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isInCooldown()) {
      alert(
        `به دلیل تلاش‌های متعدد، لطفاً ${getRemainingCooldown()} دقیقه دیگر مجدداً تلاش کنید.`
      );
      return;
    }

    if (!phone.trim()) {
      alert("لطفاً شماره تلفن خود را وارد کنید.");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setAttempts((prev) => prev + 1);
      alert(
        "شماره تلفن وارد شده معتبر نیست. لطفاً شماره خود را به فرمت 09123456789 وارد کنید."
      );
      return;
    }

    // if (!captchaValue.trim()) {
    //   alert("لطفاً کد امنیتی را وارد کنید.");
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        "https://fz-backoffice.linooxel.com/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // token: captchaToken, // 🔒 موقتاً غیرفعال
            // code: Number(captchaValue), // 🔒 موقتاً غیرفعال
            username: phone,
          }),
        }
      );

      if (res.status === 403) {
        alert("شماره تلفن معتبر نیست یا سرور دسترسی ندارد.");
        setAttempts((prev) => prev + 1);
        return;
      }

      if (!res.ok) {
        throw new Error("خطایی در سرور رخ داد.");
      }

      const data = await res.json();
      console.log("Login response:", data);

      const smsToken = data?.token;

      if (!smsToken) {
        throw new Error("توکن SMS از سرور برنگشت.");
      }

      onSubmit({
        phone,
        token: smsToken,
        code: "", // 🔒 چون کپچا غیرفعال شده
      });

      setPhone("");
      setAttempts(0);
    } catch (error) {
      console.log("خطا در ارسال فرم:", error);
      alert("خطایی در ارسال فرم رخ داده است. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsSubmitting(false);
      setLastAttemptTime(Date.now());
    }
  };

  const showCooldownMessage = isInCooldown();
  const showAttemptsWarning = attempts > 0 && attempts < MAX_ATTEMPTS;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
      <h1 className="text-2xl font-extrabold mb-2">ورود</h1>
      <h2 className="text-xl mb-4 text-gray-500">به فان زون خوش آمدید</h2>
      <p className="text-gray-500 mb-6">
        لطفا برای ورود به فان زون، شماره تلفن همراه خود را وارد کنید
      </p>

      {showCooldownMessage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            به دلیل تلاش‌های متعدد، امکان ارسال وجود ندارد. لطفاً{" "}
            {getRemainingCooldown()} دقیقه دیگر مجدداً تلاش کنید.
          </p>
        </div>
      )}

      {showAttemptsWarning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm">
            تعداد تلاش‌های ناموفق: {attempts} از {MAX_ATTEMPTS}
          </p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <input
          type="tel"
          dir="ltr"
          placeholder="0912 345 6789"
          value={phone}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting || isInCooldown()}
          maxLength={11}
          inputMode="numeric"
          autoComplete="tel"
        />

        {/* 🔒 کپچا موقتاً غیرفعال شده */}
        {/*
        {captchaImage && (
          <div className="mt-6 flex flex-col items-center">
            <img
              src={captchaImage}
              alt="captcha"
              className="w-40 h-16 rounded border"
            />
            <input
              type="text"
              placeholder="کد امنیتی"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
              className="border rounded px-2 py-1 mt-2 w-full"
            />
            <button
              type="button"
              onClick={fetchCaptcha}
              className="text-sm text-blue-500 mt-2 hover:underline"
            >
              دریافت کپچای جدید
            </button>
          </div>
        )}
        */}

        <button
          type="submit"
          disabled={isSubmitting || isInCooldown() || !phone.trim()}
          className="w-full bg-primary-red text-white font-bold p-3 rounded-lg mt-6 hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "در حال ارسال..." : "ورود"}
        </button>
      </form>
    </div>
  );
};

export default EnterPhoneNumberForm;
