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
} from "lucide-react";
import { fetchProfileDetails } from "@/lib/api";
import { useRouter } from "next/navigation";




// Define the interface for profile data

interface UploadImageProps {
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordChange = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [passwordCheckVisible, setPasswordCheckVisible] =
    useState<boolean>(false);

  const changePassword = async (newPassword: string, oldPassword: string) => {
    try {
      const token = localStorage.getItem("access");
      console.log("access", token);

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        "https://test-roshita.net/api/account/change-password",
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
        throw new Error(`Error changing password: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Password changed successfully:", data);
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

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div className="flex justify-start gap-10 flex-row-reverse mx-auto">
          <div className="flex lg:w-[20%] w-[40%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20 h-40 w-40">
                <div className="w-full h-full rounded-full bg-[#f1f1f1] flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            <div>
              <div
                onClick={handleSettingsClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>الإعدادت</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>تغير كلمة المرور</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>مواعيدي</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>تسجيل الخروج</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-end flex-col w-[80%] mx-auto">
            <div>
              <Label className="text-start">كلمة المرور القديمة</Label>
              <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-white border px-4 mt-2 border-none text-start">
                <Lock className="text-roshitaBlue" />
                <Input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="كلمة المرور"
                  className="border-transparent shadow-none h-[50px] justify-start"
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
              <Label className="text-start">كلمة المرور الجديدة</Label>
              <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-white border px-4 mt-2 border-none text-start">
                <Lock className="text-roshitaBlue" />
                <Input
                  type={passwordCheckVisible ? "text" : "password"}
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  id="password-check"
                  placeholder="تأكيد كلمة المرور"
                  className="border-transparent shadow-none h-[50px] justify-start"
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
              حفظ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PasswordChange);
