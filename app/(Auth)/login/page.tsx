"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

type Language = "ar" | "en";

const Page = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
    const url = query.get("redirect") || "/"; // Default to home page
    setRedirectUrl(url);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ phone, password });

      // Save the tokens if login is successful
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("access", data.access);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("patientId", data.user.patient_id);

      localStorage.setItem("isLoggedIn", "true");

      if (redirectUrl) {
        router.push(redirectUrl); // Redirect to the intended destination
      }
    } catch (error: any) {
      console.log("this is an error", error);
      // Determine the error message based on language
      const errorMessage =
        language === "en"
          ? error.message === "Invalid phone number or password"
            ? "Invalid phone number or password"
            : error.message ||
              "An error occurred during login. Please check your credentials and try again."
          : error.message === "Invalid phone number or password"
          ? "رقم الهاتف أو كلمة المرور غير صحيحة"
          : error.message ||
            "حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بيانات الاعتماد والمحاولة مرة أخرى.";

      setError(errorMessage); // Set the localized error message
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
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {language === "en" ? "Welcome" : "مرحبـــا"}
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

          <form onSubmit={handleLogin} className="grid gap-4">
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
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Link
                  href="/forgot-password"
                  className="mr-auto inline-block text-sm underline"
                >
                  {language === "en" ? "Forgot password?" : "نسيت كلمة المرور"}
                </Link>
                <Label htmlFor="password">
                  {language === "en" ? "Password" : "كلمة المرور"}
                </Label>
              </div>

              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-roshitaBlue"
              disabled={loading}
            >
              {loading
                ? language === "en"
                  ? "Logging in..."
                  : "جاري التسجيل..."
                : language === "en"
                ? "Login"
                : "تسجيل"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {language === "en" ? "Don't have an account?" : "لا تمتلك حسابًا؟"}{" "}
            <Link href="/register" className="underline">
              {language === "en" ? "Sign up" : "اشترك"}
            </Link>
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
    </div>
  );
};

export default Page;
