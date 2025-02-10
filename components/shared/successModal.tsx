import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;  // Change from string to boolean
  onClose: () => void;  // Change from string | boolean to a function
  message: string;
}

const SuccessModal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="text-[#1588c8] w-12 h-12" />
          <p className="text-lg font-semibold text-gray-700">{message}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-[#1588c8] text-white rounded hover:bg-[#1272a3] transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
