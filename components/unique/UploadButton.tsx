"use client";

import React, { useState } from "react";
import { X, Camera } from "lucide-react";

interface UploadButtonProps {
  onUpload?: (file: File) => void;
  picture: string; // Corrected prop name (it was 'Picture', but should be lowercase 'picture' to match the convention)
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload, picture }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreview(URL.createObjectURL(file)); // Set image preview
      onUpload?.(file); // Trigger the upload handler

      // Reset the input value to allow for re-uploading the same file
      if (inputRef.current) {
        inputRef.current.value = ""; // Reset input value to trigger file change again
      }
    }
  };

  // Handle delete
  const handleDelete = () => {
    setPreview(null); // Clear preview
  };

  return (
    <div className="relative w-24 h-24">
      {/* Input and Circle */}
      <label
        className={`group relative w-full h-full flex items-center justify-center rounded-full border border-gray-300 
          bg-gray-100 cursor-pointer transition duration-150 overflow-hidden ${preview ? "" : "bg-gray-100"}`}
      >
        {/* Show Image Preview */}
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

        {/* Bottom Half-Circle Overlay with Camera Icon */}
        {!preview && !picture && (
          <div className="absolute bottom-0 w-full h-[40%] bg-black/50 rounded-b-full flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Camera className="text-white h-6 w-6 object-cover" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </label>

      {/* Delete Button */}
      {preview && (
        <button
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 h-6 w-6 text-sm shadow-lg hover:bg-red-600 transition duration-150"
          onClick={handleDelete}
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Delete Button (when no preview) */}
      {!preview && !picture && (
        <button
          className="absolute top-0 right-0 bg-white text-gray-500 border border-gray-300 rounded-full p-1 h-6 w-6 text-sm shadow-lg hover:bg-white transition duration-150"
          onClick={handleDelete}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default UploadButton;
