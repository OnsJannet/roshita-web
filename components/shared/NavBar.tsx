import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { AlignLeft, UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu"; // Adjust the import path according to your project structure
import Image from 'next/image'; // Assuming you use Next.js for image optimization
import { useRouter } from "next/navigation";

const fetchProfileDetails = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await fetch("https://test-roshita.net/api/account/profile/detail", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching profile details: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching profile details:", error);
    throw error;
  }
};

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const logged = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(logged);

      if (logged) {
        try {
          const profileData = await fetchProfileDetails();
          setProfile(profileData);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    checkLoginStatus();
  }, []);


  const handleClickLogin = () => {
    window.location.href = "/login";
  };

  const handleClickRegister = () => {
    window.location.href = "/register";
  };

  const handleClickHome = () => {
    window.location.href = "/";
  }

  const handleClickSettings = () => {

    router.push('/profile');
  };

  const handleClickAppointments = () => {
    router.push('/appointments');
  };

  return (
    <header
      className="h-[80px] lg:px-0 px-4 pb-4 pt-2 rounded-b-lg"
      style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)" }}
    >
      <div className="flex justify-between max-w-[1280px] mx-auto flex-row-reverse">
        <div className="flex gap-2">
          <div className="mt-4">
            <h2 className="text-end font-bold lg:text-[16px] text-[12px]">
              روشــــــــيتــــــا
            </h2>
            <p className="font-[500] lg:text-[16px] text-[12px]">
              صحــة أفضل{" "}
              <span className="text-roshitaGreen">تواصـــــل أســـرع</span>{" "}
            </p>
          </div>
          <img
            src="/logos/Logo_normal.png"
            alt="roshita logo"
            className="lg:w-[50px] w-[45px] h-auto"
            onClick={handleClickHome}
          />
        </div>
        <div className="gap-4 lg:flex pt-2 hidden">
          {!isLoggedIn ? (
            <>
              <Button
                onClick={handleClickRegister}
                variant="login"
                className="h-[52px] w-[140px] rounded-2xl text-[18px] font-semibold"
              >
                تسجيل الدخول
              </Button>
              <Button
                onClick={handleClickLogin}
                variant="register"
                className="h-[52px] w-[140px] rounded-2xl text-[18px] font-semibold"
              >
                تسجيل
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center flex-row-reverse">
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                    <UserRound /> 
                </Button>
                <p>حسابي</p>
                </div>

              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClickSettings}>الإعدادات</DropdownMenuItem>
                <DropdownMenuItem onClick={handleClickAppointments}>مواعيدي</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  localStorage.removeItem('access');
                  localStorage.removeItem('refresh');
                  localStorage.removeItem('isLoggedIn');
                  setIsLoggedIn(false);
                  window.location.href = '/login'; // Redirect to login page after logout
                }}>تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
          )}
        </div>
        <AlignLeft className="lg:hidden flex items-center my-auto text-black h-8 w-auto cursor-pointer" />
      </div>
    </header>
  );
};

export default NavBar;
