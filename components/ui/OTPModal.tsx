import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend: () => void;
  language: Language;
}

type Language = "ar" | "en";

export const OTPModal: React.FC<OTPModalProps> = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  onResend,
  language 
}) => {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResendClick = async () => {
    setIsResending(true);
    try {
      await onResend();
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[350px]">
        <h2 className="text-xl font-bold mb-4">
          {language === "ar" ? "أدخل رمز التحقق" : "Enter Verification Code"}
        </h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp" className={language === "ar" ? "text-end" : "text-start"}>
              {language === "ar" ? "رمز التحقق" : "OTP"}
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder={language === "ar" ? "123456" : "123456"}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={language === "ar" ? "text-right" : "text-left"}
            />
          </div>
          <Button
            onClick={() => onVerify(otp)}
            className="w-full bg-roshitaBlue"
          >
            {language === "ar" ? "تحقق" : "Verify"}
          </Button>
          <Button
            variant="outline"
            onClick={handleResendClick}
            className="w-full"
            disabled={isResending}
          >
            {isResending 
              ? (language === "ar" ? "جاري الإرسال..." : "Sending...")
              : (language === "ar" ? "إعادة إرسال الرمز" : "Resend Code")}
          </Button>
          <Button
            onClick={onClose}
            className="w-full bg-gray-500"
          >
            {language === "ar" ? "إلغاء" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
};