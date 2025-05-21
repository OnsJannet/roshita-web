"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { AlignLeft, UserRound, X } from "lucide-react"; // Added X icon
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
      "https://test-roshita.net/api/account/profile/detail/",
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
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  const toggleLoginDropdown = () => setShowLoginDropdown((prev) => !prev);
  const toggleRegisterDropdown = () => setShowRegisterDropdown((prev) => !prev);

  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);
  const closeMobileMenu = () => setShowMobileMenu(false); // Function to close mobile menu

  // Modified click handlers to close mobile menu
  const handleClickLogin = () => {
    closeMobileMenu();
    window.location.href = "/login";
  };

  const handleClickRegister = () => {
    closeMobileMenu();
    window.location.href = "/register";
  };

  const handleClickRegisterProfessionally = () => {
    closeMobileMenu();
    window.location.href = "/dashboard/Auth/register";
  };

  const handleClickLoginProfessionally = () => {
    closeMobileMenu();
    window.location.href = "/dashboard/Auth/login";
  };

  const handleClickHome = () => {
    closeMobileMenu();
    window.location.href = "/";
  };

  const handleClickSettings = () => {
    closeMobileMenu();
    router.push("/profile");
  };

  const handleClickAppointments = () => {
    closeMobileMenu();
    router.push("/appointments");
  };

  const handleClickConsultations = () => {
    closeMobileMenu();
    router.push("/consultations");
  };

  const handleLogout = () => {
    closeMobileMenu();
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.location.href = "/login";
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

      setLoading(false);
    };

    checkLoginStatus();
  }, []);

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
                onClick={handleClickHome}
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
          )}
          <img
            src="/logos/ShortLogo.png"
            alt="roshita logo"
            className="lg:w-[40px] w-[30px] lg:h-[40px] h-[30px] cursor-pointer"
            onClick={handleClickHome}
          />
        </div>

        {/* Desktop Menu */}
        <div className="gap-4 lg:flex pt-2 hidden">
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-[140px] h-10 bg-gray-100 rounded animate-pulse"></div>{" "}
            </div>
          ) : (
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          )}

          {!isLoggedIn ? (
            <>
              {loading ? (
                <div className="flex gap-4">
                  <div className="w-[140px] h-10 bg-gray-100 rounded animate-pulse"></div>{" "}
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Button
                      onClick={toggleLoginDropdown}
                      variant="login"
                      className="h-[52px] w-[140px] rounded-2xl text-[18px] font-semibold"
                    >
                      {language === "ar" ? "تسجيل الدخول" : "Login"}
                    </Button>
                    {showLoginDropdown && (
                      <div className="absolute right-0 mt-2 w-[200px] bg-white shadow-lg rounded-md border border-gray-200 z-[9999]">
                        <Button
                          onClick={handleClickLogin}
                          variant="dropdown"
                          className={`block w-full px-4 py-2 hover:bg-gray-100 ${
                            language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                          {language === "ar" ? "تسجيل الدخول" : "Login"}
                        </Button>
                        <Button
                          onClick={handleClickLoginProfessionally}
                          variant="dropdown"
                          className={`block w-full px-4 py-2 hover:bg-gray-100 ${
                            language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                          {language === "ar"
                            ? "تسجيل الدخول كمهني"
                            : "Login as professional"}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Button
                      onClick={toggleRegisterDropdown}
                      variant="register"
                      className="h-[52px] w-[140px] rounded-2xl text-[18px] font-semibold"
                    >
                      {language === "ar" ? "تسجيل" : "Register"}
                    </Button>
                    {showRegisterDropdown && (
                      <div className="absolute right-0 mt-2 w-[200px] bg-white shadow-lg rounded-md border border-gray-200 z-[9999]">
                        <Button
                          onClick={handleClickRegister}
                          variant="dropdown"
                          className={`block w-full px-4 py-2 hover:bg-gray-100 ${
                            language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                          {language === "ar" ? "تسجيل" : "Register"}
                        </Button>
                        <Button
                          onClick={handleClickRegisterProfessionally}
                          variant="dropdown"
                          className={`block w-full px-4 py-2 hover:bg-gray-100 ${
                            language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                          {language === "ar"
                            ? "تسجيل كمهني"
                            : "Register as professional"}
                        </Button>
                      </div>
                    )}
                  </div>
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
                <DropdownMenuItem onClick={handleClickConsultations}>
                  {language === "ar" ? "استشارتي" : "My consultation"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {language === "ar" ? "تسجيل الخروج" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <AlignLeft
          className="lg:hidden flex items-center my-auto text-black h-8 w-auto cursor-pointer"
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu Content */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-[99999]">
            <div className={`flex flex-col items-center justify-start bg-white h-full pt-4 ${language === "ar" ? "text-right" : "text-left"}`}>
              {/* Close Button (X) */}
              <div className={`w-full flex ${language === "ar" ? "justify-start pl-4" : "justify-end pr-4"}`}>
                <X 
                  className="h-8 w-8 text-gray-700 cursor-pointer"
                  onClick={closeMobileMenu}
                />
              </div>
              
              <img
                src="/logos/ShortLogo.png"
                alt="roshita logo"
                className="lg:w-[40px] w-[30px] lg:h-[40px] h-[30px] cursor-pointer mb-10"
                onClick={handleClickHome}
              />
              <Button
                onClick={handleClickHome}
                variant="link"
                className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
              >
                {language === "ar" ? "الرئيسية" : "Home"}
              </Button>
              {!isLoggedIn ? (
                <>
                  <Button
                    onClick={handleClickLogin}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar" ? "تسجيل الدخول" : "Login"}
                  </Button>
                  <Button
                    onClick={handleClickLoginProfessionally}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar"
                      ? "تسجيل الدخول كمهني"
                      : "Login as professional"}
                  </Button>
                  <Button
                    onClick={handleClickRegister}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar" ? "تسجيل" : "Register"}
                  </Button>
                  <Button
                    onClick={handleClickRegisterProfessionally}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar"
                      ? "تسجيل كمهني"
                      : "Register as professional"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleClickSettings}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar" ? "الإعدادات" : "Settings"}
                  </Button>
                  <Button
                    onClick={handleClickAppointments}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar" ? "مواعيدي" : "My Appointments"}
                  </Button>
                  <Button
                    onClick={handleClickConsultations}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar" ? "استشارتي" : "My consultation"}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="link"
                    className="mb-4 text-xl hover:bg-gray-100 w-full text-center hover:no-underline"
                  >
                    {language === "ar" ? "تسجيل الخروج" : "Logout"}
                  </Button>
                </>
              )}
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;