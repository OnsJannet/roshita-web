import { Search } from "lucide-react";
import React, { useState } from "react";

const FilterTests = ({
  tests,
  setSearch,
}: {
  tests: { اسم_الفحص: string }[];
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-row-reverse justify-start gap-2 items-center bg-[#F6F6F6] p-4 rounded-[23px]">
      <Search className="text-[#00B3E9] " />
      <input
        type="text"
        className="h-[50px] bg-transparent border-0 border-[#D1D1D1] focus:border-transparent placeholder:text-end focus:outline-none placeholder:text-[#D1D1D1] placeholder:focus:text-transparent rounded-[23px] "
        placeholder="البحث عن تحليل"
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default FilterTests;
