"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

import { Lock, Mail } from "lucide-react";
import InputAdmin from "@/components/admin/InputAdmin";

const Page = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const url = query.get("redirect") || "/dashboard/"; // Default to home page
    setRedirectUrl(url);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Sending the login request to your API
      const response = await fetch("/api/auth/login/loginStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }), // Sending phone and password
      });
  
      // Parsing the response data
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "An error occurred during login.");
      }
  
      console.log("data", data);
  
      // Store the tokens and user data in localStorage
      localStorage.setItem("refresh", data.refreshToken);
      localStorage.setItem("access", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", data.user.user_type); // You may need to adjust this if the user type is an object
      localStorage.setItem("user", JSON.stringify(data.user)); // Store full user object
  
      // Redirect to the intended URL
      if (redirectUrl) {
        router.push(redirectUrl); // Redirect to the intended destination
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-end">👋 بيك أهلا</h1>

            <p className="text-balance text-muted-foreground text-end">
              لوحة تحكم روشيتا
            </p>
          </div>

          <p className="text-balance text-muted-foreground text-center">
            password: string <br/>
            phone: 0925544332
          </p>

          {error && <div className="text-red-500 text-center">حدث خطأ ما، يرجى المحاولة مرة أخرى</div>}

          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-end">
                رقم الهاتف
              </Label>
              <InputAdmin
                icon={<Mail size={24} />}
                type="phone"
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
                  نسيت كلمة المرور
                </Link>
                <Label htmlFor="password">كلمة المرور</Label>
              </div>

              <InputAdmin
                placeholder="كلمة السر"
                icon={<Lock size={24} />}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#0575E6] h-[70px] rounded-[30px]"
              disabled={loading}
            >
              {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            لا تمتلك حسابًا؟{" "}
            <Link href="/dashboard/Auth/register" className="underline">
              اشترك
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-[#0575E6B5] lg:block relative">
        <div className="h-1/2"></div>
        <div className="flex flex-col justify-center">
          <div className="gap-1 flex flex-col justify-center px-10">
            <p className="text-end text-white text-[38px] font-semibold">
              أهلا بيك
            </p>
            <p className="text-end text-white text-[28.4px] font-normal">
              في لوحة التحكم روشيتا
            </p>
          </div>
          {/* Make the container of the image `absolute` and position it at the bottom */}
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
