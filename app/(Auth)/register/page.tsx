"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { OTPModal } from "@/components/ui/OTPModal";

type Language = "ar" | "en";

const Page = () => {
  const [language, setLanguage] = useState<Language>("ar");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("LBY"); // Default to Libya

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Prepare the data for the API request
    const data = {
      phone,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      country_code: selectedCountry, // Add country code to the request
    };

    try {
      // Send POST request to API for registration
      const response = await fetch(
        "https://test-roshita.net/api/account/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken":
              "CCCV2F0mRnMsVX1awru7VhkRlYqfZSqIWnHiKk88nrCASNeSz3yVqUvLipMwrWAE",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setIsOTPModalOpen(true);
        console.log("Registration Response:", result);
      } else {
        let errorMessage =
          result.message ||
          result.phone ||
          result.email ||
          result.first_name ||
          result.last_name;

        // Add translation for "A user with that phone number already exists."
        if (errorMessage === "A user with that phone number already exists.") {
          errorMessage =
            language === "ar"
              ? "يوجد مستخدم بهذا الرقم بالفعل."
              : "A user with that phone number already exists.";
        }

        setError(errorMessage);
        console.log("Registration Error:", result);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(language === "ar" ? "حدث خطأ أثناء التسجيل" : "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      // Send OTP to the server for verification
      const response = await fetch(
        "https://test-roshita.net/api/account/verify-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken":
              "CCCV2F0mRnMsVX1awru7VhkRlYqfZSqIWnHiKk88nrCASNeSz3yVqUvLipMwrWAE", // Consider managing CSRF token more dynamically
          },
          body: JSON.stringify({ otp, phone }),
        }
      );

      const result = await response.json();

      if (response.ok && result.access) {
        console.log("OTP Verification Response:", result);

        // Save the tokens and user info if OTP verification is successful
        localStorage.setItem("refresh", result.refresh);
        localStorage.setItem("access", result.access);
        localStorage.setItem("userId", String(result.user.id));
        localStorage.setItem("patientId", String(result.user.patient_id));
        localStorage.setItem("isLoggedIn", "true");

        // Optionally, fetch user profile details here if needed, similar to mobile app
        // For now, directly redirecting to the main page after successful OTP verification
        alert("OTP verification successful. Redirecting...");
        window.location.href = "/"; // Redirect to the main page or dashboard
      } else {
        console.log("OTP Verification Error:", result);
        const errorMessage =
          result.detail || (language === "ar" ? "فشل التحقق من OTP. حاول مرة أخرى." : "OTP verification failed. Please try again.");
        setError(errorMessage); // Display error in the UI
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      const generalErrorMessage = language === "ar" ? "حدث خطأ أثناء التحقق من OTP." : "An error occurred during OTP verification.";
      setError(generalErrorMessage);
      alert(generalErrorMessage);
    }
  };

  // Get phone hint based on selected country
  const getPhoneHint = () => {
    if (language === "ar") {
      return selectedCountry === "LBY"
        ? "يرجى إدخال رقم الهاتف بدون رمز الدولة، مثال: 09xxxxxxxx"
        : "يرجى إدخال رقم الهاتف بدون رمز الدولة، مثال: 20xxxxxx";
    } else {
      return selectedCountry === "LBY"
        ? "Please enter the phone number without the country code, e.g., 09xxxxxxxx"
        : "Please enter the phone number without the country code, e.g., 20xxxxxx";
    }
  };

  return (
    <div
      className={`w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ${
        language === "ar" ? "text-right" : "text-left"
      }`}
    >
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div
            className={`flex gap-2 items-center justify-center mb-10 {
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
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "أنضــم الي" : "Join"}{" "}
              <span className="text-roshitaDarkBlue">
                {language === "ar" ? "روشيتا" : "Roshita"}
              </span>
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "عبئ المتطلبات الأتيه لتسجيل الدخول"
                : "Fill in the following details to register"}
            </p>
          </div>

          {error && (
            <div
              className={`text-red-500 bg-red-100 p-4 rounded ${
                language === "ar" ? "text-end" : "text-start"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="first-name"
                className={language === "ar" ? "text-end" : "text-start"}
              >
                {language === "ar" ? "الاسم" : "First Name"}
              </Label>
              <Input
                id="first-name"
                type="text"
                placeholder={language === "ar" ? "محمد" : "John"}
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={language === "ar" ? "text-right" : "text-left"}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="last-name"
                className={language === "ar" ? "text-end" : "text-start"}
              >
                {language === "ar" ? "اللقب" : "Last Name"}
              </Label>
              <Input
                id="last-name"
                type="text"
                placeholder={language === "ar" ? "أحمد" : "Doe"}
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={language === "ar" ? "text-right" : "text-left"}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className={language === "ar" ? "text-end" : "text-start"}
              >
                {language === "ar" ? "البريد الإلكتروني" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={language === "ar" ? "text-right" : "text-left"}
              />
            </div>

            {/* Country Selection */}
            <div className="grid gap-2">
              <Label
                className={language === "ar" ? "text-end" : "text-start"}
              >
                {language === "ar" ? "اختر البلد" : "Select Country"}
              </Label>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setSelectedCountry("LBY")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-md border ${selectedCountry === "LBY" ? "border-roshitaBlue bg-blue-50" : "border-gray-200"}`}
                >
                  <span>{language === "ar" ? "ليبيا" : "Libya"}</span>
                  <Image src="/Images/lb-flag.png" alt="Libya Flag" width={24} height={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCountry("TU")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-md border ${selectedCountry === "TU" ? "border-roshitaBlue bg-blue-50" : "border-gray-200"}`}
                >
                  <span>{language === "ar" ? "تونس" : "Tunisia"}</span>
                  <Image src="/Images/tn-flag.webp" alt="Tunisia Flag" width={24} height={16} />
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="phone"
                className={language === "ar" ? "text-end" : "text-start"}
              >
                {language === "ar" ? "رقم الهاتف" : "Phone Number"}
              </Label>
              {/* Phone Number Hint */}
              <p className={`text-xs text-gray-500 ${language === "ar" ? "text-right" : "text-left"} mb-1`}>
                {getPhoneHint()}
              </p>
              <Input
                id="phone"
                type="text"
                placeholder={selectedCountry === "LBY" ? "09xxxxxxxx" : "20xxxxxx"}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={language === "ar" ? "text-right" : "text-left"}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className={language === "ar" ? "text-end" : "text-start"}
              >
                {language === "ar" ? "كلمة السر" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={language === "ar" ? "text-right" : "text-left"}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-roshitaBlue" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (language === "ar" ? "جاري التسجيل..." : "Registering...") 
                : (language === "ar" ? "تسجيل" : "Register")}
            </Button>
          </form>

          {isSubmitting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-roshitaBlue mx-auto mb-4"></div>
                <p className="text-lg">
                  {language === "ar" 
                    ? "جاري معالجة طلبك..." 
                    : "Processing your request..."}
                </p>
              </div>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            {language === "ar"
              ? "لديك حساب بالفعل؟"
              : "Already have an account?"}{" "}
            <Link href="/login" className="underline">
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-transparent lg:block h-full w-full">
        <Image
          src="/Images/register.png"
          alt="Image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      {/* OTP Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={handleVerifyOTP}
        language={language}
      />
    </div>
  );
};

export default Page;
