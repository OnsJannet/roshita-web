import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const Filters = () => {
  return (
    <div
      className=" lg:-mt-[80px] xl:-mt-[40px] mt-[180px] rounded-2xl p-6 max-w-[1280px] mx-auto !bg-white relative"
      style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)", zIndex: 9999 }}
    >
      <p className="text-end mb-4 font-medium">حجـــز موعد طبي ، تقديم استشارات</p>
      <div className="flex justify-between  gap-4 ">
        <Button variant="register" className="rounded-xl h-[52px] w-[440px] gap-1 font-bold">
          بحث
          <Search className="h-4 w-4"/>
        </Button>
        <Input type="text" placeholder="البلد" className="h-14" />
        <Input type="text" placeholder="التخصص" className="h-14" />
        <Input type="text" placeholder="دكتور" className="h-14" />
      </div>
    </div>
  );
};

export default Filters;
