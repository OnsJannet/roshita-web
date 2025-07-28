"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import withAuth from "@/hoc/withAuth";
import {
  Bell,
  Camera,
  LogOut,
  Mail,
  MapPin,
  MonitorCheck,
  Phone,
  Settings,
  UserRound,
  Wallet,

} from "lucide-react";
import { fetchProfileDetails } from "@/lib/api";
import { useRouter } from "next/navigation";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { paiement } from "@/constant";
import { Separator } from "@/components/ui/separator";
import { MessageAlert } from "@/components/shared/MessageAlert";
import { AlertDialog, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";


type Language = "ar" | "en";

const translations = {
  en: {
    settings: "Settings",
    changePassword: "Change Password",
    appointments: "My Appointments",
    consultations: "My Consultations",
    notification: "Notifications",
    logout: "Log Out",
    next: "Next",
    previous: "Previous",
    noAppointments: "No appointments to display",
    accountDeactivation: "Account Deactivation",
    deactivateAccount: "Deactivate Account",
    deactivateWarning: "Warning: This action is permanent and cannot be undone.",
    deactivateConfirm: "Are you sure you want to deactivate your account?",
    deactivateButton: "Deactivate My Account",
    cancelButton: "Cancel",
  },
  ar: {
    settings: "الإعدادات",
    changePassword: "تغير كلمة المرور",
    appointments: "مواعيدي",
    consultations: "استشارتي",
    logout: "تسجيل الخروج",
    notification: "إشعارات",
    next: "التالي",
    previous: "السابق",
    noAppointments: "لا توجد مواعيد لعرضها",
    accountDeactivation: "تعطيل الحساب",
    deactivateAccount: "تعطيل الحساب",
    deactivateWarning: "تحذير: هذا الإجراء دائم ولا يمكن التراجع عنه.",
    deactivateConfirm: "هل أنت متأكد أنك تريد تعطيل حسابك؟",
    deactivateButton: "تعطيل حسابي",
    cancelButton: "إلغاء",
  },
};

interface EditProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  gender: string;
  service_country: number;
  birthday: string;
  city: number;
  user_type: number;
  address: string;
}

const editUserProfile = async (
  profileData: EditProfileData,
  accessToken: string
): Promise<any> => {
  try {
    const response = await fetch(
      "https://test-roshita.net/api/account/profile/edit/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating profile: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

const Profile = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [chargeAmount, setChargeAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isCharging, setIsCharging] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const cities = [
    { id: 1, country: 2, name: "تونس العاصمة", foreign_name: "Tunis" },
    { id: 2, country: 2, name: "سوسة", foreign_name: "Soussa" },
    { id: 4, country: 2, name: "صفاقس", foreign_name: "Sfax" },
    { id: 3, country: 1, name: "طرابلس", foreign_name: "Tripoli" },
  ];

  const [language, setLanguage] = useState<Language>("ar");
  const [profileData, setProfileData] = useState<EditProfileData>({
    user: {
      first_name: "",
      last_name: "",
      email: "",
    },
    gender: "",
    service_country: 2,
    birthday: "",
    city: 1,
    user_type: 0,
    address: "",
  });

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
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchWalletBalance = async () => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No token found. Please log in.");

    try {
      const response = await fetch("https://test-roshita.net/api/user-wallet/", {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-CSRFToken": "pv96AS6rTm7qURY7HtfGNONOhQa6JwJHJgetixedpqXyRHbPK5juirYIehwnbATD",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return data.balance;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      throw error;
    }
  };

  const handleChargeWallet = async () => {
    setIsCharging(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    const token = localStorage.getItem("access");
    if (!token) {
      setErrorMessage(language === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setIsCharging(false);
      return;
    }

    if (!chargeAmount || !selectedPaymentMethod) {
      setErrorMessage(language === "ar" ? "الرجاء إدخال جميع الحقول المطلوبة" : "Please fill all required fields");
      setIsCharging(false);
      return;
    }

    try {
      const response = await fetch("https://test-roshita.net/api/user-wallet/recharge/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: chargeAmount,
          payment_method: selectedPaymentMethod,
          mobile_number: mobileNumber,
          birth_year: birthYear
        }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      console.log("Recharge successful:", result);
      
      setSuccessMessage(language === "ar" ? "تم شحن المحفظة بنجاح" : "Wallet charged successfully");
      setShowPopup(false);
      
      const balance = await fetchWalletBalance();
      setWalletBalance(balance);
    } catch (error) {
      console.error("Error charging wallet:", error);
      setErrorMessage(language === "ar" ? "حدث خطأ أثناء شحن المحفظة" : "Error charging wallet");
    } finally {
      setIsCharging(false);
    }
  };

  const handleDeactivateAccount = async () => {
    setIsDeactivating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      const token = localStorage.getItem("access");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        throw new Error("Authentication data not found");
      }

      const response = await fetch(
        `http://test-roshita.net/api/account/delete/users/${userId}/`, 
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deactivate account");
      }
      
      // Clear user data and redirect to home page
      localStorage.clear();
      window.location.href = "/";
    } catch (error: any) {
      console.error("Deactivation error:", error);
      setErrorMessage(
        language === "ar" 
          ? `حدث خطأ أثناء محاولة تعطيل الحساب: ${error.message}` 
          : `Error deactivating account: ${error.message}`
      );
    } finally {
      setIsDeactivating(false);
      setShowDeactivateDialog(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileData, balance] = await Promise.all([
          fetchProfileDetails(),
          fetchWalletBalance()
        ]);

        setProfileData({
          user: {
            first_name: profileData.user?.first_name || "",
            last_name: profileData.user?.last_name || "",
            email: profileData.user?.email || "",
          },
          gender: profileData.gender || "",
          service_country: profileData.service_country || 2,
          birthday: profileData.birthday || "",
          city: profileData.city || 1,
          user_type: profileData.user_type || 0,
          address: profileData.address || "",
        });

        if (profileData.avatar) setImage(profileData.avatar);
        setWalletBalance(balance);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No token found. Please log in.");

      await editUserProfile(profileData, token);
      setSuccessMessage("Profile updated successfully.");
      //window.location.reload();
    } catch (error: any) {
      setErrorMessage(error.message || "Error updating profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const handleClick = (id: number, method: string) => {
    setSelectedId(id);
    setSelectedPaymentMethod(method);
  };

  const filteredCities = cities.filter(
    (city) => city.country === profileData.service_country
  );

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center min-h-screen">
        <LoadingDoctors />
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div className={`flex ${language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"} flex-col justify-start gap-10 mx-auto`}>
          {/* Sidebar */}
          <div className="flex lg:w-[20%] w-[100%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20 h-40 w-40">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            
            <div>
              {[
                { icon: <Settings className="h-4 w-4 text-roshitaDarkBlue" />, text: translations[language].settings, handler: () => router.push("/profile") },
                { icon: <Settings className="h-4 w-4 text-roshitaDarkBlue" />, text: translations[language].changePassword, handler: () => router.push("/password-change") },
                { icon: <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />, text: translations[language].appointments, handler: () => router.push("/appointments") },
                { icon: <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />, text: translations[language].consultations, handler: () => router.push("/consultations") },
                { icon: <Bell className="h-4 w-4 text-roshitaDarkBlue" />, text: translations[language].notification, handler: () => router.push("/notifications") },
                { icon: <LogOut className="h-4 w-4 text-roshitaDarkBlue" />, text: translations[language].logout, handler: handleLogout },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={item.handler}
                  className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
                >
                  <div className="rounded-full bg-gray-50 h-6 w-6 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-10 text-end flex-col w-[80%] mx-auto bg-white p-4">
          {successMessage && (
            <MessageAlert type="success" language={language}>
              {successMessage}
            </MessageAlert>
          )}

          {errorMessage && (
            <MessageAlert type="error" language={language}>
              {errorMessage}
            </MessageAlert>
          )}
            {/* Wallet Section */}
            <div className="mt-4">
              <h2 className={`${language === "ar" ? "text-ent" : "text-start"} text-[16px] font-bold mb-6`}>
                {language === "ar" ? "المحفظـة" : "Wallet"}
              </h2>

              <div className={`flex ${language === "ar" ? "flex-row-reverse" : "flex-row"} gap-2 items-center rounded-lg bg-gray-50 border px-4 mt-2`}>
                <div className={`flex ${language === "ar" ? "flex-row-reverse justify-start" : "flex-row justify-end"} items-center w-[80%] gap-0`}>
                  <Wallet className={`text-roshitaBlue ${language === "ar" ? "ml-2" : "mr-2"}`} />
                  <Input
                    value={walletBalance || "0"}
                    disabled
                    placeholder={language === "ar" ? "القيمة الحالية" : "Wallet Balance"}
                    className={`border-transparent shadow-none h-[50px] ${language === "ar" ? "text-end" : "text-start"}`}
                  />
                </div>
                <Button
                  onClick={() => setShowPopup(true)}
                  className="bg-roshitaDarkBlue text-white w-[20%]"
                >
                  {language === "ar" ? "شحن" : "Charge"}
                </Button>
              </div>
            </div>

            <Separator className="my-4 w-[90%] mx-auto" />

            {/* Profile Form */}
            <h2 className={`${language === "ar" ? "text-ent" : "text-start"} text-[16px] font-bold`}>
              {language === "ar" ? "معلومات المستخدم" : "User Information"}
            </h2>

            <div className="flex justify-between gap-4">
             <div dir={ language === "ar" ? "rtl" : "ltr"} className={ language === "ar" ? "text-right  w-1/2" : "text-left mt-4 w-1/2"}>
              <Label className={language === "ar" ? "text-start" : "text-start pb-2"}>
                  {language === "ar" ? "الإسم الأول" : "First Name"}
                </Label>
                <div className={`flex gap-2 ${language === "ar" ? "flex-row-reverse" : "flex-row"} items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none`}>
                  <UserRound className="text-roshitaBlue" />
                  <Input
                    value={profileData.user.first_name || "-"}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      user: { ...prev.user, first_name: e.target.value }
                    }))}
                    placeholder={language === "ar" ? "الإسم الأول" : "First Name"}
                    className={`border-transparent shadow-none h-[50px] ${language === "ar" ? "text-right" : "text-left"}`}
                  />
                </div>
              </div>

             <div dir={ language === "ar" ? "rtl" : "ltr"} className={ language === "ar" ? "text-right  w-1/2" : "text-left mt-4 w-1/2"}>
              <Label className={language === "ar" ? "text-start" : "text-start pb-2"}>
                  {language === "ar" ? "الإسم الأخير" : "Last Name"}
                </Label>
                <div className={`flex gap-2 ${language === "ar" ? "flex-row-reverse" : "flex-row"} items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none`}>
                  <UserRound className="text-roshitaBlue" />
                  <Input
                    value={profileData.user.last_name || "-"}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      user: { ...prev.user, last_name: e.target.value }
                    }))}
                    placeholder={language === "ar" ? "الإسم الأخير" : "Last Name"}
                    className={`border-transparent shadow-none h-[50px] ${language === "ar" ? "text-right" : "text-left"}`}
                  />
                </div>
              </div>
            </div>

             <div dir={ language === "ar" ? "rtl" : "ltr"} className={ language === "ar" ? "text-right" : "text-left mt-4"}>
              <Label className={language === "ar" ? "text-start" : "text-start pb-2"}>
                {language === "ar" ? "البريد الإلكتروني" : "Email"}
              </Label>
              <div className="flex gap-2 items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none">
                <Mail className="text-roshitaBlue" />
                <Input
                  value={profileData.user.email || "-"}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    user: { ...prev.user, email: e.target.value }
                  }))}
                  placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
                  className={`border-transparent shadow-none h-[50px] ${language === "ar" ? "text-right" : "text-left"}`}
                />
              </div>
            </div>

             <div dir={ language === "ar" ? "rtl" : "ltr"} className={ language === "ar" ? "text-right mt-4" : "text-left mt-4"}>
              <Label className={language === "ar" ? "text-start" : "text-start pb-2"}>
    {language === "ar" ? "البلد" : "Country"}
  </Label>
  <select
    value={profileData.service_country || ""}
    onChange={(e) => setProfileData(prev => ({
      ...prev,
      service_country: Number(e.target.value)
    }))}
    className="border-transparent shadow-none h-[50px] w-full bg-gray-50 px-4"
  >
    <option value="">{language === "ar" ? "اختر البلد" : "Select Country"}</option>
    {language === "ar" ? (
      <>
        <option value="2">تونس</option>
        <option value="1">ليبيا</option>
      </>
    ) : (
      <>
        <option value="2">Tunisia</option>
        <option value="1">Libya</option>
      </>
    )}
  </select>
</div>

             <div dir={ language === "ar" ? "rtl" : "ltr"} className={ language === "ar" ? "text-right mt-4" : "text-left mt-4"}>
              <Label className={language === "ar" ? "text-start" : "text-start pb-2"}>
                {language === "ar" ? "المدينة" : "City"}
              </Label>
              <select
                value={profileData.city || ""}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  city: Number(e.target.value)
                }))}
                className="border-transparent shadow-none h-[50px] w-full bg-gray-50 px-4"
                disabled={!profileData.service_country}
              >
                <option value="">{language === "ar" ? "اختر المدينة" : "Select City"}</option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {language === "ar" ? city.name : city.foreign_name}
                  </option>
                ))}
              </select>
            </div>

             <div dir={ language === "ar" ? "rtl" : "ltr"} className={ language === "ar" ? "text-right  w-1/2" : "text-left mt-4 w-1/2"}>
              <Label className={language === "ar" ? "text-start" : "text-start pb-2"}>
                {language === "ar" ? "الجنس" : "Gender"}
              </Label>
              <RadioGroup
                value={profileData.gender}
                onValueChange={(value) => setProfileData(prev => ({
                  ...prev,
                  gender: value
                }))}
              >
                <div className={`flex gap-4 ${language === "en" ? "justify-start" : "justify-end"} mt-4`}>
                  <RadioGroupItem value="male" id="male" className="h-4 w-4" />
                  <Label className="text-start">
                    {language === "ar" ? "ذكر" : "Male"}
                  </Label>
                  <RadioGroupItem value="female" id="female" className="h-4 w-4" />
                  <Label className="text-start">
                    {language === "ar" ? "أنثى" : "Female"}
                  </Label>
                </div>
              </RadioGroup>
            </div>

             <div dir={ language === "ar" ? "rtl" : "ltr"} className={ language === "ar" ? "text-right  " : "text-left mt-4 "}>
              <Label className={language === "ar" ? "text-start" : "text-start pb-2"}>
                {language === "ar" ? "تاريخ الميلاد" : "Birthday"}
              </Label>
              <div className={`flex gap-2 ${language === "en" ? "flex-row" : "flex-row-reverse"} items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none`}>
                <Input
                  type="date"
                  value={profileData.birthday || ""}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    birthday: e.target.value
                  }))}
                  className="border-transparent shadow-none h-[50px]"
                />
              </div>
            </div>

            <div className="w-[20%]">
              <Button
                onClick={handleSave}
                className="w-full mt-4 bg-roshitaDarkBlue"
              >
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
            </div>

            <Separator className="my-4 w-[90%] mx-auto" />

{/* Account Deactivation Section */}
<div className="mt-8" dir={language === "ar" ? "rtl" : "ltr"}>
  <h2 className={`text-[16px] font-bold mb-6 text-red-600 ${language === "ar" ? "text-right" : "text-left"}`}>
    {translations[language].accountDeactivation}
  </h2>

  <div className={`flex ${language === "ar" ? "flex-row" : "flex-row"} items-center gap-2 mb-4`}>

    <div>
      <h3 className={`font-medium ${language === "ar" ? "text-right" : "text-left"}`}>
        {translations[language].deactivateAccount}
      </h3>
      <p className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
        {translations[language].deactivateWarning}
      </p>
    </div>
  </div>

  <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
    <DialogTrigger asChild>
      <Button variant="destructive" className="w-auto mt-2">
        {translations[language].deactivateButton}
      </Button>
    </DialogTrigger>
    <DialogContent className={language === "ar" ? "text-right" : "text-left"}>
      <DialogHeader>
        <DialogTitle className="text-destructive">
          {translations[language].deactivateAccount}
        </DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p>{translations[language].deactivateConfirm}</p>
      </div>
      <div className={`flex ${language === "ar" ? "flex-row-reverse" : "flex-row"} justify-end gap-4`}>
        <Button 
          variant="outline" 
          onClick={() => setShowDeactivateDialog(false)}
        >
          {translations[language].cancelButton}
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDeactivateAccount}
          disabled={isDeactivating}
        >
          {isDeactivating
            ? language === "ar"
              ? "جاري التعطيل..."
              : "Deactivating..."
            : translations[language].deactivateButton}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</div>

          </div>
        </div>
      </div>

      {/* Charge Wallet Dialog */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              {language === "ar" ? "شحن المحفظة" : "Charge Wallet"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

            <div className="space-y-4">
              <div>
                <p className={`${language === "ar" ? "text-right" : "text-left"} font-semibold`}>
                  {language === "ar" ? "المبلغ" : "Amount"}
                </p>
                <Input
                  type="number"
                  placeholder={language === "ar" ? "المبلغ" : "Amount"}
                  className="mt-2"
                  dir={language === "ar" ? "rtl" : "ltr"}
                  value={chargeAmount}
                  //@ts-ignore
                  onChange={(e) => setChargeAmount(e.target.value)}
                />
              </div>

              <div>
                <p className={`${language === "ar" ? "text-right" : "text-left"} font-semibold`}>
                  {language === "ar" ? "رقم الهاتف" : "Mobile Number"}
                </p>
                <Input
                  type="tel"
                  placeholder={language === "ar" ? "رقم الهاتف" : "Mobile Number"}
                  className="mt-2"
                  dir={language === "ar" ? "rtl" : "ltr"}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              <div>
                <p className={`${language === "ar" ? "text-right" : "text-left"} font-semibold`}>
                  {language === "ar" ? "سنة الميلاد" : "Birth Year"}
                </p>
                <Input
                  type="number"
                  placeholder={language === "ar" ? "سنة الميلاد" : "Birth Year"}
                  className="mt-2"
                  dir={language === "ar" ? "rtl" : "ltr"}
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                />
              </div>

<div className="mt-4">
  <p className={`${language === "ar" ? "text-right" : "text-left"} font-semibold`}>
    {language === "ar" ? "طرق الدفع" : "Payment Methods"}
  </p>
<div className="mt-4">

  
  {/* Step 1: Payment Method Selection */}
  {selectedId !== 3 && (
    <div className="flex flex-wrap gap-4 mt-2">
      {paiement.map((option) => (
        <div
          key={option.id}
          className={`flex ${
            language === "en" ? "flex-row" : "flex-row-reverse"
          } justify-start gap-2 items-center p-4 rounded-lg cursor-pointer transition-colors w-full ${
            selectedId === option.id
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleClick(option.id, option.name_en.toLowerCase())}
        >
          <img
            src={option.image}
            alt={language === "en" ? option.name_en : option.name}
            className="w-16 h-16 mb-2 object-contain"
          />
          <span className="text-lg font-semibold">
            {language === "en" ? option.name_en : option.name}
          </span>
        </div>
      ))}
    </div>
  )}

  {/* Step 2: Bank Card Form */}
  {selectedId === 3 && (
    <div>
      {/* Back button to return to payment methods */}
<div className={`flex ${language === "ar" ? "justify-end" : "justify-start"}`}>
        <button 
          onClick={() => setSelectedId(null)}
          className={`flex items-center gap-2 mb-4 text-blue-600 ${language === "ar" ? "flex-row" : "flex-row"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {language === "ar" ? "العودة إلى طرق الدفع" : "Back to payment methods"}
        </button>
      </div>

      {/* Card Form */}
      <div className={`w-full p-4 bg-gray-50 rounded-lg ${language === "ar" ? "text-right" : "text-left"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Number */}
          <div>
            <label className="block mb-2">
              {language === "ar" ? "رقم البطاقة" : "Card Number"}
            </label>
            <Input
              type="text"
              placeholder={language === "ar" ? "1234 5678 9012 3456" : "1234 5678 9012 3456"}
              className="w-full"
              dir="ltr"
            />
          </div>
          
          {/* Card Holder */}
          <div>
            <label className="block mb-2">
              {language === "ar" ? "اسم حامل البطاقة" : "Card Holder"}
            </label>
            <Input
              type="text"
              placeholder={language === "ar" ? "الاسم كما هو مدون على البطاقة" : "Name on card"}
              className="w-full"
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
          
          {/* Expiry Date */}
          <div>
            <label className="block mb-2">
              {language === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}
            </label>
            <Input
              type="text"
              placeholder={language === "ar" ? "MM/YY" : "MM/YY"}
              className="w-full"
              dir="ltr"
            />
          </div>
          
          {/* CVV */}
          <div>
            <label className="block mb-2">
              {language === "ar" ? "رمز الأمان (CVV)" : "Security Code (CVV)"}
            </label>
            <Input
              type="text"
              placeholder={language === "ar" ? "123" : "123"}
              className="w-full"
              dir="ltr"
            />
          </div>
        </div>
        
        
      </div>
    </div>
  )}
</div>
</div>
            </div>

            <Button 
              className="mt-4 bg-roshitaDarkBlue w-full"
              onClick={handleChargeWallet}
              disabled={isCharging}
            >
              {isCharging ? (
                language === "ar" ? "جاري الشحن..." : "Charging..."
              ) : (
                language === "ar" ? "شحن" : "Charge"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withAuth(Profile);