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
} from "lucide-react";
import { fetchProfileDetails } from "@/lib/api";
import { useRouter } from "next/navigation";

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
  },
};

/**
 * This React component serves as a client-side page for editing the user's profile.
 * It allows authenticated users to update their personal information, such as
 * name, email, and password, with support for dynamic form validation and submission.
 * The page supports both Arabic and English languages, with language preferences
 * stored in localStorage and dynamically applied.
 *
 * Key functionalities include:
 * - Secure user profile update via API call using the current user's authentication token.
 * - Form fields for editing name, email, and password, with validation for each input.
 * - Password visibility toggle for the password field.
 * - Language support for Arabic and English, with dynamic layout adjustments based on the selected language.
 * - Navigation options for settings, appointments, and logout in the sidebar.
 * - Displaying success or error messages based on the API response, with appropriate feedback to the user.
 *
 * Dependencies:
 * - Custom components (Button, Input, Label, etc.)
 * - React hooks (useState, useEffect, useContext) for state management and side effects.
 * - withAuth higher-order component for authentication protection.
 * - Custom validation logic for form fields.
 */

const editUserProfile = async (
  profileData: EditProfileData,
  accessToken: string
): Promise<any> => {
  console.log("entered editUserProfile");
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

// Define the interface for profile data
interface EditProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  gender: string; // "male", "female", etc.
  service_country: number; // assuming this is an ID for a country
  birthday: string; // ISO date string
  city: number; // assuming this is an ID for the city
  user_type: number; // assuming this is an ID for user type
  address: string;
}

interface UploadImageProps {
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/*const UploadImage: React.FC<UploadImageProps> = ({ image, onImageChange }) => {
  return (
    <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20">
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onImageChange}
        accept="image/*"
      />
      <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
        )}
        <div className="absolute bottom-2 left-2 bg-gray-50 rounded-full p-1 shadow-md">
          <span className="text-xl font-bold text-gray-600">
            <Camera className="text-roshitaDarkBlue" />
          </span>
        </div>
      </div>
    </div>
  );
};*/

const Profile = () => {
  const router = useRouter(); // Initialize useRouter
  const [image, setImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cities = [
    { id: 1, country: 2, name: "تونس العاصمة", foreign_name: "Tunis" },
    { id: 2, country: 2, name: "سوسة", foreign_name: "Soussa" },
    { id: 4, country: 2, name: "صفاقس", foreign_name: "Sfax" },
    { id: 3, country: 1, name: "طرابلس", foreign_name: "Tripoli" },
  ];

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

  const filteredCities = cities.filter(
    (city) => city.country === profileData.service_country
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setImage(file);
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileDetails();

        // Check the structure of the fetched data
        console.log("Fetched profile data:", data);

        // Update profileData with the fetched data

        setProfileData({
          user: {
            first_name: data.user?.first_name || "",
            last_name: data.user?.last_name || "",
            email: data.user?.email || "",
          },
          gender: data.gender || "",
          service_country: data.service_country || 2, // Ensure default values are not 0
          birthday: data.birthday || "",
          city: data.city || 1, // Ensure default values are not 0
          user_type: data.user_type || 0,
          address: data.address || "",
        });

        // Set the image if available
        if (data.avatar) {
          setImage(data.avatar);
        }
      } catch (error) {
        console.error("Error loading profile data", error);
      }
    };

    loadProfileData();
  }, []);

  const handleSave = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Ensure profileData has the correct structure and all fields are populated
      await editUserProfile(profileData, token);

      setSuccessMessage("Profile updated successfully.");
      window.location.reload();
      console.log("Profile updated successfully.");
    } catch (error: any) {
      setErrorMessage(error.message || "Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const handleSettingsClick = () => {
    router.push("/profile");
  };

  const handleAppointmentsClick = () => {
    router.push("/appointments");
  };

  const handleSettingsPasswordClick = () => {
    router.push("/password-change");
  };

  const handleNotificationsClick = () => {
    router.push("/notifications");
  };

  const handleConsultationsClick = () => {
    router.push("/consultations");
  };

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div
          className={`flex ${
            language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
          } flex-col justify-start gap-10 mx-auto`}
        >
          <div className="flex lg:w-[20%] w-[100%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20 h-40 w-40">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            <div>
              <div
                onClick={handleSettingsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-gray-50 h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].settings}</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-gray-50 h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].changePassword}</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-gray-50 h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].appointments}</p>
              </div>
              <div
                onClick={handleConsultationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-gray-50 h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].consultations}</p>
              </div>
              <div
                onClick={handleNotificationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-gray-50 h-6 w-6 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].notification}</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-gray-50 h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].logout}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-end flex-col w-[80%] mx-auto bg-white p-4">
            {successMessage && (
              <p className="text-green-400">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-400">{errorMessage}</p>}
            <div className="flex justify-between gap-4">
              <div className="w-1/2">
                {language === "ar" ? (
                  <Label className="text-start">الإسم الأول</Label>
                ) : (
                  <div className="w-full flex ">
                    <Label className="text-end pb-2"> First Name</Label>
                  </div>
                )}
                <div
                  className={`flex gap-2 ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  } items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none`}
                >
                  <UserRound className="text-roshitaBlue" />
                  <Input
                    value={profileData.user.first_name || "-"}
                    onChange={(e) =>
                      setProfileData((prevState) => ({
                        ...prevState,
                        user: { ...prevState.user, first_name: e.target.value },
                      }))
                    }
                    placeholder="الإسم الأول"
                    className={`border-transparent shadow-none h-[50px] ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  />
                </div>
              </div>
              <div className="w-1/2">
                {language === "ar" ? (
                  <Label className="text-start">الإسم الأخير</Label>
                ) : (
                  <div className="w-full flex ">
                    <Label className="text-end pb-2"> Last Name</Label>
                  </div>
                )}
                <div
                  className={`flex gap-2 ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  } items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none`}
                >
                  <UserRound className="text-roshitaBlue" />
                  <Input
                    value={profileData.user.last_name || "-"}
                    onChange={(e) =>
                      setProfileData((prevState) => ({
                        ...prevState,
                        user: { ...prevState.user, last_name: e.target.value },
                      }))
                    }
                    placeholder="الإسم الأخير"
                    className={`border-transparent shadow-none h-[50px] ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  />
                </div>
              </div>
            </div>
            <div>
              {language === "ar" ? (
                <Label className="text-end">البريد الإلكتروني</Label>
              ) : (
                <div className="w-full flex ">
                  <Label className="text-start">Email</Label>
                </div>
              )}

              <div className="flex gap-2 items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none">
                <Mail className="text-roshitaBlue" />
                <Input
                  value={profileData.user.email || "-"}
                  onChange={(e) =>
                    setProfileData((prevState) => ({
                      ...prevState,
                      user: { ...prevState.user, email: e.target.value },
                    }))
                  }
                  placeholder={
                    language === "ar" ? "البريد الإلكتروني" : "Email"
                  } // Adjust placeholder based on language
                  className={`border-transparent shadow-none h-[50px] ${
                    language === "ar" ? "text-right" : "text-left"
                  }`} // Apply text-right for Arabic
                />
              </div>
            </div>

            <div>
              {language === "ar" ? (
                <Label className="text-start">البلد</Label>
              ) : (
                <div className="w-full flex ">
                  <Label className="text-start pb-2">Country</Label>
                </div>
              )}
              <select
                value={profileData.service_country || ""}
                onChange={(e) =>
                  setProfileData((prevState) => ({
                    ...prevState,
                    service_country: Number(e.target.value), // Ensure it's a number
                  }))
                }
                className="border-transparent shadow-none h-[50px] w-full bg-gray-50"
              >
                {language === "ar" ? (
                  <option value="">اختر البلد</option>
                ) : (
                  <option value="">Country</option>
                )}
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

            <div className="mt-4">
              {language === "ar" ? (
                <Label className="text-start">المدينة</Label>
              ) : (
                <div className="w-full flex ">
                  <Label className="text-start pb-2">City</Label>
                </div>
              )}
              <select
                value={profileData.city || ""}
                onChange={(e) =>
                  setProfileData((prevState) => ({
                    ...prevState,
                    service_city: Number(e.target.value), // Ensure it's a number
                  }))
                }
                className="border-transparent shadow-none h-[50px] w-full bg-gray-50"
                disabled={!profileData.service_country} // Disable if no country is selected
              >
                {language === "ar" ? (
                  <option value="">اختر المدينة</option>
                ) : (
                  <option value="">City</option>
                )}
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {language === "ar" ? city.name : city.foreign_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {language === "ar" ? (
                <Label className="text-start">الجنس</Label>
              ) : (
                <div className="w-full flex ">
                  <Label className="text-start pb-2">Gender</Label>
                </div>
              )}
              <RadioGroup
                value={profileData.gender}
                onValueChange={(value) =>
                  setProfileData((prevState) => ({
                    ...prevState,
                    gender: value,
                  }))
                }
              >
                <div
                  className={`flex gap-4 ${
                    language === "en" ? "justify-start" : "justify-end"
                  } mt-4`}
                >
                  <RadioGroupItem value="male" id="male" className="h-4 w-4" />
                  {language === "ar" ? (
                    <Label className="text-start">ذكر</Label>
                  ) : (
                    <Label className="text-start">Male</Label>
                  )}
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="h-4 w-4"
                  />
                  {language === "ar" ? (
                    <Label className="text-start">أنثى</Label>
                  ) : (
                    <Label className="text-start">Female</Label>
                  )}
                </div>
              </RadioGroup>
            </div>
            <div>
              {language === "ar" ? (
                <Label className="text-start">تاريخ الميلاد</Label>
              ) : (
                <div className="w-full flex ">
                  <Label className="text-start pb-2">Birthday</Label>
                </div>
              )}
              <div
                className={`flex gap-2 ${
                  language === "en" ? "flex-row" : "flex-row-reverse"
                } items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none`}
              >
                <Input
                  type="date"
                  value={profileData.birthday || ""}
                  onChange={(e) =>
                    setProfileData((prevState) => ({
                      ...prevState,
                      birthday: e.target.value,
                    }))
                  }
                  className={`border-transparent shadow-none h-[50px] ${
                    language === "en" ? "justify-start" : "justify-end"
                  }`}
                />
              </div>
            </div>
            {/*<div>
              <Label className="text-start">العنوان</Label>
              <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none">
                <MapPin className="text-roshitaBlue" />
                <Input
                  value={profileData.address || '-'}
                  onChange={(e) =>
                    setProfileData(prevState => ({
                      ...prevState,
                      address: e.target.value
                    }))
                  }
                  placeholder="العنوان"
                  className="border-transparent shadow-none h-[50px]"
                />
              </div>
            </div>*/}
            <div className="w-[20%]">
              <Button
                onClick={handleSave}
                className="w-full mt-4 bg-roshitaDarkBlue"
              >
                {language === "ar" ? "حفظ" : "Save"}{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
