"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

import {
  Building,
  Lock,
  Mail,
  Phone,
  User,
  Calendar,
  FileText,
  Clock,
  AlertCircle,
  UploadCloud,
  X,
} from "lucide-react";
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
    back: "السابق",
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
    staffAvatar: "صورة الطبيب",
    fixedPrice: "سعر الكشف",
    isConsultant: "هل هو استشاري",
    medicalOrgName: "اسم عيادة الطبيب",
    medicalOrgPhone: "رقم هاتف السكرتيرة او المساعد",
    medicalOrgEmail: "أيميل العيادة او السكرتيرة",
    medicalOrgCity: "المدينة (مكان العيادة)",
    medicalOrgAddress: "عنوان عيادة الطبيب",
    medicalOrgLatitude: "خط العرض للمنظمة الطبية",
    medicalOrgLongitude: "خط الطول للمنظمة الطبية",
    firstName: "الاسم",
    lastName: "اللقب",
    paymentMethod: "طريقة الدفع",
    cash: "نقدي",
    online: "عبر الإنترنت",
    secretaryName: "اسم السكرتيرة او المساعد",
    coordinationContactName: "اسم منسق الاتصال",
    whatsappNumber: "رقم الواتساب",
    licenseExpiryDate: "تاريخ انتهاء الرخصة",
    medicalLicenseNumber: "رقم الرخصة الطبية",
    yearsOfExperience: "سنوات الخبرة",
    documentTitle: "عنوان المستند",
    documentType: "نوع المستند",
    issueDate: "تاريخ الإصدار",
    expiryDate: "تاريخ الانتهاء",
    documentNotes: "ملاحظات المستند",
    uploadDocument: "رفع المستند",
    basicInfo: "المعلومات الأساسية",
    clinicInfo: "معلومات العيادة",
    documents: "المستندات",
    consultant: "استشاري",
    notConsultant: "غير استشاري",
    addDocument: "إضافة مستند",
    removeDocument: "إزالة مستند",
    step1: "المعلومات الشخصية",
    step2: "معلومات العيادة",
    step3: "المستندات المطلوبة",
    registrationSuccess: "تم التسجيل بنجاح!",
    registrationFailed: "فشل في التسجيل",
    requiredField: "هذا الحقل مطلوب",
  },
  en: {
    selectType: "Choose the type of institution",
    dashboard: "In Roshetta Dashboard",
    lab: "Laboratories",
    rays: "Radiologies",
    hospital: "Hospitals",
    doctors: "Doctors",
    next: "Next",
    back: "Back",
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
    staffAvatar: "Doctor Photo",
    fixedPrice: "Examination Price",
    isConsultant: "Is Consultant",
    medicalOrgName: "Doctor Clinic Name",
    medicalOrgPhone: "Secretary/Assistant Phone",
    medicalOrgEmail: "Clinic/Secretary Email",
    medicalOrgCity: "Profession Select City",
    medicalOrgAddress: "Doctor Clinic Address",
    medicalOrgLatitude: "Medical Organization Latitude",
    medicalOrgLongitude: "Medical Organization Longitude",
    firstName: "First Name",
    lastName: "Last Name",
    paymentMethod: "Payment Method",
    cash: "Cash",
    online: "Online",
    secretaryName: "Secretary/Assistant Name",
    coordinationContactName: "Coordination Contact Name",
    whatsappNumber: "WhatsApp Number",
    licenseExpiryDate: "License Expiry Date",
    medicalLicenseNumber: "Medical License Number",
    yearsOfExperience: "Years of Experience",
    documentTitle: "Document Title",
    documentType: "Document Type",
    issueDate: "Issue Date",
    expiryDate: "Expiry Date",
    documentNotes: "Document Notes",
    uploadDocument: "Upload Document",
    basicInfo: "Basic Information",
    clinicInfo: "Clinic Information",
    documents: "Documents",
    consultant: "Consultant",
    notConsultant: "Not Consultant",
    addDocument: "Add Document",
    removeDocument: "Remove Document",
    step1: "Personal Information",
    step2: "Clinic Information",
    step3: "Required Documents",
    registrationSuccess: "Registration Successful!",
    registrationFailed: "Registration Failed",
    requiredField: "This field is required",
  },
};

// Document types for the dropdown
const documentTypes = [
  { id: "1", name: "License" },
  { id: "2", name: "Passport" },
  { id: "3", name: "Certificate" },
  { id: "4", name: "ID" },
];

const Page = () => {
  const [step, setStep] = useState(1); // Step state
  const [formStep, setFormStep] = useState(1); // Form step state for doctor registration
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
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const router = useRouter();
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalForeignName, setHospitalForeignName] = useState("");
  const [medicalOrgEmail, setMedicalOrgEmail] = useState("");
  const [medicalOrgAddress, setMedicalOrgAddress] = useState("");
  const [medicalOrgCity, setMedicalOrgCity] = useState("");
  const [selected, setSelected] = useState<
    "lab" | "hospital" | "rays" | "doctors" | null
  >(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [staffAvatar, setStaffAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [isConsultant, setIsConsultant] = useState(true);
  const [coordinationContactName, setCoordinationContactName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [documents, setDocuments] = useState<any[]>([
    {
      title: "",
      document_type_id: "",
      issue_date: "",
      expiry_date: "",
      notes: "",
      file: null,
      preview: null,
    },
  ]);
  const [success, setSuccess] = useState(false);

  const handleAvatarUpload = (file: File | null) => {
    if (file) {
      setStaffAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    } else {
      setStaffAvatar(null);
      setPreviewAvatar(null);
    }
  };

const handleDocumentUpload = (file: File | null, index: number) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;

      // If you're reconstructing the File object for some reason
      const reconstructedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      const updatedDocs = [...documents];
      updatedDocs[index] = {
        ...updatedDocs[index],
        file: reconstructedFile,
        preview,
      };
      setDocuments(updatedDocs);
    };
    reader.readAsDataURL(file);
  } else {
    // Reset file and preview
    const updatedDocs = [...documents];
    updatedDocs[index] = {
      ...updatedDocs[index],
      file: null,
      preview: null,
    };
    setDocuments(updatedDocs);
  }
};


  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        title: "",
        document_type_id: "",
        issue_date: "",
        expiry_date: "",
        notes: "",
        file: null,
        preview: null,
      },
    ]);
  };

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      const updatedDocuments = [...documents];
      updatedDocuments.splice(index, 1);
      setDocuments(updatedDocuments);
    }
  };

  const handleDocumentChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: value,
    };
    setDocuments(updatedDocuments);
  };

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("language");
      if (isMounted) {
        if (storedLanguage) {
          setLanguage(storedLanguage as Language);
        } else {
          setLanguage("ar");
        }
      }

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "language" && isMounted) {
          setLanguage((event.newValue as Language) || "ar");
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        isMounted = false;
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  const handleSelect = (option: "lab" | "hospital" | "rays" | "doctors") => {
    setSelected(option);
  };

  const handleNext = () => {
    if (selected) {
      setStep(2);
    } else {
      const message =
        language === "ar"
          ? "يرجى اختيار نوع المؤسسة!"
          : "Please select the type of institution!";
      alert(message);
    }
  };

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
    return Object.keys(errors).length === 0;
  };

  const validateDoctorStep1 = () => {
    const errors: Record<string, boolean> = {};
    if (!name.trim()) errors.firstName = true;
    if (!lastName.trim()) errors.lastName = true;
    if (!phone.trim()) errors.doctorPhone = true;
    if (!email.trim()) errors.email = true;
    if (!staffAvatar) errors.staffAvatar = true;
    if (!speciality) errors.specialty = true;
    if (!city) errors.city = true;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDoctorStep2 = () => {
    const errors: Record<string, boolean> = {};
    if (!medicalOrgName.trim()) errors.medicalOrgName = true;
    if (!medicalOrgPhone.trim()) errors.medicalOrgPhone = true;
    if (!medicalOrgEmail.trim()) errors.medicalOrgEmail = true;
    if (!medicalOrgCity) errors.medicalOrgCity = true;
    if (!medicalOrgAddress.trim()) errors.medicalOrgAddress = true;
    if (!fixedPrice) errors.fixedPrice = true;
    if (!paymentMethod) errors.paymentMethod = true;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDoctorStep3 = () => {
    const errors: Record<string, boolean> = {};
    documents.forEach((doc, index) => {
      if (!doc.title.trim()) errors[`document_${index}_title`] = true;
      if (!doc.document_type_id) errors[`document_${index}_type`] = true;
      if (!doc.issue_date) errors[`document_${index}_issue_date`] = true;
      if (!doc.expiry_date) errors[`document_${index}_expiry_date`] = true;
      if (!doc.file) errors[`document_${index}_file`] = true;
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/specialty-list/",
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

    const fetchCountries = async () => {
      const csrfToken = process.env.NEXT_PUBLIC_CSRF_TOKEN;
      console.log("csrfToken", csrfToken);

      try {
        const response = await fetch(
          "https://test-roshita.net/api/cities-list/",
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

    const endpoint = "https://test-roshita.net/api/auth/staff-register/";
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
        if (result.user) {
          const errorMessages = [];

          if (result.user.phone && result.user.phone.length > 0) {
            const phoneError =
              language === "ar"
                ? " رقم الهاتف هذا مستخدم من قبل"
                : result.user.phone[0];
            errorMessages.push(phoneError);
          }

          if (result.user.email && result.user.email.length > 0) {
            const emailError =
              language === "ar"
                ? "البريد الإلكتروني هذا مستخدم من قبل"
                : result.user.email[0];
            errorMessages.push(emailError);
          }

          if (errorMessages.length > 0) {
            setError(errorMessages.join("\n"));
            return;
          }
        }

        setError(
          result.message ||
            (language === "ar"
              ? "حدث خطأ أثناء التسجيل"
              : "An error occurred during registration.")
        );
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

    const formData = new FormData();

    // Basic info
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
    formData.append("is_consultant", isConsultant ? "true" : "false");
    formData.append("medical_org_name", medicalOrgName);
    formData.append("medical_org_phone", medicalOrgPhone);
    formData.append("medical_org_email", medicalOrgEmail);
    formData.append("medical_org_city", medicalOrgCity);
    formData.append("medical_org_address", medicalOrgAddress);
    formData.append("medical_org_latitude", "0");
    formData.append("medical_org_longitude", "0");
    formData.append("pay_method", paymentMethod);

    // Optional fields
    if (coordinationContactName) {
      formData.append("coordination_contact_name", coordinationContactName);
    }
    if (whatsappNumber) {
      formData.append("whatsapp_number", whatsappNumber);
    }
    if (licenseExpiryDate) {
      formData.append("license_expiry_date", licenseExpiryDate);
    }
    if (medicalLicenseNumber) {
      formData.append("medical_license_number", medicalLicenseNumber);
    }
    if (yearsOfExperience) {
      formData.append("years_of_experience", yearsOfExperience);
    }

    // Documents
    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`document_${index}_document_file`, doc.file);
      }
      formData.append(`document_${index}_title`, doc.title);
      formData.append(
        `document_${index}_document_type_id`,
        doc.document_type_id
      );
      formData.append(`document_${index}_issue_date`, doc.issue_date);
      formData.append(`document_${index}_expiry_date`, doc.expiry_date);
      if (doc.notes) {
        formData.append(`document_${index}_notes`, doc.notes);
      }
    });

    try {
      const response = await fetch(
        "https://test-roshita.net/api/register-doctor/",
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
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard/Auth/login";
      }, 2000);
    } catch (err) {
      /* @ts-ignore */
      setError(err.message);
      console.error("Error registering doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextFormStep = () => {
    if (formStep === 1 && !validateDoctorStep1()) {
      return;
    }
    if (formStep === 2 && !validateDoctorStep2()) {
      return;
    }
    if (formStep === 3 && !validateDoctorStep3()) {
      return;
    }
    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      handleRegisterDoctor();
    }
  };

  const handlePrevFormStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

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

          {/* Step 1 - Institution Selection */}
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
                    <ul className="list-disc list-inside inline-block text-left">
                      {error.split("\n").map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {/* Option 1 */}
                  <div
                    className={`p-4 bg-white rounded-lg  text-center cursor-pointer ${
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
                    className={`p-4 bg-white rounded-lg  text-center cursor-pointer ${
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
                    className={`p-4 bg-white rounded-lg  text-center cursor-pointer ${
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
                    className={`p-4 bg-white rounded-lg  text-center cursor-pointer ${
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

          {/* Step 2 - Registration Form */}
          {step === 2 && (
            <div className="flex items-center justify-center py-12 ">
              <div className="mx-auto grid lg:w-[600px] w-[90%] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold text-center">
                    {selected === "doctors" ? t.basicInfo : t.adminInfo}
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

                {success && (
                  <div className="bg-green-100 text-green-700 p-4 rounded text-center">
                    {t.registrationSuccess}
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
                      e.preventDefault();
                      handleNextFormStep();
                    }}
                    className="grid gap-4"
                  >
                    {/* Stepper Indicator */}
                    <div
                      className="flex justify-between mb-6"
                      dir={language === "ar" ? "rtl" : "ltr"}
                    >
                      <div
                        className={`flex flex-col items-center cursor-pointer ${
                          formStep === 1 ? "text-[#0575E6]" : "text-gray-400"
                        }`}
                        onClick={() => setFormStep(1)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            formStep === 1
                              ? "bg-[#0575E6] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          1
                        </div>
                        <span className="text-xs mt-1">{t.step1}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="h-1 w-full bg-gray-200 relative">
                          <div
                            className={`absolute top-0 left-0 h-full ${
                              formStep >= 2 ? "bg-[#0575E6]" : "bg-gray-200"
                            }`}
                            style={{ width: formStep >= 2 ? "100%" : "0%" }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={`flex flex-col items-center cursor-pointer ${
                          formStep === 2 ? "text-[#0575E6]" : "text-gray-400"
                        }`}
                        onClick={() => formStep >= 2 && setFormStep(2)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            formStep === 2
                              ? "bg-[#0575E6] text-white"
                              : formStep > 2
                              ? "bg-[#0575E6] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          2
                        </div>
                        <span className="text-xs mt-1">{t.step2}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="h-1 w-full bg-gray-200 relative">
                          <div
                            className={`absolute top-0 left-0 h-full ${
                              formStep >= 3 ? "bg-[#0575E6]" : "bg-gray-200"
                            }`}
                            style={{ width: formStep >= 3 ? "100%" : "0%" }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={`flex flex-col items-center cursor-pointer ${
                          formStep === 3 ? "text-[#0575E6]" : "text-gray-400"
                        }`}
                        onClick={() => formStep >= 3 && setFormStep(3)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            formStep === 3
                              ? "bg-[#0575E6] text-white"
                              : formStep > 3
                              ? "bg-[#0575E6] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          3
                        </div>
                        <span className="text-xs mt-1">{t.step3}</span>
                      </div>
                    </div>

                    {/* Step 1: Basic Information */}
                    {formStep === 1 && (
                      <>
                        <div className="flex justify-center my-4">
                          <div className="grid gap-2">
                            <Label
                              htmlFor="staff_avatar"
                              className="text-center"
                            >
                              {t.staffAvatar}
                            </Label>
                            <UploadButton
                              onUpload={handleAvatarUpload}
                              picture={previewAvatar || ""}
                            />
                            {fieldErrors.staffAvatar && (
                              <p
                                className={`text-red-500 text-sm ${textAlignment}`}
                              >
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
                            <Label
                              htmlFor="first_name"
                              className={textAlignment}
                            >
                              {t.firstName}
                            </Label>
                            <InputAdmin
                              placeholder={t.firstName}
                              icon={<User size={24} />}
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              //className={fieldErrors.firstName ? "border-red-500" : ""}
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
                            <Label
                              htmlFor="last_name"
                              className={textAlignment}
                            >
                              {t.lastName}
                            </Label>
                            <InputAdmin
                              placeholder={t.lastName}
                              icon={<User size={24} />}
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              //className={fieldErrors.lastName ? "border-red-500" : ""}
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
                            <Label
                              htmlFor="doctor_phone"
                              className={textAlignment}
                            >
                              {t.doctorPhone}
                            </Label>
                            <InputAdmin
                              icon={<Phone size={24} />}
                              type="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              //className={fieldErrors.doctorPhone ? "border-red-500" : ""}
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
                              //className={fieldErrors.email ? "border-red-500" : ""}
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
                            <Label
                              htmlFor="specialty"
                              className={textAlignment}
                            >
                              {t.specialty}
                            </Label>
                            <select
                              id="specialty"
                              value={speciality}
                              dir={language === "ar" ? "rtl" : "ltr"}
                              onChange={(e) =>
                                setSpecialty(Number(e.target.value))
                              }
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
                              dir={language === "ar" ? "rtl" : "ltr"}
                              value={city}
                              onChange={(e) => setCity(Number(e.target.value))}
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
                                <option
                                  key={cityOption.id}
                                  value={cityOption.id}
                                >
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
                          {/* Is Consultant */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="is_consultant"
                              className={textAlignment}
                            >
                              {t.isConsultant}
                            </Label>
                            <div
                              className="flex gap-4"
                              dir={language === "ar" ? "rtl" : "ltr"}
                            >
                              <label className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  name="is_consultant"
                                  checked={isConsultant}
                                  onChange={() => setIsConsultant(true)}
                                  className="mr-2"
                                />
                                {t.consultant}
                              </label>
                              <label className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  name="is_consultant"
                                  checked={!isConsultant}
                                  onChange={() => setIsConsultant(false)}
                                  className="mr-2"
                                />
                                {t.notConsultant}
                              </label>
                            </div>
                          </div>

                          {/* Years of Experience */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="years_of_experience"
                              className={textAlignment}
                            >
                              {t.yearsOfExperience}
                            </Label>
                            {/*@ts-ignore*/}
                            <InputAdmin
                              type="number"
                              value={yearsOfExperience}
                              onChange={(e) =>
                                setYearsOfExperience(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div
                          className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                        >
                          {/* Medical License Number */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="medical_license_number"
                              className={textAlignment}
                            >
                              {t.medicalLicenseNumber}
                            </Label>
                            {/*@ts-ignore*/}
                            <InputAdmin
                              type="text"
                              value={medicalLicenseNumber}
                              onChange={(e) =>
                                setMedicalLicenseNumber(e.target.value)
                              }
                            />
                          </div>

                          {/* License Expiry Date */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="license_expiry_date"
                              className={textAlignment}
                            >
                              {t.licenseExpiryDate}
                            </Label>
                            <InputAdmin
                              type="date"
                              icon={<Calendar size={24} />}
                              value={licenseExpiryDate}
                              onChange={(e) =>
                                setLicenseExpiryDate(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 2: Clinic Information */}
                    {formStep === 2 && (
                      <>
                        <div
                          className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                        >
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
                              onChange={(e) =>
                                setMedicalOrgName(e.target.value)
                              }
                              /*className={
                                fieldErrors.medicalOrgName
                                  ? "border-red-500"
                                  : ""
                              }*/
                            />
                            {fieldErrors.medicalOrgName && (
                              <p
                                className={`text-red-500 text-sm ${textAlignment}`}
                              >
                                {t.fillField} "{t.medicalOrgName}"
                              </p>
                            )}
                          </div>

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
                              onChange={(e) =>
                                setMedicalOrgPhone(e.target.value)
                              }
                              /*className={
                                fieldErrors.medicalOrgPhone
                                  ? "border-red-500"
                                  : ""
                              }*/
                            />
                            {fieldErrors.medicalOrgPhone && (
                              <p
                                className={`text-red-500 text-sm ${textAlignment}`}
                              >
                                {t.fillField} "{t.medicalOrgPhone}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div
                          className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                        >
                          {/* Medical Organization Email */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="medical_org_email"
                              className={textAlignment}
                            >
                              {t.medicalOrgEmail}
                            </Label>
                            <InputAdmin
                              icon={<Mail size={24} />}
                              type="email"
                              value={medicalOrgEmail}
                              onChange={(e) =>
                                setMedicalOrgEmail(e.target.value)
                              }
                              /*className={
                                fieldErrors.medicalOrgEmail
                                  ? "border-red-500"
                                  : ""
                              }*/
                            />
                            {fieldErrors.medicalOrgEmail && (
                              <p
                                className={`text-red-500 text-sm ${textAlignment}`}
                              >
                                {t.fillField} "{t.medicalOrgEmail}"
                              </p>
                            )}
                          </div>

                          {/* Coordination Contact Name */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="coordination_contact_name"
                              className={textAlignment}
                            >
                              {t.coordinationContactName}
                            </Label>
                            <InputAdmin
                              icon={<User size={24} />}
                              type="text"
                              value={coordinationContactName}
                              onChange={(e) =>
                                setCoordinationContactName(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div
                          className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                        >
                          {/* Medical Organization City */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="medical_org_city"
                              className={textAlignment}
                            >
                              {t.medicalOrgCity}
                            </Label>
                            <select
                              id="medicalOrgCity"
                              value={medicalOrgCity}
                              onChange={(e) =>
                                setMedicalOrgCity(e.target.value)
                              }
                              className={`border p-2 rounded ${
                                fieldErrors.medicalOrgCity
                                  ? "border-red-500"
                                  : ""
                              }`}
                            >
                              <option value="" disabled>
                                {language === "en"
                                  ? "Select a city"
                                  : "حدد المدينة"}
                              </option>
                              {cities.map((cityOption) => (
                                <option
                                  key={cityOption.id}
                                  value={cityOption.id}
                                >
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

                          {/* WhatsApp Number */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="whatsapp_number"
                              className={textAlignment}
                            >
                              {t.whatsappNumber}
                            </Label>
                            <InputAdmin
                              icon={<Phone size={24} />}
                              type="phone"
                              value={whatsappNumber}
                              onChange={(e) =>
                                setWhatsappNumber(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div
                          className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                        >
                          {/* Medical Organization Address */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="medical_org_address"
                              className={textAlignment}
                            >
                              {t.medicalOrgAddress}
                            </Label>
                            <InputAdmin
                              icon={<Building size={24} />}
                              type="text"
                              value={medicalOrgAddress}
                              onChange={(e) =>
                                setMedicalOrgAddress(e.target.value)
                              }
                              /*className={
                                fieldErrors.medicalOrgAddress
                                  ? "border-red-500"
                                  : ""
                              }*/
                            />
                            {fieldErrors.medicalOrgAddress && (
                              <p
                                className={`text-red-500 text-sm ${textAlignment}`}
                              >
                                {t.fillField} "{t.medicalOrgAddress}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div
                          className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                        >
                          {/* Fixed Price */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="fixed_price"
                              className={textAlignment}
                            >
                              {t.fixedPrice}
                            </Label>
                            {/*@ts-ignore*/}
                            <InputAdmin
                              type="number"
                              value={fixedPrice}
                              onChange={(e) => setFixedPrice(e.target.value)}
                              /*className={
                                fieldErrors.fixedPrice ? "border-red-500" : ""
                              }*/
                            />
                            {fieldErrors.fixedPrice && (
                              <p
                                className={`text-red-500 text-sm ${textAlignment}`}
                              >
                                {t.fillField} "{t.fixedPrice}"
                              </p>
                            )}
                          </div>

                          {/* Payment Method */}
                          <div className="grid gap-2 lg:w-1/2 w-full">
                            <Label
                              htmlFor="payment_method"
                              className={textAlignment}
                            >
                              {t.paymentMethod}
                            </Label>
                            <select
                              id="payment_method"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className={`border p-2 rounded ${
                                fieldErrors.paymentMethod
                                  ? "border-red-500"
                                  : ""
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
                      </>
                    )}

                    {/* Step 3: Documents */}
                    {formStep === 3 && (
                      <>
                        <div
                          className="mb-4"
                          dir={language === "ar" ? "rtl" : "ltr"}
                        >
                          <h3 className="text-lg font-semibold mb-2">
                            {t.documents}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            {language === "en"
                              ? "Please upload all required documents"
                              : "يرجى رفع جميع المستندات المطلوبة"}
                          </p>
                        </div>

                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="border p-4 rounded-lg mb-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">
                                {/*@ts-ignore*/}
                                {t.document} {index + 1}
                              </h4>
                              {documents.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeDocument(index)}
                                  className="text-red-500 text-sm"
                                >
                                  {t.removeDocument}
                                </button>
                              )}
                            </div>

                            <div
                              className={`flex lg:flex-row flex-col gap-4 ${elementAlignment}`}
                            >
                              {/* Document Title */}
                              <div className="grid gap-2 lg:w-1/2 w-full">
                                <Label
                                  htmlFor={`document_${index}_title`}
                                  className={textAlignment}
                                >
                                  {t.documentTitle}
                                </Label>
                                <InputAdmin
                                  placeholder={t.documentTitle}
                                  icon={<FileText size={24} />}
                                  type="text"
                                  value={doc.title}
                                  onChange={(e) =>
                                    handleDocumentChange(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  //className={fieldErrors[`document_${index}_title`] ? "border-red-500" : ""}
                                />
                                {fieldErrors[`document_${index}_title`] && (
                                  <p
                                    className={`text-red-500 text-sm ${textAlignment}`}
                                  >
                                    {t.fillField} "{t.documentTitle}"
                                  </p>
                                )}
                              </div>

                              {/* Document Type */}
                              <div className="grid gap-2 lg:w-1/2 w-full">
                                <Label
                                  htmlFor={`document_${index}_type`}
                                  className={textAlignment}
                                >
                                  {t.documentType}
                                </Label>
                                <select
                                  id={`document_${index}_type`}
                                  value={doc.document_type_id}
                                  onChange={(e) =>
                                    handleDocumentChange(
                                      index,
                                      "document_type_id",
                                      e.target.value
                                    )
                                  }
                                  className={`border p-2 rounded ${
                                    fieldErrors[`document_${index}_type`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  dir={language === "ar" ? "rtl" : "ltr"}
                                >
                                  <option value="" disabled>
                                    {language === "en"
                                      ? "Select document type"
                                      : "حدد نوع المستند"}
                                  </option>
                                  {documentTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </select>
                                {fieldErrors[`document_${index}_type`] && (
                                  <p
                                    className={`text-red-500 text-sm ${textAlignment}`}
                                  >
                                    {t.fillField} "{t.documentType}"
                                  </p>
                                )}
                              </div>
                            </div>

                            <div
                              className={`flex lg:flex-row flex-col gap-4 ${elementAlignment} mt-4`}
                            >
                              {/* Issue Date */}
                              <div className="grid gap-2 lg:w-1/2 w-full">
                                <Label
                                  htmlFor={`document_${index}_issue_date`}
                                  className={textAlignment}
                                >
                                  {t.issueDate}
                                </Label>
                                <InputAdmin
                                  type="date"
                                  icon={<Calendar size={24} />}
                                  value={doc.issue_date}
                                  onChange={(e) =>
                                    handleDocumentChange(
                                      index,
                                      "issue_date",
                                      e.target.value
                                    )
                                  }
                                  //className={fieldErrors[`document_${index}_issue_date`] ? "border-red-500" : ""}
                                />
                                {fieldErrors[
                                  `document_${index}_issue_date`
                                ] && (
                                  <p
                                    className={`text-red-500 text-sm ${textAlignment}`}
                                  >
                                    {t.fillField} "{t.issueDate}"
                                  </p>
                                )}
                              </div>

                              {/* Expiry Date */}
                              <div className="grid gap-2 lg:w-1/2 w-full">
                                <Label
                                  htmlFor={`document_${index}_expiry_date`}
                                  className={textAlignment}
                                >
                                  {t.expiryDate}
                                </Label>
                                <InputAdmin
                                  type="date"
                                  icon={<Calendar size={24} />}
                                  value={doc.expiry_date}
                                  onChange={(e) =>
                                    handleDocumentChange(
                                      index,
                                      "expiry_date",
                                      e.target.value
                                    )
                                  }
                                  //className={fieldErrors[`document_${index}_expiry_date`] ? "border-red-500" : ""}
                                />
                                {fieldErrors[
                                  `document_${index}_expiry_date`
                                ] && (
                                  <p
                                    className={`text-red-500 text-sm ${textAlignment}`}
                                  >
                                    {t.fillField} "{t.expiryDate}"
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-4">
                              {/* Document Notes */}
                              <div className="grid gap-2 w-full">
                                <Label
                                  htmlFor={`document_${index}_notes`}
                                  className={textAlignment}
                                >
                                  {t.documentNotes}
                                </Label>
                                <InputAdmin
                                  placeholder={t.documentNotes}
                                  icon={<FileText size={24} />}
                                  type="text"
                                  value={doc.notes}
                                  onChange={(e) =>
                                    handleDocumentChange(
                                      index,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-4">
                              {/* Document Upload */}
                              <div dir={language === "ar" ? "rtl" : "ltr"}>
                                <Label
                                  htmlFor={`document_${index}_file`}
                                  className={
                                    language === "ar"
                                      ? "text-right"
                                      : "text-left"
                                  }
                                  dir={language === "ar" ? "rtl" : "ltr"}
                                >
                                  {t.uploadDocument}
                                </Label>
                              </div>

                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                                <input
                                  type="file"
                                  id={`document_${index}_file`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleDocumentUpload(file, index);
                                  }}
                                  accept="image/*,.pdf,.doc,.docx"
                                  className="hidden"
                                />

                                {doc.preview ? (
                                  <div
                                    className="relative"
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `document_${index}_file`
                                        )
                                        ?.click()
                                    }
                                  >
                                    {doc.preview.startsWith("data:image") ? (
                                      <div className="relative w-full h-40 rounded-md overflow-hidden">
                                        <img
                                          src={doc.preview}
                                          alt="Document preview"
                                          className="object-contain w-full h-full"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center p-4">
                                        {/*@ts-ignore*/}
                                        <File
                                          size={48}
                                          className="text-gray-400 mb-2"
                                        />
                                        <p className="text-sm text-gray-600">
                                          {doc.file?.name ||
                                            "Uploaded document"}
                                        </p>
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDocumentUpload(null, index);
                                      }}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <label
                                    htmlFor={`document_${index}_file`}
                                    className="block space-y-2"
                                  >
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                                      <UploadCloud className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {language === "en"
                                        ? "Click to upload"
                                        : "انقر للرفع"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {language === "en"
                                        ? "PDF, JPG up to 5MB"
                                        : "PDF, JPG حتى 5MB"}
                                    </p>
                                  </label>
                                )}
                              </div>

                              {fieldErrors[`document_${index}_file`] && (
                                <p
                                  className={`text-red-500 text-sm ${textAlignment}`}
                                >
                                  {t.fillField} "{t.uploadDocument}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-center mt-4">
                          <Button
                            type="button"
                            onClick={addDocument}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <span>+</span>
                            <span>{t.addDocument}</span>
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                      {formStep > 1 && (
                        <Button
                          type="button"
                          onClick={handlePrevFormStep}
                          variant="outline"
                          className="w-1/2 h-[70px] rounded-[30px]"
                        >
                          {t.back}
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className={`${
                          formStep > 1 ? "w-1/2 ml-4" : "w-full"
                        } bg-[#0575E6] h-[70px] rounded-[30px]`}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>
                              {language === "ar"
                                ? "جاري التسجيل..."
                                : "Registering..."}
                            </span>
                          </div>
                        ) : formStep === 3 ? (
                          <span>
                            {language === "ar" ? "تسجيل" : "Register"}
                          </span>
                        ) : (
                          <span>{t.next}</span>
                        )}
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
