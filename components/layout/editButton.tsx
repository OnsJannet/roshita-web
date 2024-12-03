import { Pen } from "lucide-react";
import Link from "next/link";

interface EditButtonProps {
  href: string; // The link to the edit page
}

const EditButton: React.FC<EditButtonProps> = ({ href }) => {
  return (
    <Link
      href={href}
      className="w-[154px] flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
    >
      <span className="mr-2">تعديل الملف</span>
      <Pen className="h-4 w-4"/>
    </Link>
  );
};

export default EditButton;
