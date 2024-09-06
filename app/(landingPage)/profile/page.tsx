"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import withAuth from "@/hoc/withAuth";
import { Camera, LogOut, Mail, MapPin, MonitorCheck, Phone, Settings, UserRound } from "lucide-react";
import { fetchProfileDetails } from "@/lib/api";

/**
 * Edits the user profile by making a POST request to the profile edit API.
 */
export const editUserProfile = async (profileData: EditProfileData, accessToken: string): Promise<any> => {
    console.log("entered editUserProfile")
  try {
    const response = await fetch("https://test-roshita.net/api/account/profile/edit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    });

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
  gender: string;  // "male", "female", etc.
  service_country: number;  // assuming this is an ID for a country
  birthday: string;  // ISO date string
  city: number;  // assuming this is an ID for the city
  user_type: number;  // assuming this is an ID for user type
  address: string;
}

interface UploadImageProps {
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ image, onImageChange }) => {
  return (
    <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20">
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onImageChange}
        accept="image/*"
      />
      <div className="w-full h-full rounded-full bg-[#f1f1f1] flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
        )}
        <div className="absolute bottom-2 left-2 bg-white rounded-full p-1 shadow-md">
          <span className="text-xl font-bold text-gray-600">
            <Camera className="text-roshitaDarkBlue" />
          </span>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<EditProfileData>({
    user: {
      first_name: "",
      last_name: "",
      email: "",
    },
    gender: "",
    service_country: 0,
    birthday: "",
    city: 0,
    user_type: 0,
    address: "",
  });

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
          service_country: data.service_country || 0,
          birthday: data.birthday || "",
          city: data.city || 0,
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
    try {
      const token = localStorage.getItem('access');
      
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      // Ensure profileData has the correct structure and all fields are populated
      await editUserProfile(profileData, token);
      console.log("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div className="flex justify-start gap-10 flex-row-reverse mx-auto">
          <div className="flex lg:w-[20%] w-[40%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <UploadImage image={image} onImageChange={handleImageChange} />
            </div>
            <div>
              <div className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer">
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>الإعدادت</p>
              </div>
              <div className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer">
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>مواعيدي</p>
              </div>
              <div onClick={handleLogout} className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer">
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>تسجيل الخروج</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-end flex-col w-[80%] mx-auto">
            <div className="flex justify-between gap-4">
              <div className="w-1/2">
                <Label className="text-start">الإسم الأول</Label>
                <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-white border px-4 mt-2 border-none">
                  <UserRound className="text-roshitaBlue" />
                  <Input
                    value={profileData.user.first_name || '-'}
                    onChange={(e) =>
                      setProfileData(prevState => ({
                        ...prevState,
                        user: { ...prevState.user, first_name: e.target.value }
                      }))
                    }
                    placeholder="الإسم الأول"
                    className="border-transparent shadow-none focus-visible:transparent h-[50px]"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <Label className="text-start">الإسم الأخير</Label>
                <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-white border px-4 mt-2 border-none">
                  <UserRound className="text-roshitaBlue" />
                  <Input
                    value={profileData.user.last_name || '-'}
                    onChange={(e) =>
                      setProfileData(prevState => ({
                        ...prevState,
                        user: { ...prevState.user, last_name: e.target.value }
                      }))
                    }
                    placeholder="الإسم الأخير"
                    className="border-transparent shadow-none h-[50px]"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-start">البريد الإلكتروني</Label>
              <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-white border px-4 mt-2 border-none text-start">
                <Mail className="text-roshitaBlue" />
                <Input
                  value={profileData.user.email || '-'}
                  onChange={(e) =>
                    setProfileData(prevState => ({
                      ...prevState,
                      user: { ...prevState.user, email: e.target.value }
                    }))
                  }
                  placeholder="البريد الإلكتروني"
                  className="border-transparent shadow-none h-[50px] justify-start"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-start">الجنس</Label>
              <RadioGroup

                value={profileData.gender}
                onValueChange={(value) =>
                  setProfileData(prevState => ({
                    ...prevState,
                    gender: value
                  }))
                }
              >
                <div className="flex gap-4 justify-end mt-4">
                  <RadioGroupItem value="male" id="male" className="h-4 w-4" />
                  <Label htmlFor="male" className="text-start">ذكر</Label>
                  <RadioGroupItem value="female" id="female" className="h-4 w-4" />
                  <Label htmlFor="female" className="text-start">أنثى</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-start">تاريخ الميلاد</Label>
              <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-white border px-4 mt-2 border-none">
                <Input
                  type="date"
                  value={profileData.birthday || ''}
                  onChange={(e) =>
                    setProfileData(prevState => ({
                      ...prevState,
                      birthday: e.target.value
                    }))
                  }
                  className="border-transparent shadow-none h-[50px] justify-end"
                />
              </div>
            </div>
            {/*<div>
              <Label className="text-start">العنوان</Label>
              <div className="flex gap-2 flex-row-reverse items-center rounded-lg bg-white border px-4 mt-2 border-none">
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
              <Button onClick={handleSave} className="w-full mt-4 bg-roshitaDarkBlue">حفظ</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
