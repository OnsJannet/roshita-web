import { Tests } from "@/constant";
import { CircleDollarSign, CirclePlus } from "lucide-react";
import { useState } from "react";

interface InputFormProps {
  type: "single" | "group";
  onAdd: (name: string, price: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ type, onAdd }) => {
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState(""); // For group name
  const [price, setPrice] = useState("");

  const handleAdd = () => {
    if (name && price) {
      onAdd(name, price);
      setName("");
      setPrice("");
      if (type === "group") {
        setGroupName("");
      }
    }
  };

  return (
    <div className="flex lg:flex-row-reverse flex-col items-center gap-4 p-4 rounded">
      <div className="relative w-full">
        {/* Input for group name */}
        <input
          type="text"
          placeholder="اسم الباقة"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full pr-10 p-2 border rounded-[26px] focus:outline-[#00B3E9] h-[60px] text-end placeholder:text-end"
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
          <CirclePlus className="w-5 h-5 text-[#00B3E9]" />
        </span>
      </div>

      {type === "group" && (
        <div className="relative w-full">
          {/* Dropdown for test names */}
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pr-10 p-2 border rounded-[26px] focus:outline-[#00B3E9] h-[60px] text-end placeholder:text-end appearance-none"
            style={{
              background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>') no-repeat right 1rem center`,
              backgroundSize: "1rem",
            }}
          >
            <option value="" disabled>
              اختر اسم التحليل
            </option>
            {Tests.lab_tests.map((test) => (
              <option key={test.معرف_الفحص} value={test.اسم_الفحص}>
                {test.اسم_الفحص}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="relative w-full">
        {/* Input for price */}
        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full pr-10 p-2 border rounded-[26px] focus:outline-[#00B3E9] h-[60px] text-end placeholder:text-end"
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
          <CircleDollarSign className="w-5 h-5 text-[#00B3E9]" />
        </span>
      </div>

      <button
        onClick={handleAdd}
        className="px-4 py-4 text-white bg-[#00B3E9] rounded-[26px] hover:bg-blue-500 w-full"
      >
        إضافة
      </button>
    </div>
  );
};

export default InputForm;
