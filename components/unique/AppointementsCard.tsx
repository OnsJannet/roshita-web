import React, { useState, useEffect } from "react";
import { Banknote, Calendar, Clock, Star, Trash } from "lucide-react";
import { Button } from "../ui/button";

type DoctorCardProps = {
  name: string;
  specialty: string;
  price: string;
  location: string;
  imageUrl: string;
  day: string;
  time: string;
  status: string;
  doctorID: string;
  appointementId: string;
  appointementStatus: string;
  onError?: (errorMessage: string) => void;
};

type Language = "ar" | "en";

const AppointementsCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  price,
  location,
  imageUrl,
  day,
  time,
  doctorID,
  appointementId,
  appointementStatus,
  status: initialStatus,
  onError,
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [language, setLanguage] = useState<Language>("ar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("error");
  const [comment, setComment] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage("ar");
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCancelClick = () => {
    // Sanitize the `day` string to remove any unwanted Unicode characters
    const sanitizedDay = day.replace(/[^\x00-\x7F]/g, "");

    // Sanitize the `time` string to convert it into a 24-hour format
    const sanitizedTime = time
      .replace(/ص/g, "AM") // Replace Arabic "ص" with "AM"
      .replace(/م/g, "PM"); // Replace Arabic "م" with "PM"

    // Log the sanitized day and time for debugging
    console.log("sanitizedDay", sanitizedDay);
    console.log("sanitizedTime", sanitizedTime);

    // Create the appointment date using the sanitized day and time
    const appointmentDate = new Date(`${sanitizedDay} ${sanitizedTime}`);
    const currentDate = new Date();
    const timeDifference = appointmentDate.getTime() - currentDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // Log all values for debugging
    console.log("day", day);
    console.log("time", time);
    console.log("hoursDifference", hoursDifference);
    console.log("appointmentDate", appointmentDate);
    console.log("currentDate", currentDate);
    console.log("timeDifference", timeDifference);

    // Set the modal message based on the time difference
    if (isNaN(hoursDifference)) {
      // Handle invalid date parsing
      setModalMessage(
        language === "ar"
          ? "حدث خطأ في تحويل التاريخ أو الوقت. يرجى المحاولة مرة أخرى."
          : "An error occurred while parsing the date or time. Please try again."
      );
    } else if (hoursDifference <= 24) {
      setModalMessage(
        language === "ar"
          ? "هل أنت متأكد أنك تريد الإلغاء؟"
          : "Are you sure you want to cancel?"
      );
    } else if (hoursDifference <= 48) {
      setModalMessage(
        language === "ar"
          ? "إذا قمت بالإلغاء بعد 48 ساعة، ستحصل على 50٪ فقط من المبلغ المسترد."
          : "If you cancel after 48 hours, you will only get a 50% refund."
      );
    } else {
      setModalMessage(
        language === "ar"
          ? "لن تحصل على أي استرداد لأنك تجاوزت 48 ساعة."
          : "You won't get any refund because you passed 48 hours."
      );
    }

    // Open the cancel modal
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const url = `https://test-roshita.net/api/user-appointment-reservations/${appointementId}/`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (response.ok) {
        setStatus("canceled");
        setIsCancelModalOpen(false);
      } else {
        const errorMsg =
          language === "ar"
            ? "حدث خطأ ما. حاول مرة أخرى."
            : "Something went wrong. Please try again.";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        language === "ar"
          ? "حدث خطأ ما. حاول مرة أخرى."
          : "Something went wrong. Please try again.";
      console.error("Error during cancellation:", err);
      onError?.(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleRate = async () => {
    try {
      const payload = { rating };
      const token = localStorage.getItem("access");
      const doctorId = doctorID;
      const url = `https://test-roshita.net/api/doctor/${doctorId}/update-rating/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
        console.log("Rating submitted successfully:", data);
      } else {
        console.error("Failed to submit rating:", data);
        alert(
          language === "ar"
            ? "حدث خطأ ما. حاول مرة أخرى."
            : "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error while submitting rating:", error);
      alert(
        language === "ar"
          ? "حدث خطأ ما. حاول مرة أخرى."
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className={`flex ${
        language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
      } flex-col p-4 bg-white  rounded-xl w-full max-w-[80%] lg:max-w-[80%] mx-auto`}
    >
      <div
        className={`flex flex-1 ${
          language === "ar"
            ? "justify-between lg:flex-row"
            : "justify-between lg:flex-row-reverse"
        } gap-4 items-center p-4 flex-col-reverse`}
      >
        <div
          className={`flex flex-col ${
            language === "ar" ? "items-end" : "items-start"
          }`}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{name}</h1>
          <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
          <div className="bg-gray-50 lg:p-4 p-2 flex lg:flex-row flex-col w-full justify-between lg:gap-20 gap-4 rounded">
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              } gap-2`}
            >
              <Clock className="text-roshitaDarkBlue" />
              <span>
                {language === "ar" ? `الوقت: ${time}` : `Time: ${time}`}
              </span>
            </div>
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              } gap-2`}
            >
              <Calendar className="text-roshitaDarkBlue" />
              <span>{language === "ar" ? `اليوم: ${day}` : `Day: ${day}`}</span>
            </div>
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row" : "flex-row-reverse"
              } gap-2`}
            >
              <span>
                {language === "ar" ? `سعر الكشف: ${price}` : `Price: ${price}`}
              </span>
              <Banknote className="text-roshitaDarkBlue" />
            </div>
          </div>

          <div className="flex justify-between items-center w-full">
            <div
              className={`w-full flex ${
                language === "ar"
                  ? "lg:justify-start justify-between"
                  : "lg:justify-end justify-between"
              } mt-4`}
            >
              {status === "canceled" ? (
                <span className="text-red-500 text-lg">
                  {language === "ar" ? "تم الإلغاء" : "Canceled"}
                </span>
              ) : (
                <Button
                  className="bg-transparent border-transparent text-black text-lg shadow-none hover:bg-gray-50"
                  onClick={handleCancelClick}
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}{" "}
                  <Trash className="text-red-500 w-6 h-6 ml-2" />
                </Button>
              )}
            </div>
            <div
              className={`w-full flex ${
                language === "ar"
                  ? "lg:justify-start justify-start"
                  : "lg:justify-end justify-end w-full"
              } mt-4`}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-transparent border-transparent text-black text-lg shadow-none hover:bg-gray-50 flex"
              >
                {language === "ar" ? "قيّم" : "Rate"}
                <Star className="text-yellow-500 w-6 h-6 ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="ml-4 h-40 w-40 rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
          <img
            src={
              imageUrl &&
              imageUrl !== null &&
              !imageUrl.startsWith("/media/media/")
                ? imageUrl
                : "/Images/default-doctor.jpeg"
            }
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 text-center">
              {language === "ar" ? "قيّم الطبيب" : "Rate the Doctor"}
            </h2>
            <div className="flex gap-2 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  <Star />
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleRate}
              >
                {language === "ar" ? "إرسال" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <p className="mb-4">{modalMessage}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                {language === "ar" ? "تأكيد" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointementsCard;
