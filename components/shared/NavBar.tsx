"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { AlignLeft, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../layout/LanguageSwitcher";

type Language = "ar" | "en";

const fetchProfileDetails = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(
      "https://test-roshita.net/api/account/profile/detail",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
  const [language, setLanguage] = useState<Language>("ar");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const router = useRouter();

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

  useEffect(() => {
    const checkLoginStatus = async () => {
      const logged = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(logged);

      if (logged) {
        try {
          const profileData = await fetchProfileDetails();
          setProfile(profileData);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }

      setLoading(false); // Once loading is complete, set loading to false
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
  };

  const handleClickSettings = () => {
    router.push("/profile");
  };

  const handleClickAppointments = () => {
    router.push("/appointments");
  };

  return (
    <header
      className="h-[80px] lg:px-0 px-4 pb-4 pt-2 rounded-b-lg"
      style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)" }}
    >
      <div
        className={`flex justify-between max-w-[1280px] mx-auto ${
          language === "ar" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex gap-2 items-center mt-4 ${
            language === "en" ? "flex-row-reverse" : ""
          }`}
        >
          {loading ? (
            <div className="w-20 h-10 bg-gray-100 rounded animate-pulse"></div>
          ) : (
            <div>
              <h2
                className={`${
                  language === "ar" ? "text-right" : "text-left"
                } font-bold lg:text-[16px] text-[12px]`}
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
          )}
          <img
            src="/logos/ShortLogo.png"
            alt="roshita logo"
            className="lg:w-[40px] w-[30px] lg:h-[40px] h-[30px] cursor-pointer"
            onClick={handleClickHome}
          />
        </div>

        <div className="gap-4 lg:flex pt-2 hidden">
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-[140px] h-10 bg-gray-100 rounded animate-pulse"></div>{" "}
              {/* Gray square on the right */}
            </div>
          ) : (
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          )}

          {!isLoggedIn ? (
            <>
              {/* Loading Buttons */}
              {loading ? (
                <div className="flex gap-4">
                  <div className="w-[140px] h-10 bg-gray-100 rounded animate-pulse"></div>{" "}
                  {/* Loading login button */}
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleClickLogin}
                    variant="login"
                    className="h-[52px] w-[140px] rounded-2xl text-[18px] font-semibold"
                  >
                    {language === "ar" ? "تسجيل الدخول" : "Login"}
                  </Button>
                  <Button
                    onClick={handleClickRegister}
                    variant="register"
                    className="h-[52px] w-[140px] rounded-2xl text-[18px] font-semibold"
                  >
                    {language === "ar" ? "تسجيل" : "Register"}
                  </Button>
                </>
              )}
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <UserRound />
                  </Button>
                  <p>{language === "ar" ? "حسابي" : "My Account"}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {language === "ar" ? "حسابي" : "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClickSettings}>
                  {language === "ar" ? "الإعدادات" : "Settings"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClickAppointments}>
                  {language === "ar" ? "مواعيدي" : "My Appointments"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    localStorage.removeItem("isLoggedIn");
                    setIsLoggedIn(false);
                    window.location.href = "/login";
                  }}
                >
                  {language === "ar" ? "تسجيل الخروج" : "Logout"}
                </DropdownMenuItem>
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
