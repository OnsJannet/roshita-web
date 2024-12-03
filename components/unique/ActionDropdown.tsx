import React, { useState } from "react";

const ActionDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddTest = () => {
    window.location.href= "/dashboard/labs/add-test"
  };

  const handleAddGroup = () => {
    window.location.href= "/dashboard/labs/add-group"
  };

  return (
    <div className="relative">
      <button
        className="bg-[#00B3E9] !h-[80px] p-4 rounded-[23px] text-right text-white" // Make button text align right for RTL
        onClick={() => setShowDropdown(!showDropdown)}
      >
        إضافة تحليل
      </button>
      {showDropdown && (
        <div className="bg-[#F6F6F6] rounded-[23px] p-4 absolute top-[100%] right-10 mt-[-20px] w-[200px] ">
          <div 
            onClick={handleAddTest}
            className="py-2  cursor-pointer hover:bg-gray-200 hover:text-black  rounded-md text-end"
          >
            إضافة تحليل جديد
          </div>
          <div 
            onClick={handleAddGroup}
            className="py-2  cursor-pointer hover:bg-gray-200 hover:text-black rounded-md text-end"
          >
            إضافة باقة
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
