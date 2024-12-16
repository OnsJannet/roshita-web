'use client'
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

type Language = "ar" | "en";

const page = () => {

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

  return (
    <div className={`w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ${language === "ar" ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "أنضــم الي" : "Join"} <span className="text-roshitaDarkBlue">Roshita</span>
            </h1>
            <p className="text-balance text-muted-foreground">
              {language === "ar" ? "عبئ المتطلبات الأتيه لتسجيل الدخول" : "Fill in the following details to register"}
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={language === "ar" ? "text-end" : "text-start"}>
                {language === "ar" ? "الإسم" : "Name"}
              </Label>
              <Input id="name" type="text" placeholder={language === "ar" ? "جون دو" : "Jon Doe"} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className={language === "ar" ? "text-end" : "text-start"}>
                {language === "ar" ? "الإيميل" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={language === "ar" ? "m@example.com" : "m@example.com"}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className={`flex ${language === "ar" ? "justify-end" : "justify-start"} items-center`}>
                <Label htmlFor="password">{language === "ar" ? "كلمة السر" : "Password"}</Label>
              </div>

              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <div className={`flex ${language === "ar" ? "justify-end" : "justify-start"} items-center`}>
                <Label htmlFor="confirm-password">{language === "ar" ? "تأكيد كلمة السر" : "Confirm Password"}</Label>
              </div>

              <Input id="confirm-password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-roshitaBlue">
              {language === "ar" ? "تسجيل" : "Register"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {language === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
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
    </div>
  );
};

export default page;
