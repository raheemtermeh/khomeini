import { useState } from "react";
import EnterPhoneNumberForm from "../components/auth/EnterPhoneNumberForm";
import VerifyOtpForm from "../components/auth/VerifyOtpForm";

type LoginStep = "enter-phone" | "verify-otp";

interface Props {
  onLoginSuccess: () => void;
}

const LoginPage = ({ onLoginSuccess }: Props) => {
  const [step, setStep] = useState<LoginStep>("enter-phone");
  const [phoneNumber, setPhoneNumber] = useState("");

  // نام این state کمی گمراه کننده است. این در واقع smsToken است.
  // می‌توانید نامش را به smsToken تغییر دهید، اما با همین نام هم کار می‌کند.
  const [smsToken, setSmsToken] = useState("");

  // وقتی شماره ارسال شد:
  const handlePhoneSubmit = (data: {
    phone: string;
    token: string; // این همان smsToken است
    code: string;
  }) => {
    console.log("Phone number submitted:", data);
    setPhoneNumber(data.phone);
    setSmsToken(data.token); // توکن در state والد ذخیره می‌شود
    setStep("verify-otp");
  };

  // onSubmit برای VerifyOtpForm نیاز به تغییر ندارد
  const handleOtpSubmit = () => {
    onLoginSuccess();
  };

  const handleBackToPhoneStep = () => {
    setStep("enter-phone");
  };

  const backgroundClass =
    step === "enter-phone" ? "bg-dark-pattern" : "bg-primary-red";

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-all duration-500 ${backgroundClass}`}
    >
      {step === "enter-phone" ? (
        <EnterPhoneNumberForm onSubmit={handlePhoneSubmit} />
      ) : (
        <VerifyOtpForm
          phoneNumber={phoneNumber}
          token={smsToken} // <--- ✅ این خط مهم‌ترین تغییر است
          onSubmit={handleOtpSubmit}
          onEditPhone={handleBackToPhoneStep}
        />
      )}
    </div>
  );
};

export default LoginPage;
