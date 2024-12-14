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
  const router = useRouter();
  const [selected, setSelected] = useState<"lab" | "hospital" | "rays" | null>(
    null
  );

  // Handle option selection
  const handleSelect = (option: "lab" | "hospital" | "rays") => {
    setSelected(option);
  };

  // Handle navigation to step 2
  const handleNext = () => {
    if (selected) {
      setStep(2); // Proceed to step 2 only if an option is selected
    } else {
      alert("يرجى اختيار نوع المؤسسة!"); // Alert if no option is selected
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
        alert("تم التسجيل بنجاح!");
      } else {
        // Map and display error messages
        const translatedErrors: Record<string, string> = {
          "This field may not be blank.": "هذا الحقل مطلوب.",
          "A user with that email already exists.":
            "البريد الإلكتروني مستخدم مسبقاً.",
          'Expected a list of items but got type "int".':
            "القيمة المدخلة غير صحيحة، يجب أن تكون قائمة.",
        };

        const errors = result?.details || {};
        const arabicErrors = Object.keys(errors)
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

        setError(arabicErrors.join(" | ") || "حدث خطأ أثناء التسجيل.");
      }
    } catch (error: any) {
      setError(`حدث خطأ أثناء إرسال البيانات: ${error.message || error}`);
    }
  };

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
                  <h1 className="text-3xl font-bold text-end">
                    أختر اي نوع مؤسسات
                  </h1>
                  <p className="text-balance text-muted-foreground text-end">
                    في لوحة التحكم روشيتا
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
                      alt="Admin"
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-center mx-auto">معامل التحليل</p>
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
                      alt="Admin"
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-center mx-auto">معامل تصوير</p>
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
                      alt="Pharmacy"
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-center mx-auto">مصحة</p>
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-full bg-[#0575E6] h-[70px] rounded-[30px]"
                  onClick={handleNext}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="flex items-center justify-center py-12">
              <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold text-end">
                    تسجيل معلومات الأدمن
                  </h1>
                </div>
                {error && (
                  <div className="text-red-500 text-center">
                    {" "}
                    حدث خطأ أثناء تسجيل الدخول
                  </div>
                )}
                <form onSubmit={handleLogin} className="grid gap-4">
                  {/* Admin Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-end">
                      اسم الأدمن
                    </Label>
                    <InputAdmin
                      placeholder="اسم الأدمن"
                      icon={<User size={24} />}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-end">
                      لقب الأدمن
                    </Label>
                    <InputAdmin
                      placeholder="لقب الأدمن"
                      icon={<User size={24} />}
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-end">
                      رقم الهاتف
                    </Label>
                    <InputAdmin
                      icon={<Phone size={24} />}
                      type="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {/* Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-end">
                      كلمة السر
                    </Label>
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
                    className="w-full bg-[#0575E6] h-[70px] rounded-[30px] text-white text-xl"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "جاري التسجيل..." : "التالي"}
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
            <p className="text-end text-white text-[38px] font-semibold">
              أهلا بيك
            </p>
            <p className="text-end text-white text-[28.4px] font-normal">
              في لوحة التحكم روشيتا
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
