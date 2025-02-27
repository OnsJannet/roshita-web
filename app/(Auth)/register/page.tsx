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

    // Prepare the data for the API request
    const data = {
      phone,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
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
              "CCCV2F0mRnMsVX1awru7VhkRlYqfZSqIWnHiKk88nrCASNeSz3yVqUvLipMwrWAE", // Replace with actual CSRF token
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful");
        setIsOTPModalOpen(true);
        console.log("Registration Response:", result);
        // Redirect to login or other actions after successful registration
        //window.location.href = "/login";
      } else {
        const errorMessage =
        result.message || result.phone || result.email || result.first_name || result.last_name;
        setError(errorMessage)
        console.log("Registration Error:", result);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };


  const handleVerifyOTP = async (otp: string) => {
    try {
      // Send OTP to the server for verification
      const response = await fetch("https://test-roshita.net/api/account/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": "CCCV2F0mRnMsVX1awru7VhkRlYqfZSqIWnHiKk88nrCASNeSz3yVqUvLipMwrWAE",
        },
        body: JSON.stringify({ otp, phone }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("OTP verification successful");
        console.log("OTP Verification Response:", result);
        // Redirect to login or other actions after successful verification
        window.location.href = "/login";
      } else {
        console.log("OTP Verification Error:", result);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("An error occurred during OTP verification.");
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
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "أنضــم الي" : "Join"}{" "}
              <span className="text-roshitaDarkBlue">Roshita</span>
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

            <div className="grid gap-2">
              <Label
                htmlFor="phone"
                className={language === "ar" ? "text-end" : "text-start"}
              >
                {language === "ar" ? "رقم الهاتف" : "Phone Number"}
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder={language === "ar" ? "05xxxxxxxx" : "05xxxxxxxx"}
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



            <Button type="submit" className="w-full bg-roshitaBlue">
              {language === "ar" ? "تسجيل" : "Register"}
            </Button>
          </form>
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
