"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import LoadingDoctors from "@/components/layout/LoadingDoctors";

type Language = "ar" | "en";

const Page = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage("ar");
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Step 1: Request OTP
  // Add a new state to control when to show loading
  const [showLoading, setShowLoading] = useState(false);
  
  // Modify your API call functions to use this new state
  const handleRequestOTP = async () => {
    if (!phone || phone.trim() === "") {
      setError(language === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required");
      return;
    }
  
    try {
      setLoading(true);
      // Add a small delay before showing the loading component
      setTimeout(() => setShowLoading(true), 100);
      setError(""); // Clear previous errors
      const response = await fetch(
        "https://test-roshita.net/api/account/password-recovery/otp/",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg"
          },
          body: JSON.stringify({
            phone: phone.trim(),
          }),
        }
      );

      const result = await response.json();
      console.log("OTP code result:", result);

      if (!response.ok) {
        setError(result.detail || (language === "ar" ? "فشل في إرسال رمز التحقق" : "Failed to send OTP"));
        return;
      }

      // Move to step 2 (Verify OTP)
      setStep(2);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("OTP request failed:", error);
      setError(language === "ar" ? "خطأ في الشبكة" : "Network error");
    } finally {
      setLoading(false);
      setShowLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.trim() === "") {
      setError(language === "ar" ? "رمز التحقق مطلوب" : "OTP is required");
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => setShowLoading(true), 100);
      setError(""); // Clear previous errors
      
      // Create the request body
      const requestBody = {
        phone: String(phone.trim()),
        otp: String(otp.trim()),
      };
      
      // Log the request body
      console.log("Verify OTP Request Body:", requestBody);
      
      const response = await fetch(
        "https://test-roshita.net/api/account/password-recovery/verify/",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg"
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("OTP verification result:", result);
      
      if (!response.ok) {
        setError(result.detail || (language === "ar" ? "فشل في التحقق من الرمز" : "OTP verification failed"));
        return;
      }

      // Extract uid and token from the reset link
      if (result.reset_link) {
        const url = new URL(result.reset_link);
        const params = new URLSearchParams(url.search);
        setUid(params.get("uid"));
        setResetToken(params.get("token"));
        
        // Move to step 3 (Reset Password)
        setStep(3);
        console.log("OTP verified successfully");
      } else {
        setError(language === "ar" ? "رابط إعادة التعيين مفقود" : "Reset link is missing");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError(language === "ar" ? "خطأ في الشبكة" : "Network error");
    } finally {
      setLoading(false);
      setShowLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.trim() === "") {
      setError(language === "ar" ? "كلمة المرور الجديدة مطلوبة" : "New password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => setShowLoading(true), 100);
      setError(""); // Clear previous errors
      const resetUrl = `https://test-roshita.net/api/account/reset-password/?uid=${uid}&token=${resetToken}`;
      
      // Create request body
      const requestBody = {
        new_password: newPassword.trim(),
      };
      
      // Log the request URL and body
      console.log("Reset Password URL:", resetUrl);
      console.log("Reset Password Request Body:", requestBody);
      console.log("UID:", uid);
      console.log("Reset Token:", resetToken);
      
      const response = await fetch(resetUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg"
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("Reset Password Response:", result);

      if (!response.ok) {
        console.error("Reset Password Error:", result);
        setError(result.detail || (language === "ar" ? "فشل في إعادة تعيين كلمة المرور" : "Password reset failed"));
        return;
      }

      // Password reset successful
      // Navigate directly to Login without showing alert
      router.push('/login');
    } catch (error) {
      console.error("Password reset failed:", error);
      setError(language === "ar" ? "خطأ في الشبكة" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Handle button press based on current step
  const handleButtonPress = () => {
    switch (step) {
      case 1:
        handleRequestOTP();
        break;
      case 2:
        handleVerifyOTP();
        break;
      case 3:
        handleResetPassword();
        break;
      default:
        break;
    }
  };

  // Function to render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">
                {language === "en" ? "Password Recovery" : "استعادة كلمة المرور"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Enter your phone number to receive a verification code" 
                  : "أدخل رقم هاتفك لتلقي رمز التحقق"}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">
                  {language === "en" ? "Phone number" : "رقم الهاتف"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1234567890"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={language === "en" ? "text-left" : "text-right"}
                />
              </div>
              <Button
                onClick={handleButtonPress}
                className="w-full bg-roshitaBlue"
                disabled={loading}
              >
                {loading
                  ? language === "en"
                    ? "Sending..."
                    : "جاري الإرسال..."
                  : language === "en"
                  ? "Send Verification Code"
                  : "إرسال رمز التحقق"}
              </Button>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">
                {language === "en" ? "Verify OTP" : "التحقق من الرمز"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Enter the verification code sent to your phone" 
                  : "أدخل رمز التحقق المرسل إلى هاتفك"}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">
                  {language === "en" ? "Verification Code" : "رمز التحقق"}
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder={language === "en" ? "Enter OTP" : "أدخل رمز التحقق"}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={language === "en" ? "text-left" : "text-right"}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-200 text-black"
                  disabled={loading}
                >
                  {language === "en" ? "Back" : "رجوع"}
                </Button>
                <Button
                  onClick={handleButtonPress}
                  className="w-1/2 bg-roshitaBlue"
                  disabled={loading}
                >
                  {loading
                    ? language === "en"
                      ? "Verifying..."
                      : "جاري التحقق..."
                    : language === "en"
                    ? "Verify Code"
                    : "التحقق من الرمز"}
                </Button>
              </div>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">
                {language === "en" ? "Reset Password" : "إعادة تعيين كلمة المرور"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Create a new password for your account" 
                  : "إنشاء كلمة مرور جديدة لحسابك"}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">
                  {language === "en" ? "New Password" : "كلمة المرور الجديدة"}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder={language === "en" ? "New Password" : "كلمة المرور الجديدة"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={language === "en" ? "text-left" : "text-right"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                  {language === "en" ? "Confirm Password" : "تأكيد كلمة المرور"}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={language === "en" ? "Confirm Password" : "تأكيد كلمة المرور"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={language === "en" ? "text-left" : "text-right"}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(2)}
                  className="w-1/2 bg-gray-200 text-black"
                  disabled={loading}
                >
                  {language === "en" ? "Back" : "رجوع"}
                </Button>
                <Button
                  onClick={handleButtonPress}
                  className="w-1/2 bg-roshitaBlue"
                  disabled={loading}
                >
                  {loading
                    ? language === "en"
                      ? "Resetting..."
                      : "جاري إعادة التعيين..."
                    : language === "en"
                    ? "Reset Password"
                    : "إعادة تعيين كلمة المرور"}
                </Button>
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-roshitaBlue text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-roshitaBlue' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-roshitaBlue text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-roshitaBlue' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-roshitaBlue text-white' : 'bg-gray-200'}`}>
            3
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ${
        language === "en" ? "text-left" : "text-right"
      }`}
    >
      {showLoading ? (
        <div className="flex items-center justify-center min-h-screen w-full col-span-2">
          <LoadingDoctors />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div
                className={`flex gap-2 items-center justify-center mb-10 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <div>
                  <h2
                    onClick={() => (window.location.href = "/")}
                    className={`${
                      language === "ar" ? "text-right" : "text-left"
                    } font-bold lg:text-[16px] text-[12px] cursor-pointer`}
                  >
                    {language === "ar" ? "روشــــــــيتــــــا" : "Roshita"}
                  </h2>
                  <p
                    className={`${
                      language === "ar" ? "text-right" : "text-left"
                    } font-[500] lg:text-[16px] text-[12px]`}
                  >
                    {language === "ar" ? "صحــة أفضل" : "Better Health"}{" "}
                    <span className="text-roshitaGreen">
                      {language === "ar"
                        ? "تواصـــــل أســرع"
                        : "Faster Communication"}
                    </span>
                  </p>
                </div>
                <img
                  src="/logos/ShortLogo.png"
                  alt="roshita logo"
                  className="lg:w-[40px] w-[30px] lg:h-[40px] h-[30px] cursor-pointer"
                  onClick={() => (window.location.href = "/")}
                />
              </div>
              
              {renderStepIndicators()}

              {error && (
                <div
                  className={`text-red-500 bg-red-100 p-4 rounded ${
                    language === "ar" ? "text-end" : "text-start"
                  }`}
                >
                  {error}
                </div>
              )}

              {renderStep()}
            </div>
          </div>
          <div className="hidden bg-white lg:block">
            <Image
              src="/Images/Login.png"
              alt="Image"
              width={1920}
              height={1080}
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
