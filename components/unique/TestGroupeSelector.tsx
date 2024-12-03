import React, { useState } from "react";

const TestGroupSelector = ({
  groups,
  tests,
  setSelectedGroup,
}: {
  groups: { معرف_المجموعة: string; اسم_المجموعة: string; الفحوصات_المشمولة: string[] }[];
  tests: { معرف_الفحص: string; اسم_الفحص: string }[];
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedGroup, internalSetSelectedGroup] = useState("");

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupName = e.target.value;
    internalSetSelectedGroup(groupName);
    setSelectedGroup(groupName); // Passing to parent
  };

  return (
    <div dir="rtl">
      <select
        value={selectedGroup}
        onChange={handleGroupChange}
        className="bg-[#F6F6F6] !h-[80px] p-4 rounded-[23px] w-full text-right px-10"
      >
        <option value=""> باقة</option>
        {groups.map((group, index) => (
          <option key={index} value={group.اسم_المجموعة}>
            {group.اسم_المجموعة}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TestGroupSelector;
