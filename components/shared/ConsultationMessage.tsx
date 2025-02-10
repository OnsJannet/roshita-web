import React from "react";

interface ConsultationMessageProps {
  message: string;
}

const ConsultationMessage: React.FC<ConsultationMessageProps> = ({ message }) => {
  // Split the message by newlines and map each part to a <p> element
  const messageWithLineBreaks = message.split('\n').map((line, index) => (
    <p key={index} className="text-gray-700 leading-relaxed mb-6">{line}</p>
  ));

  return (
    <div className="bg-gray-50 p-6 rounded-lg text-right">
      {messageWithLineBreaks}
    </div>
  );
};

export default ConsultationMessage;
