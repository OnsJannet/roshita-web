"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

import { Lock, Mail, Phone, User } from "lucide-react";
import InputAdmin from "@/components/admin/InputAdmin";

type Language = "ar" | "en";

// Translations
const translations = {
  ar: {
    selectType: "أختر اي نوع مؤسسات",
    dashboard: "في لوحة التحكم روشيتا",
    lab: "معامل التحليل",
    rays: "معامل تصوير",
    hospital: "مصحة",
    next: "التالي",
    adminInfo: "تسجيل معلومات الأدمن",
    adminName: "اسم الأدمن",
    adminLastName: "لقب الأدمن",
    phone: "رقم الهاتف",
    errorLogin: "حدث خطأ أثناء تسجيل الدخول",
    welcome: "أهلا بيك",
  },
  en: {
    selectType: "Choose the type of institution",
    dashboard: "In Roshetta Dashboard",
    lab: "Laboratories",
    rays: "Radiologies",
    hospital: "Hospitals",
    next: "Next",
    adminInfo: "Admin Information Registration",
    adminName: "Admin Name",
    adminLastName: "Admin Last Name",
    phone: "Phone Number",
    errorLogin: "An error occurred during login",
    welcome: "Welcome",
  },
};

const Page = () => {
  const [step, setStep] = useState(1); // Step state
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const router = useRouter();
  const [selected, setSelected] = useState<"lab" | "hospital" | "rays" | null>(
    null
  );

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

  // Handle option selection
  const handleSelect = (option: "lab" | "hospital" | "rays") => {
    setSelected(option);
  };

  // Handle navigation to step 2
  const handleNext = () => {
    if (selected) {
      setStep(2); // Proceed to step 2 only if an option is selected
    } else {
      const message =
        language === "ar"
          ? "يرجى اختيار نوع المؤسسة!" // Arabic message
          : "Please select the type of institution!"; // English message
      alert(message); // Alert based on language
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const url = query.get("redirect") || "/login"; // Default to home page
    setRedirectUrl(url);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ phone, password });

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("access", data.access);
      localStorage.setItem("isLoggedIn", "true");

      setStep(2);
    } catch (error: any) {
      setError("حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };

  // Example API request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      user: {
        phone: phone?.trim() || " ",
        password: password?.trim() || " ",
        email: email?.trim() || " ",
        first_name: name?.trim() || " ",
        last_name: lastName?.trim() || " ",
      },
      city: 1,
      address: " ",
      medical_organization: [
        {
          name: " ",
          foreign_name: " ",
          phone: " ",
          email: " ",
          city: {
            country: {
              name: " ",
              foreign_name: " ",
            },
            name: " ",
            foreign_name: " ",
          },
          address: " ",
          Latitude: 0,
          Longitude: 0,
          type: selected === "hospital" ? 1 : selected === "lab" ? 2 : 3,
        },
      ],
    };

    try {
      const response = await fetch("/api/auth/register/registerStaff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const successMessage =
          language === "ar" ? "تم التسجيل بنجاح!" : "Registration successful!";
        alert(successMessage);
      } else {
        // Map and display error messages
        const translatedErrors: Record<string, string> = {
          "This field may not be blank.":
            language === "ar" ? "هذا الحقل مطلوب." : "This field is required.",
          "A user with that email already exists.":
            language === "ar"
              ? "البريد الإلكتروني مستخدم مسبقاً."
              : "Email is already in use.",
          'Expected a list of items but got type "int".':
            language === "ar"
              ? "القيمة المدخلة غير صحيحة، يجب أن تكون قائمة."
              : "The entered value is incorrect; it must be a list.",
        };

        const errors = result?.details || {};
        const languageErrors = Object.keys(errors)
          .map((key) => {
            const fieldErrors = errors[key];
            if (Array.isArray(fieldErrors)) {
              return fieldErrors
                .map((error) => translatedErrors[error] || error)
                .join(", ");
            }
            return null;
          })
          .filter(Boolean); // Remove null values

        setError(
          languageErrors.join(" | ") ||
            (language === "ar"
              ? "حدث خطأ أثناء التسجيل."
              : "An error occurred during registration.")
        );
      }
    } catch (error: any) {
      const errorMessage =
        language === "ar"
          ? `حدث خطأ أثناء إرسال البيانات: ${error.message || error}`
          : `An error occurred while submitting data: ${
              error.message || error
            }`;
      setError(errorMessage);
    }
  };

  // Retrieve translations based on the selected language
  const t = translations[language];
  const textAlignment = language === "en" ? "text-start" : "text-end";
  const elementAlignment = language === "en" ? "text-start" : "text-end";

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      {/* Left Column */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="flex items-center justify-center py-12">
              <div className="mx-auto grid w-full gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold text-center">
                    {t.selectType}
                  </h1>
                  <p className="text-balance text-muted-foreground text-center">
                    {t.dashboard}
                  </p>
                </div>
                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  {/* Option 1 */}
                  <div
                    className={`p-4 bg-white rounded-lg shadow text-center cursor-pointer ${
                      selected === "lab"
                        ? "border-2 border-blue-500"
                        : "border border-gray-200"
                    }`}
                    onClick={() => handleSelect("lab")}
                  >
                    <Image
                      src="/Images/FilterDoc.png"
                      alt="Lab"
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-center mx-auto">{t.lab}</p>
                  </div>

                  {/* Option 2 */}
                  <div
                    className={`p-4 bg-white rounded-lg shadow text-center cursor-pointer ${
                      selected === "rays"
                        ? "border-2 border-blue-500"
                        : "border border-gray-200"
                    }`}
                    onClick={() => handleSelect("rays")}
                  >
                    <Image
                      src="/Images/FilterDoc.png"
                      alt="Rays"
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-center mx-auto">{t.rays}</p>
                  </div>

                  {/* Option 3 */}
                  <div
                    className={`p-4 bg-white rounded-lg shadow text-center cursor-pointer ${
                      selected === "hospital"
                        ? "border-2 border-blue-500"
                        : "border border-gray-200"
                    }`}
                    onClick={() => handleSelect("hospital")}
                  >
                    <Image
                      src="/Images/FilterHos.png"
                      alt="Hospital"
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-center mx-auto">{t.hospital}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-full bg-[#0575E6] h-[70px] rounded-[30px]"
                  onClick={handleNext}
                >
                  {t.next}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="flex items-center justify-center py-12">
              <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold text-center">
                    {t.adminInfo}
                  </h1>
                </div>
                {error && (
                  <div className="text-red-500 text-center">{t.errorLogin}</div>
                )}
                <form onSubmit={handleNext} className="grid gap-4">
                  {/* Admin Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className={textAlignment}>
                      {t.adminName}
                    </Label>
                    <InputAdmin
                      placeholder={t.adminName}
                      icon={<User size={24} />}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {/* Admin Last Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className={textAlignment}>
                      {t.adminLastName}
                    </Label>
                    <InputAdmin
                      placeholder={t.adminLastName}
                      icon={<User size={24} />}
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  {/* Phone */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className={textAlignment}>
                      {t.phone}
                    </Label>
                    <InputAdmin
                      icon={<Phone size={24} />}
                      type="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#0575E6] h-[70px] rounded-[30px]"
                    onClick={handleSubmit}
                  >
                    {t.next}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right Column */}
      <div className="hidden bg-[#0575E6B5] lg:block relative">
        <div className="h-1/2"></div>
        <div className="flex flex-col justify-center">
          <div className="gap-1 flex flex-col justify-center px-10">
            <p className="text-center text-white text-[38px] font-semibold">
              {t.welcome}
            </p>
            <p className="text-center text-white text-[28.4px] font-normal">
              {t.dashboard}
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
