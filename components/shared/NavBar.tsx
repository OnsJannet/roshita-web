import React from "react";
import { Button } from "../ui/button";
import { AlignLeft } from "lucide-react";

const NavBar = () => {
  const handleClickLogin = () => {
    window.location.href = "/login";
  };

  const handleClickRegister = () => {
    window.location.href = "/register";
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
          />
        </div>
        <div className="gap-4 lg:flex pt-2 hidden">
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
        </div>
        <AlignLeft className="lg:hidden flex items-center my-auto text-black h-8 w-auto cursor-pointer" />
      </div>
    </header>
  );
};

export default NavBar;
