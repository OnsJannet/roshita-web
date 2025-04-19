"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import withAuth from "@/hoc/withAuth";
import {
  Camera,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MonitorCheck,
  Phone,
  Settings,
  UserRound,
  Eye,
  EyeOff,
  Bell,
} from "lucide-react";
import { fetchProfileDetails } from "@/lib/api";
import { useRouter } from "next/navigation";
import { MessageAlert } from "@/components/shared/MessageAlert";

type Language = "ar" | "en";

// Define the interface for profile data
interface UploadImageProps {
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * This React component serves as a client-side page for changing the user's password.
 * It allows authenticated users to securely update their old and new passwords,
 * with support for password visibility toggles.
 * The page supports both Arabic and English languages, with language preferences
 * stored in localStorage and dynamically applied.
 *
 * Key functionalities include:
 * - Secure password change via API call using the current user's authentication token.
 * - Inputs for the old password and new password, with visibility toggle for each field.
 * - Language support for Arabic and English, with dynamic layout adjustments.
 * - Navigation options for settings, appointments, and logout in the sidebar.
 * - Displaying success or error messages based on the API response.
 *
 * Dependencies:
 * - Custom components (Button, Input, Label, etc.)
 * - React hooks (useState, useEffect) for state management and side effects.
 * - withAuth higher-order component for authentication protection.
 */

const PasswordChange = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [passwordCheckVisible, setPasswordCheckVisible] =
    useState<boolean>(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
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

  const changePassword = async (newPassword: string, oldPassword: string) => {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      console.log("token change passowrd", token);

      const response = await fetch(
        "http://test-roshita.net/api/account/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = `${
          language === "ar"
            ? "خطأ في تغيير كلمة المرور"
            : "Error changing password"
        }: ${response.statusText}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMsg(
        `${
          language === "ar"
            ? "تم تغيير كلمة المرور بنجاح"
            : "Password changed successfully"
        }: ${data.message}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleSave = async () => {
    await changePassword(password, passwordCheck); // Make sure to pass oldPassword appropriately
    console.log("Password changed successfully.");
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

  const handleSettingsPasswordClick = () => {
    router.push("/password-change");
  };

  const handleAppointmentsClick = () => {
    router.push("/appointments");
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
        <div className="flex justify-start gap-10 flex-row-reverse mx-auto">
          <div className="flex lg:w-[20%] w-[40%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
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
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{language === "ar" ? "الإعدادات" : "Settings"}</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>
                  {language === "ar" ? "تغير كلمة المرور" : "Change Password"}
                </p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{language === "ar" ? "مواعيدي" : "My Appointments"}</p>
              </div>
              <div
                onClick={handleConsultationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{language === "ar" ? "استشارتي" : "My consultation"}</p>
              </div>
              <div
                onClick={handleNotificationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{language === "ar" ? "إشعارات" : "Notifications"}</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{language === "ar" ? "تسجيل الخروج" : "Log Out"}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-end flex-col w-[80%] mx-auto bg-white p-4">
            {msg && (
              <MessageAlert type="success" language={language}>
                {msg}
              </MessageAlert>
            )}

            {error && (
              <MessageAlert type="error" language={language}>
                {error}
              </MessageAlert>
            )}
            <div>
              {language === "ar" ? (
                <Label className="text-end">كلمة المرور القديمة</Label>
              ) : (
                <div className="w-full flex ">
                  <Label className="text-start">Old Password</Label>
                </div>
              )}

              <div
                className={`flex gap-2 ${
                  language === "en" ? "flex-row" : "flex-row-reverse"
                } items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none text-start`}
              >
                <Lock className="text-roshitaBlue" />
                <Input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder={language === "ar" ? "كلمة المرور" : "Password"}
                  className={`border-transparent shadow-none h-[50px] ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                />
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="text-roshitaDarkBlue" />
                  ) : (
                    <Eye className="text-roshitaDarkBlue" />
                  )}
                </button>
              </div>
            </div>
            <div>
              {language === "ar" ? (
                <Label className="text-end">كلمة المرور الجديدة</Label>
              ) : (
                <div className="w-full flex ">
                  <Label className="text-start">New Password</Label>
                </div>
              )}

              <div
                className={`flex gap-2 ${
                  language === "en" ? "flex-row" : "flex-row-reverse"
                } items-center rounded-lg bg-gray-50 border px-4 mt-2 border-none text-start`}
              >
                <Lock className="text-roshitaBlue" />
                <Input
                  type={passwordCheckVisible ? "text" : "password"}
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  id="password-check"
                  placeholder={
                    language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"
                  }
                  className={`border-transparent shadow-none h-[50px] ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                />
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => setPasswordCheckVisible(!passwordCheckVisible)}
                >
                  {passwordCheckVisible ? (
                    <EyeOff className="text-roshitaDarkBlue" />
                  ) : (
                    <Eye className="text-roshitaDarkBlue" />
                  )}
                </button>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="text-white bg-roshitaBlue mt-8 w-full"
            >
              {language === "ar" ? "حفظ" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PasswordChange);
