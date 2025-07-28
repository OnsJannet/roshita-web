"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import InputAdmin from "@/components/admin/InputAdmin";
import { logAction } from "@/lib/logger";

type Language = "ar" | "en";

const Page = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ password visibility
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const router = useRouter();
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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const url = query.get("redirect") || "/dashboard/";
    setRedirectUrl(url);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = "/api/auth/login/loginStaff";
    const backendEndpoint = "https://test-roshita.net/api/auth/staff-login/";
    const token = localStorage.getItem("access");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        await logAction(
          token || undefined,
          backendEndpoint,
          { phone },
          "error",
          response.status,
          errorText
        );
        throw new Error(errorText || "An error occurred during login.");
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        const userId = data.user.doctor_id || data.user.user_id;

        localStorage.setItem("refresh", data.refreshToken);
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("access", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", data.user.user_type);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem(
          "type",
          JSON.stringify(data.user.medical_organization_type)
        );
        localStorage.setItem(
          "medicalOrganizationId",
          data.user.medical_organization.id.toString()
        );

        await logAction(
          data.token,
          backendEndpoint,
          { phone },
          "success",
          response.status
        );

        if (data.user.user_type === "Doctor") {
          router.push(`/doctor-dashboard`);
        } else if (redirectUrl) {
          router.push(redirectUrl);
        }
      } else {
        const errorText = await response.text();
        await logAction(
          token || undefined,
          backendEndpoint,
          { phone },
          "error",
          response.status,
          `Unexpected response format: ${errorText}`
        );
        throw new Error(`Unexpected response format: ${errorText}`);
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء تسجيل الدخول.");
      await logAction(
        token || undefined,
        backendEndpoint,
        { phone },
        "error",
        error.response?.status || 500,
        error.message || "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className={`flex gap-2 items-center justify-center mb-10`}>
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
            <h1 className="text-3xl font-bold text-center">
              {language === "ar" ? "👋  أهلا بيك" : "👋 Welcome"}
            </h1>
            <p className="text-balance text-muted-foreground text-center">
              {language === "ar" ? "لوحة تحكم روشيتا" : "Rocheta Dashboard"}
            </p>
          </div>

          {error && (
            <div
              className={`text-red-500 bg-red-100 p-4 rounded ${
                language === "ar" ? "text-end" : "text-start"
              }`}
            >
              {language === "ar"
                ? "حدث خطأ ما، يرجى المحاولة مرة أخرى"
                : "An error occurred. Please try again."}
            </div>
          )}

          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2" dir={language === "ar" ? "rtl" : "ltr"}>
              <Label htmlFor="phone" className="text-start">
                {language === "ar" ? "رقم الهاتف" : "Phone Number"}
              </Label>
              <InputAdmin
                icon={<Mail size={24} />}
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid gap-2" dir={language === "ar" ? "rtl" : "ltr"}>
              <div
                className="grid gap-2"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <div
                  className={`flex justify-between items-center ${
                    language === "ar" ? "flex-row" : "flex-row"
                  }`}
                >
                  <Label htmlFor="password">
                    {language === "ar" ? "كلمة المرور" : "Password"}
                  </Label>
                  <Link href="/forgot-password" className="text-sm underline">
                    {language === "ar" ? "نسيت كلمة المرور" : "Forgot Password"}
                  </Link>
                </div>
              </div>

              <InputAdmin
                placeholder={language === "ar" ? "كلمة السر" : "Password"}
                icon={<Lock size={24} />}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                //@ts-ignore
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0575E6] h-[70px] rounded-[30px] flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {language === "ar"
                      ? "جاري تسجيل الدخول..."
                      : "Signing in..."}
                  </span>
                </>
              ) : (
                <span>{language === "ar" ? "تسجيل الدخول" : "Sign In"}</span>
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden bg-[#0575E6B5] lg:block relative">
        <div className="h-1/2"></div>
        <div className="flex flex-col justify-center">
          <div className="gap-1 flex flex-col justify-center px-10">
            <p className="text-center text-white text-[38px] font-semibold">
              {language === "ar" ? "أهلا بيك" : "Welcome"}
            </p>
            <p className="text-center text-white text-[28.4px] font-normal">
              {language === "ar"
                ? "في لوحة التحكم روشيتا"
                : "to Rocheta Dashboard"}
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-full flex justify-end">
            <Image
              src="/Images/Circles.png"
              alt="Image"
              width={1920}
              height={1080}
              className="h-full w-[60%] object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
