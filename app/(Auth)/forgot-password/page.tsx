"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Language = "ar" | "en";

const Page = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");

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

  const handleRecoveryRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://test-roshita.net/api/account/password-recovery/otp/",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken":
              "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg",
          },
          body: JSON.stringify({ phone }),
        }
      );

      if (!response.ok) {
        throw new Error(
          language === "en"
            ? "Failed to send recovery OTP."
            : "فشل إرسال رمز التحقق."
        );
      }

      setModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://test-roshita.net/api/account/password-recovery/reset/",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken":
              "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg",
          },
          body: JSON.stringify({ phone, otp }),
        }
      );

      if (!response.ok) {
        throw new Error(
          language === "en"
            ? "Failed to verify OTP."
            : "فشل في التحقق من رمز التحقق."
        );
      }

      alert(
        language === "en" ? "Recovery successful." : "تمت الاستعادة بنجاح."
      );
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ${
        language === "en" ? "text-left" : "text-right"
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
              {language === "en" ? "Password Recovery" : "استعادة كلمة المرور"}
            </h1>
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
              />
            </div>
            <Button
              onClick={handleRecoveryRequest}
              className="w-full bg-roshitaBlue"
              disabled={loading}
            >
              {loading
                ? language === "en"
                  ? "Sending..."
                  : "جاري الإرسال..."
                : language === "en"
                ? "Login with Recovery"
                : "تسجيل الدخول باستخدام الاستعادة"}
            </Button>
          </div>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <Label
              htmlFor="otp"
              className={
                language === "en"
                  ? "text-center font-semibold text-lg"
                  : "text-center font-semibold text-lg"
              }
            >
              {language === "en" ? "OTP" : "رمز التحقق"}
            </Label>
          </DialogHeader>
          <div className="grid gap-4">
            <Label
              htmlFor="otp"
              style={{ textAlign: language === "en" ? "left" : "right" }}
            >
              {language === "en" ? "OTP" : "رمز التحقق"}
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
          <DialogFooter>
            <Button
              onClick={handleOtpSubmit}
              disabled={loading}
              className="bg-roshitaBlue"
            >
              {loading
                ? language === "en"
                  ? "Verifying..."
                  : "جاري التحقق..."
                : language === "en"
                ? "Submit OTP"
                : "إرسال رمز التحقق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
