"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

import { Building, Lock, Mail, Phone, User } from "lucide-react";
import InputAdmin from "@/components/admin/InputAdmin";
import { logAction } from "@/lib/logger";

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
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    adminLastName: "لقب الأدمن",
    hospitalName: "اسم المستشفى",
    hospitalForgeinName: "اسم المستشفى الأجنبي",
    phone: "رقم الهاتف",
    errorLogin: "حدث خطأ أثناء تسجيل الدخول",
    welcome: "أهلا بيك",
    fillField: "يرجى ملء الحقل",
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
    email: "Email",
    password: "Password",
    adminLastName: "Admin Last Name",
    phone: "Phone Number",
    errorLogin: "An error occurred during login",
    hospitalName: "Hospitals Name",
    hospitalForgeinName: "Hospital foreign name",
    welcome: "Welcome",
    fillField: "Please fill the field",
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
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalForeignName, setHospitalForeignName] = useState("");
  const [selected, setSelected] = useState<"lab" | "hospital" | "rays" | null>(
    null
  );
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if form is submitted
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({}); // Track field errors

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

  // Validate form fields
  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    if (!name.trim()) errors.name = true;
    if (!lastName.trim()) errors.lastName = true;
    if (!phone.trim()) errors.phone = true;
    if (!email.trim()) errors.email = true;
    if (!hospitalName.trim()) errors.hospitalName = true;
    if (!hospitalForeignName.trim()) errors.hospitalForeignName = true;
    if (!password.trim()) errors.password = true;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) {
      const message =
        language === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة!"
          : "Please fill all required fields!";
      setError(message);
      return;
    }

    // Proceed with form submission if all fields are filled
    const endpoint = "/api/auth/register/registerStaff";
    const backendEndpoint = "https://test-roshita.net/api/auth/staff-register/";
    const token = localStorage.getItem("access");

    const payload = {
      user: {
        phone: phone.trim(),
        password: password.trim(),
        email: email.trim(),
        first_name: name.trim(),
        last_name: lastName.trim(),
      },
      city: 1,
      address: "", 
      medical_organization: [
        {
          name: hospitalName,
          foreign_name: hospitalName,
          phone: phone,
          email: email,
          city: {
            country: {
              name: "",
              foreign_name: "",
            },
            name: "", 
            foreign_name: "", 
          },
          address: "", 
          Latitude: 0,
          Longitude: 0,
          type: selected === "hospital" ? 1 : selected === "lab" ? 2 : 3,
        },
      ],
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const successMessage =
          language === "ar" ? "تم التسجيل بنجاح!" : "Registration successful!";
        alert(successMessage);
        setStep(2);
      } else {
        setError(result.message || "An error occurred during registration.");
      }
    } catch (error: any) {
      setError(
        language === "ar"
          ? `حدث خطأ أثناء إرسال البيانات: ${error.message || error}`
          : `An error occurred while submitting data: ${error.message || error}`
      );
    }
  };

  // Retrieve translations based on the selected language
  const t = translations[language];
  const textAlignment = language === "en" ? "text-start" : "text-end";
  const elementAlignment = language === "en" ? "justify-start" : "justify-end";

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      {/* Left Column */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid lg:w-[600px] w-[90%] gap-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="flex items-center justify-center py-12 ">
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
            <div className="flex items-center justify-center py-12 ">
              <div className="mx-auto grid lg:w-[600px] w-[90%] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold text-center">
                    {t.adminInfo}
                  </h1>
                </div>

                {error && (
                  <div
                    className={`text-red-500 bg-red-100 p-4 rounded ${
                      language === "ar" ? "text-end" : "text-start"
                    }`}
                  >
                    {t.errorLogin}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="grid gap-4 ">
                  <div
                    className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                  >
                    {/* Admin Name */}
                    <div className="grid gap-2 lg:w-1/2 w-full">
                      <Label htmlFor="phone" className={textAlignment}>
                        {t.adminName}
                      </Label>
                      <InputAdmin
                        placeholder={t.adminName}
                        icon={<User size={24} />}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={fieldErrors.name ? "border-red-500" : ""}
                      />
                      {fieldErrors.name && (
                        <p className={`text-red-500 text-sm ${textAlignment}`}>
                          {t.fillField} "{t.adminName}"
                        </p>
                      )}
                    </div>

                    {/* Admin Last Name */}
                    <div className="grid gap-2 lg:w-1/2 w-full">
                      <Label htmlFor="phone" className={textAlignment}>
                        {t.adminLastName}
                      </Label>
                      <InputAdmin
                        placeholder={t.adminLastName}
                        icon={<User size={24} />}
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={fieldErrors.lastName ? "border-red-500" : ""}
                      />
                      {fieldErrors.lastName && (
                        <p className={`text-red-500 text-sm ${textAlignment}`}>
                          {t.fillField} "{t.adminLastName}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                  >
                    {/* Phone */}
                    <div className="grid gap-2 lg:w-1/2 w-full">
                      <Label htmlFor="phone" className={textAlignment}>
                        {t.phone}
                      </Label>
                      <InputAdmin
                        icon={<Phone size={24} />}
                        type="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={fieldErrors.phone ? "border-red-500" : ""}
                      />
                      {fieldErrors.phone && (
                        <p className={`text-red-500 text-sm ${textAlignment}`}>
                          {t.fillField} "{t.phone}"
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="grid gap-2 lg:w-1/2 w-full">
                      <Label htmlFor="phone" className={textAlignment}>
                        {t.email}
                      </Label>
                      <InputAdmin
                        icon={<Mail size={24} />}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldErrors.email ? "border-red-500" : ""}
                      />
                      {fieldErrors.email && (
                        <p className={`text-red-500 text-sm ${textAlignment}`}>
                          {t.fillField} "{t.email}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                  >
                    {/* Hospital Name */}
                    <div className="grid gap-2 lg:w-1/2 w-full">
                      <Label htmlFor="phone" className={textAlignment}>
                        {t.hospitalName}
                      </Label>
                      <InputAdmin
                        placeholder={t.hospitalName}
                        icon={<Building size={24} />}
                        type="text"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        className={
                          fieldErrors.hospitalName ? "border-red-500" : ""
                        }
                      />
                      {fieldErrors.hospitalName && (
                        <p className={`text-red-500 text-sm ${textAlignment}`}>
                          {t.fillField} "{t.hospitalName}"
                        </p>
                      )}
                    </div>

                    {/* Hospital Foreign Name */}
                    <div className="grid gap-2 lg:w-1/2 w-full">
                      <Label htmlFor="phone" className={textAlignment}>
                        {t.hospitalForgeinName}
                      </Label>
                      <InputAdmin
                        placeholder={t.hospitalForgeinName}
                        icon={<Building size={24} />}
                        type="text"
                        value={hospitalForeignName}
                        onChange={(e) => setHospitalForeignName(e.target.value)}
                        className={
                          fieldErrors.hospitalForeignName
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {fieldErrors.hospitalForeignName && (
                        <p className={`text-red-500 text-sm ${textAlignment}`}>
                          {t.fillField} "{t.hospitalForgeinName}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                  >
                    {/* Password */}
                    <div className="grid gap-2 lg:w-1/2 w-full">
                      <Label htmlFor="phone" className={textAlignment}>
                        {t.password}
                      </Label>
                      <InputAdmin
                        icon={<Lock size={24} />}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={fieldErrors.password ? "border-red-500" : ""}
                      />
                      {fieldErrors.password && (
                        <p className={`text-red-500 text-sm ${textAlignment}`}>
                          {t.fillField} "{t.password}"
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="w-full bg-[#0575E6] h-[70px] rounded-[30px] lg:w-1/2 "
                    >
                      {t.next}
                    </Button>
                  </div>
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
