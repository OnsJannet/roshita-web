"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  AlignLeft,
  ArrowBigLeft,
  ArrowLeft,
  ArrowRight,
  Building2,
  Stethoscope,
  User,
  UserRound,
  X,
} from "lucide-react";
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

const CountdownTimer = ({ language }: { language: Language }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [countdownEnded, setCountdownEnded] = useState(false);

  const calculateTimeLeft = () => {
    const now = new Date();
    // Libya is UTC+2, but we need to account for the current timezone offset
    const libyaOffset = 2 * 60 * 60 * 1000; // Libya is UTC+2
    const targetDate = new Date('2025-08-01T00:00:00+02:00'); // July 31, 2025, 00:00 Libya time

    const difference = targetDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      setCountdownEnded(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (countdownEnded) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
      <div className="text-center bg-roshitaGreen/10 px-3 py-1 rounded-md">
        <span className="font-bold text-roshitaGreen">{timeLeft.days}</span>
        <span className="text-xs"> {language === "ar" ? "يوم" : "Days"}</span>
      </div>
      <div className="text-center bg-roshitaGreen/10 px-3 py-1 rounded-md">
        <span className="font-bold text-roshitaGreen">{timeLeft.hours}</span>
        <span className="text-xs"> {language === "ar" ? "ساعة" : "Hrs"}</span>
      </div>
      <div className="text-center bg-roshitaGreen/10 px-3 py-1 rounded-md">
        <span className="font-bold text-roshitaGreen">{timeLeft.minutes}</span>
        <span className="text-xs"> {language === "ar" ? "دقيقة" : "Min"}</span>
      </div>
      <div className="text-center bg-roshitaGreen/10 px-3 py-1 rounded-md">
        <span className="font-bold text-roshitaGreen">{timeLeft.seconds}</span>
        <span className="text-xs"> {language === "ar" ? "ثانية" : "Sec"}</span>
      </div>
    </div>
  );
};

const NavBar = () => {
  const [language, setLanguage] = useState<Language>("ar");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  const toggleLoginDropdown = () => setShowLoginDropdown((prev) => !prev);
  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);
  const closeMobileMenu = () => setShowMobileMenu(false);

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

        {/* Countdown Timer - Desktop */}
        <div className="hidden lg:flex items-center">
          <CountdownTimer language={language} />
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
                      className="h-[52px] w-[140px] rounded-md text-[18px] font-semibold"
                    >
                      {language === "ar" ? "تسجيل الدخول" : "Login"}
                    </Button>
                    {showLoginDropdown && (
                      <div
                        className={`absolute ${
                          language === "ar" ? "right-0" : "left-0"
                        } mt-2 w-[240px] bg-white shadow-lg rounded-md border border-gray-200 z-[9999]`}
                      >
                        <Button
                          onClick={handleClickLogin}
                          variant="dropdown"
                          className={`w-full px-6 py-6 hover:bg-gray-100 border-b border-gray-200 items-center flex ${
                            language === "en"
                              ? "flex-row-reverse justify-end gap-4"
                              :  "justify-end gap-4"
                          }`}
                        >
                          {language === "ar" ? "تسجيل الدخول" : "Login"}
                          <User className="h-4 w-4 text-[#1588C8]" />
                        </Button>
                        <Button
                          onClick={handleClickLoginProfessionally}
                          variant="dropdown"
                          className={`w-full px-6 py-6 hover:bg-gray-100 border-b border-gray-200 items-center flex ${
                            language === "en"
                              ? "flex-row-reverse justify-end gap-4"
                              : "justify-end gap-4"
                          }`}
                        >
                          {language === "ar"
                            ? "تسجيل دخول الطبيب"
                            : "Doctor Login"}
                          <Stethoscope className="h-4 w-4 text-[#1588C8]" />
                        </Button>
                        <Button
                          onClick={handleClickLoginProfessionally}
                          variant="dropdown"
                          className={`w-full px-6 py-6 hover:bg-gray-100 border-b border-gray-200 items-center flex ${
                            language === "en"
                              ? "flex-row-reverse justify-end gap-4"
                              :  "justify-end gap-4"
                          }`}
                        >
                          {language === "ar"
                            ? "تسجيل دخول المستشفى"
                            : "Hospital Login"}
                          <Building2 className="h-4 w-4 text-[#1588C8]" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Button
                      onClick={handleClickRegister}
                      variant="register"
                      className="h-[52px] w-[140px] rounded-md text-[18px] font-semibold gap-2 items-center"
                    >
                      {language === "ar" ? (
                        <>
                                                  <ArrowLeft className="h-4 w-4" />
                          <span>إنضم إلينا</span>

                        </>
                      ) : (
                        <>

                          <span>Register</span>
                                                    <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
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
        <div className="lg:hidden flex items-center gap-2">
          {/* Countdown Timer - Mobile */}
          <div className="lg:hidden">
            <CountdownTimer language={language} />
          </div>
          
          <AlignLeft
            className="text-black h-8 w-auto cursor-pointer"
            onClick={toggleMobileMenu}
          />
        </div>

        {/* Mobile Menu Content */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-[99999]">
            <div
              className={`flex flex-col items-center justify-start bg-white h-full pt-4 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {/* Close Button (X) */}
              <div
                className={`w-full flex ${
                  language === "ar" ? "justify-start pl-4" : "justify-end pr-4"
                }`}
              >
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