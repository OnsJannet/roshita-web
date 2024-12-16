import React, { useState } from "react";
import { X, Camera } from "lucide-react";

interface UploadButtonProps {
  onUpload?: (filePath: string) => void; // Updated to send file path
  picture: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload, picture }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreview(URL.createObjectURL(file)); // Preview image

      // Upload to backend
      const formData = new FormData();
      formData.append("image", file);

      try {
        setUploading(true);
        const response = await fetch("/api/upload/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          onUpload?.(data.path); // Pass the file path to parent
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }

      if (inputRef.current) {
        inputRef.current.value = ""; // Reset input
      }
    }
  };

  const handleDelete = () => {
    setPreview(null);
  };

  return (
    <div className="relative w-24 h-24">
      <label className="group relative w-full h-full flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 cursor-pointer transition duration-150 overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : picture ? (
          <img
            src={picture}
            alt="default picture"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Camera className="text-gray-400 h-6 w-6" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {preview && (
        <button
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 h-6 w-6 text-sm shadow-lg hover:bg-red-600 transition duration-150"
          onClick={handleDelete}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default UploadButton;