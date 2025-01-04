import { Pen } from "lucide-react";
import Link from "next/link";

interface EditButtonProps {
  href: string; // The link to the edit page
  language: Language; // The current language
}

type Language = "ar" | "en";

const EditButton: React.FC<EditButtonProps> = ({ href, language }) => {
  const buttonText = language === "ar" ? "تعديل الملف" : "Edit Profile";

  return (
    <Link
      href={href}
      className="w-[154px] flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
    >
      <span className="mr-2">{buttonText}</span>
      <Pen className="h-4 w-4"/>
    </Link>
  );
};

export default EditButton;
