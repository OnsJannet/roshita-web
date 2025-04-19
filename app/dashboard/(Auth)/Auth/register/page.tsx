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
import UploadButton from "@/components/unique/UploadButton";

type Language = "ar" | "en";

// Translations
const translations = {
  ar: {
    selectType: "أختر اي نوع مؤسسات",
    dashboard: "في لوحة التحكم روشيتا",
    lab: "معامل التحليل",
    rays: "معامل تصوير",
    hospital: "مصحة",
    doctors: "الأطباء",
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
    doctorPhone: "رقم هاتف الطبيب",
    specialty: "التخصص",
    city: "المدينة",
    staffAvatar: "صورة الموظف",
    fixedPrice: "السعر الثابت",
    isConsultant: "هل هو استشاري",
    medicalOrgName: "اسم المنظمة الطبية",
    medicalOrgPhone: "رقم هاتف المنظمة الطبية",
    medicalOrgEmail: "البريد الإلكتروني للمنظمة الطبية",
    medicalOrgCity: "مدينة المنظمة الطبية",
    medicalOrgAddress: "عنوان المنظمة الطبية",
    medicalOrgLatitude: "خط العرض للمنظمة الطبية",
    medicalOrgLongitude: "خط الطول للمنظمة الطبية",
    firstName: "الاسم",
    lastName: "اللقب",
    paymentMethod: "طريقة الدفع",
    cash: "نقدي",
    online: "عبر الإنترنت",
  },
  en: {
    selectType: "Choose the type of institution",
    dashboard: "In Roshetta Dashboard",
    lab: "Laboratories",
    rays: "Radiologies",
    hospital: "Hospitals",
    doctors: "Doctors",
    next: "Next",
    adminInfo: "Admin Information Registration",
    adminName: "Admin Name",
    email: "Email",
    password: "Password",
    adminLastName: "Admin Last Name",
    phone: "Phone Number",
    errorLogin: "An error occurred during login",
    hospitalName: "Hospital Name",
    hospitalForgeinName: "Hospital Foreign Name",
    welcome: "Welcome",
    fillField: "Please fill the field",
    doctorPhone: "Doctor Phone",
    specialty: "Specialty",
    city: "City",
    staffAvatar: "Staff Avatar",
    fixedPrice: "Fixed Price",
    isConsultant: "Is Consultant",
    medicalOrgName: "Medical Organization Name",
    medicalOrgPhone: "Medical Organization Phone",
    medicalOrgEmail: "Medical Organization Email",
    medicalOrgCity: "Medical Organization City",
    medicalOrgAddress: "Medical Organization Address",
    medicalOrgLatitude: "Medical Organization Latitude",
    medicalOrgLongitude: "Medical Organization Longitude",
    firstName: "First Name",
    lastName: "Last Name",
    paymentMethod: "Payment Method",
    cash: "Cash",
    online: "Online",
  },
};

const Page = () => {
  const [step, setStep] = useState(1); // Step state
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [speciality, setSpecialty] = useState(1);
  const [city, setCity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [medicalOrgName, setMedicalOrgName] = useState("");
  const [medicalOrgPhone, setMedicalOrgPhone] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Default payment method
  const router = useRouter();
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalForeignName, setHospitalForeignName] = useState("");
  const [medicalOrgEmail, setMedicalOrgEmail] = useState("");
  const [medicalOrgAddress, setMedicalOrgAddress] = useState("");
  const [medicalOrgCity, setMedicalOrgCity] = useState("");
  const [selected, setSelected] = useState<
    "lab" | "hospital" | "rays" | "doctors" | null
  >(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if form is submitted
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({}); // Track field errors
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  // Add this to your existing state declarations
  const [staffAvatar, setStaffAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Add this handler function
  const handleAvatarUpload = (file: File | null) => {
    if (file) {
      setStaffAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    } else {
      setStaffAvatar(null);
      setPreviewAvatar(null);
    }
  };

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
  const handleSelect = (option: "lab" | "hospital" | "rays" | "doctors") => {
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

  useEffect(() => {
    // Fetch the specialties data from the API
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "http://test-roshita.net/api/specialty-list/",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );
        const data = await response.json();
        setSpecialties(data);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    // Fetch the countries data from the API
    const fetchCountries = async () => {
      const csrfToken = process.env.NEXT_PUBLIC_CSRF_TOKEN;
      console.log("csrfToken", csrfToken);

      try {
        const response = await fetch(
          "http://test-roshita.net/api/cities-list/",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchSpecialties();
    fetchCountries();
  }, []);

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
    const endpoint = "http://test-roshita.net/api/auth/staff-register/";
    const backendEndpoint = "http://test-roshita.net/api/auth/staff-register/";
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
        //window.location.href = "/dashboard/Auth/login"
        const successMessage =
          language === "ar" ? "تم التسجيل بنجاح!" : "Registration successful!";
        alert(successMessage);
        setStep(2);
      } else {
        // Handle specific validation errors for phone and email
        if (result.user) {
          const errorMessages = [];
          
          // Check for phone number error
          if (result.user.phone && result.user.phone.length > 0) {
            const phoneError = language === "ar" 
              ?" رقم الهاتف هذا مستخدم من قبل" 
              : result.user.phone[0];
            errorMessages.push(phoneError);
          }
          
          // Check for email error
          if (result.user.email && result.user.email.length > 0) {
            const emailError = language === "ar" 
              ? "البريد الإلكتروني هذا مستخدم من قبل"  
              : result.user.email[0];
            errorMessages.push(emailError);
          }
          
          // Set the combined error message
          if (errorMessages.length > 0) {
            setError(errorMessages.join("\n"));
            return;
          }
        }
        
        // Default error message if no specific errors found
        setError(result.message || (language === "ar" ? "حدث خطأ أثناء التسجيل" : "An error occurred during registration."));
      }
    } catch (error: any) {
      setError(
        language === "ar"
          ? `حدث خطأ أثناء إرسال البيانات: ${error.message || error}`
          : `An error occurred while submitting data: ${error.message || error}`
      );
    }
  };

  const handleRegisterDoctor = async () => {
    setLoading(true);
    setError(null);
  
    // Validate all fields including the image
    const errors: Record<string, boolean> = {};
    if (!name.trim()) errors.firstName = true;
    if (!lastName.trim()) errors.lastName = true;
    if (!phone.trim()) errors.doctorPhone = true;
    if (!email.trim()) errors.email = true;
    if (!speciality) errors.specialty = true;
    if (!city) errors.city = true;
    if (!staffAvatar) errors.staffAvatar = true;
    if (!fixedPrice) errors.fixedPrice = true;
    if (!medicalOrgName.trim()) errors.medicalOrgName = true;
    if (!medicalOrgPhone.trim()) errors.medicalOrgPhone = true;
    if (!medicalOrgEmail.trim()) errors.medicalOrgEmail = true;
    if (!medicalOrgCity) errors.medicalOrgCity = true;
    if (!medicalOrgAddress.trim()) errors.medicalOrgAddress = true;
    if (!paymentMethod) errors.paymentMethod = true;
  
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("doctor_phone", phone);
    formData.append("email", email);
    formData.append("first_name", name);
    formData.append("last_name", lastName);
    formData.append("specialty", speciality.toString());
    formData.append("city", city.toString());
    if (staffAvatar) {
      formData.append("staff_avatar", staffAvatar);
    }
    formData.append("fixed_price", fixedPrice);
    formData.append("is_consultant", "1"); // or "0" depending on your needs
    formData.append("medical_org_name", medicalOrgName);
    formData.append("medical_org_phone", medicalOrgPhone);
    formData.append("medical_org_email", medicalOrgEmail);
    formData.append("medical_org_city", medicalOrgCity);
    formData.append("medical_org_address", medicalOrgAddress);
    formData.append("medical_org_latitude", "0"); // Add actual values if available
    formData.append("medical_org_longitude", "0"); // Add actual values if available
    formData.append("pay_method", paymentMethod); // Add payment method
  
    try {
      const response = await fetch(
        "http://test-roshita.net/api/register-doctor/",
        {
          method: "POST",
          headers: {
            "X-API-Key": "", 
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error: ${response.status} - ${
            errorData.message || "Registration failed"
          }`
        );
      }
  
      const data = await response.json();
      window.location.href = "/dashboard/Auth/login";
      console.log("Response:", data);
    } catch (err) {
      /* @ts-ignore */
      setError(err.message);
      console.error("Error registering doctor:", err);
    } finally {
      setLoading(false);
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
  <div className="text-red-500 text-center">
    {error.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))}
  </div>
)}
                <div className="grid grid-cols-2 gap-4">
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

                  {/* Option 4 */}
                  <div
                    className={`p-4 bg-white rounded-lg shadow text-center cursor-pointer ${
                      selected === "doctors"
                        ? "border-2 border-blue-500"
                        : "border border-gray-200"
                    }`}
                    onClick={() => handleSelect("doctors")}
                  >
                    <Image
                      src="/Images/FilterHos.png"
                      alt="Doctors"
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-center mx-auto">{t.doctors}</p>
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
                    {error}
                  </div>
                )}
                {selected !== "doctors" ? (
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
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={fieldErrors.name ? "border-red-500" : ""}
                        />
                        {fieldErrors.name && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
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
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.lastName ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.lastName && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
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
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={fieldErrors.phone ? "border-red-500" : ""}
                        />
                        {fieldErrors.phone && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
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
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={fieldErrors.email ? "border-red-500" : ""}
                        />
                        {fieldErrors.email && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
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
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.hospitalName ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.hospitalName && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
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
                          onChange={(e) =>
                            setHospitalForeignName(e.target.value)
                          }
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.hospitalForeignName
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {fieldErrors.hospitalForeignName && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
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
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.password ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.password && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
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
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent the page reload
                      handleRegisterDoctor(); // Call the function
                    }}
                    className="grid gap-4"
                  >
                                          <div className="flex justify-center my-4">
  <div className="grid gap-2">
    <Label htmlFor="staff_avatar" className={textAlignment}>
      {t.staffAvatar}
    </Label>
    <UploadButton
      onUpload={handleAvatarUpload} 
      picture={previewAvatar || ""} 
    />
    {fieldErrors.staffAvatar && (
      <p className={`text-red-500 text-sm ${textAlignment}`}>
        {t.fillField} "{t.staffAvatar}"
      </p>
    )}
  </div>
</div>
                    <div
                      className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                    >
                      {/* First Name */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="first_name" className={textAlignment}>
                          {t.firstName}
                        </Label>
                        <InputAdmin
                          placeholder={t.firstName}
                          icon={<User size={24} />}
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.firstName ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.firstName && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.firstName}"
                          </p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="last_name" className={textAlignment}>
                          {t.lastName}
                        </Label>
                        <InputAdmin
                          placeholder={t.lastName}
                          icon={<User size={24} />}
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.lastName ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.lastName && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.lastName}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                    >
                      {/* Doctor Phone */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="doctor_phone" className={textAlignment}>
                          {t.doctorPhone}
                        </Label>
                        <InputAdmin
                          icon={<Phone size={24} />}
                          type="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.doctorPhone ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.doctorPhone && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.doctorPhone}"
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="email" className={textAlignment}>
                          {t.email}
                        </Label>
                        <InputAdmin
                          icon={<Mail size={24} />}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={fieldErrors.email ? "border-red-500" : ""}
                        />
                        {fieldErrors.email && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.email}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                    >
                      {/* Specialty */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="specialty" className={textAlignment}>
                          {t.specialty}
                        </Label>
                        <select
                          id="specialty"
                          value={speciality}
                          /* @ts-ignore */
                          onChange={(e) => setSpecialty(e.target.value)} // Update the specialty state on selection
                          className={`border p-2 rounded ${
                            fieldErrors.specialty ? "border-red-500" : ""
                          }`}
                        >
                          <option value="" disabled>
                            {language === "en"
                              ? "Select a specialty"
                              : "حدد التخصص"}
                          </option>
                          {specialties.map((specialtyOption) => (
                            <option
                              key={specialtyOption.id}
                              value={specialtyOption.id}
                            >
                              {specialtyOption.name}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.specialty && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.specialty}"
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="city" className={textAlignment}>
                          {t.city}
                        </Label>
                        <select
                          id="city"
                          value={city}
                          /* @ts-ignore */
                          onChange={(e) => setCity(e.target.value)} // Update the city state on selection
                          className={`border p-2 rounded ${
                            fieldErrors.city ? "border-red-500" : ""
                          }`}
                        >
                          <option value="" disabled>
                            {language === "en"
                              ? "Select a city"
                              : "حدد المدينة"}
                          </option>
                          {cities.map((cityOption) => (
                            <option key={cityOption.id} value={cityOption.id}>
                              {cityOption.name}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.city && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.city}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                    >
                      {/* Medical Organization Phone */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label
                          htmlFor="medical_org_phone"
                          className={textAlignment}
                        >
                          {t.medicalOrgPhone}
                        </Label>
                        <InputAdmin
                          icon={<Phone size={24} />}
                          type="phone"
                          value={medicalOrgPhone}
                          onChange={(e) => setMedicalOrgPhone(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.medicalOrgPhone ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.medicalOrgPhone && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.medicalOrgPhone}"
                          </p>
                        )}
                      </div>
                      {/* Medical Organization Name */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label
                          htmlFor="medical_org_name"
                          className={textAlignment}
                        >
                          {t.medicalOrgName}
                        </Label>
                        <InputAdmin
                          placeholder={t.medicalOrgName}
                          icon={<Building size={24} />}
                          type="text"
                          value={medicalOrgName}
                          onChange={(e) => setMedicalOrgName(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.medicalOrgName ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.medicalOrgName && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.medicalOrgName}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                    >
                      {/* Medical Organization Phone */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label
                          htmlFor="medical_org_phone"
                          className={textAlignment}
                        >
                          {t.medicalOrgAddress}
                        </Label>
                        <InputAdmin
                          icon={<Building size={24} />}
                          type="phone"
                          value={medicalOrgAddress}
                          onChange={(e) => setMedicalOrgAddress(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.medicalOrgPhone ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.medicalOrgPhone && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.medicalOrgAddress}"
                          </p>
                        )}
                      </div>
                      {/* Medical Organization Name */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label
                          htmlFor="medical_org_name"
                          className={textAlignment}
                        >
                          {t.medicalOrgCity}
                        </Label>
                        <select
                          id="medicalOrgCity"
                          value={medicalOrgCity}
                          onChange={(e) => setMedicalOrgCity(e.target.value)} // Update the city state on selection
                          className={`border p-2 rounded ${
                            fieldErrors.city ? "border-red-500" : ""
                          }`}
                        >
                          <option value="" disabled>
                            {language === "en"
                              ? "Select a city"
                              : "حدد المدينة"}
                          </option>
                          {cities.map((cityOption) => (
                            <option key={cityOption.id} value={cityOption.id}>
                              {cityOption.name}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.medicalOrgCity && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.medicalOrgCity}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                    >
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label
                          htmlFor="medical_org_email"
                          className={textAlignment}
                        >
                          {t.medicalOrgEmail}
                        </Label>
                        <InputAdmin
                          icon={<Mail size={24} />}
                          type="phone"
                          value={medicalOrgEmail}
                          onChange={(e) => setMedicalOrgEmail(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.medicalOrgEmail ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.medicalOrgEmail && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.medicalOrgEmail}"
                          </p>
                        )}
                      </div>
                      {/* Fixed Price */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="fixed_price" className={textAlignment}>
                          {t.fixedPrice}
                        </Label>
                        <InputAdmin
                          type="number"
                          value={fixedPrice}
                          onChange={(e) => setFixedPrice(e.target.value)}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          className={
                            fieldErrors.fixedPrice ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.fixedPrice && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.fixedPrice}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                    >
                      {/* Payment Method */}
                      <div className="grid gap-2 lg:w-1/2 w-full">
                        <Label htmlFor="payment_method" className={textAlignment}>
                          {t.paymentMethod}
                        </Label>
                        <select
                          id="payment_method"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className={`border p-2 rounded ${
                            fieldErrors.paymentMethod ? "border-red-500" : ""
                          }`}
                        >
                          <option value="Cash">{t.cash}</option>
                          <option value="Online">{t.online}</option>
                        </select>
                        {fieldErrors.paymentMethod && (
                          <p
                            className={`text-red-500 text-sm ${textAlignment}`}
                          >
                            {t.fillField} "{t.paymentMethod}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        className="w-full bg-[#0575E6] h-[70px] rounded-[30px] lg:w-1/2"
                      >
                        {t.next}
                      </Button>
                    </div>
                  </form>
                )}
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
