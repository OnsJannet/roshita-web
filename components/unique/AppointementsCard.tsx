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

  console.log("status222", status);

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

  console.log("reservationDate", day);

  const handleCancelClick = () => {
    // Sanitize the `day` string to remove any unwanted Unicode characters
    const sanitizedDay = day.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters
  
    // Split the sanitized day into parts
    const [dayPart, monthPart, yearPart] = sanitizedDay.split("/");
  
    // Create a valid date string in the format YYYY-MM-DD
    const formattedDate = `${yearPart}-${monthPart.padStart(2, "0")}-${dayPart.padStart(2, "0")}`;
  
    // Create a Date object for the reservation date (ignoring the time)
    const reservationDateObj = new Date(formattedDate);
  
    // Get the current date (ignoring the time)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ignore the time part
  
    // Calculate the difference in milliseconds
    const timeDifference = reservationDateObj.getTime() - currentDate.getTime();
  
    // Convert the difference to days instead of hours
    let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  
    // Round down daysDifference to the nearest whole number
    daysDifference = Math.floor(daysDifference);
  
    // Log all values for debugging
    console.log("sanitizedDay:", sanitizedDay);
    console.log("formattedDate:", formattedDate);
    console.log("reservationDateObj:", reservationDateObj);
    console.log("currentDate:", currentDate);
    console.log("daysDifference:", daysDifference);
  
    // Set the modal message based on the time difference
    if (isNaN(daysDifference)) {
      setModalMessage(
        language === "ar"
          ? "حدث خطأ في تحويل التاريخ أو الوقت. يرجى المحاولة مرة أخرى."
          : "An error occurred while parsing the date or time. Please try again."
      );
    } else if (daysDifference <= 1) {
      setModalMessage(
        language === "ar"
          ? "هل أنت متأكد أنك تريد الإلغاء؟"
          : "Are you sure you want to cancel?"
      );
    } else if (daysDifference <= 2) {
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
      // Sanitize the `day` string to remove any unwanted Unicode characters
      const sanitizedDay = day.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters
  
      // Split the sanitized day into parts
      const [dayPart, monthPart, yearPart] = sanitizedDay.split("/");
  
      // Create a valid date string in the format YYYY-MM-DD
      const formattedDate = `${yearPart}-${monthPart.padStart(2, "0")}-${dayPart.padStart(2, "0")}`;
  
      // Create a Date object for the reservation date (ignoring the time)
      const reservationDateObj = new Date(formattedDate);
  
      // Get the current date (ignoring the time)
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ignore the time part
  
      // Calculate the difference in milliseconds
      const timeDifference = reservationDateObj.getTime() - currentDate.getTime();
  
      // Convert the difference to days
      let daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Number of milliseconds in a day
  
      // Round down daysDifference to the nearest whole number
      daysDifference = Math.floor(daysDifference);
  
      // Log all values for debugging
      console.log("sanitizedDay:", sanitizedDay);
      console.log("formattedDate:", formattedDate);
      console.log("reservationDateObj:", reservationDateObj);
      console.log("currentDate:", currentDate);
      console.log("daysDifference:", daysDifference);
  
      // Send the cancellation request
      const url = `https://test-roshita.net/api/user-appointment-reservations/${appointementId}/`;
      console.log("Sending cancellation request to:", url);
  
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
  
      if (response.ok) {
        console.log("Cancellation successful!");
        setStatus("canceled");
        setIsCancelModalOpen(false);
  
        // Check if refund request would have been sent (commented out for now)
        console.log("Would check refund condition, daysDifference:", daysDifference);
        /*
        if (daysDifference <= 2) {
          console.log("Would send refund request...");
          // Refund request logic has been temporarily commented out
          try {
            const token = localStorage.getItem("access");
            const refundUrl = "https://test-roshita.net/api/reservation/refund/";
            console.log("Refund request URL:", refundUrl);
  
            const refundBody = {
              appointment_reservation: appointementId,
              reason: "Appointment cancellation"
            };
  
            const refundResponse = await fetch(refundUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": "VW6vgz0DcMQo9uu1fdvTgX9IGYZEQ0vSfHbSYe8pIQGw6kHJiPzHLAkCDplVi4FO",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(refundBody)
            });
  
            if (refundResponse.ok) {
              console.log("Refund request successful");
              const refundData = await refundResponse.json();
              console.log("Refund response:", refundData);
            } else {
              const refundText = await refundResponse.text();
              console.error("Refund request failed:", refundResponse.status, refundText);
            }
          } catch (error) {
            console.error("Error during refund request:", error);
          }
        } else {
          console.log("No refund request would be sent as daysDifference > 2");
        }
        */
      } else {
        const errorMsg =
          language === "ar"
            ? "حدث خطأ ما. حاول مرة أخرى."
            : "Something went wrong. Please try again.";
        console.error("Cancellation request failed:", response.status, await response.text());
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

  const getStatusTranslation = (status: string): string => {
    if (language !== "ar") return status;
    
    const lowerStatus = status.toLowerCase();
    
    switch (lowerStatus) {
      case "pending payment":
        return "في انتظار الدفع";
      case "cancelled by patient":
        return "ملغى من قبل المريض";        
      case "confirmed":
        return "مؤكد";
      case "completed":
        return "مكتمل";
      case "not attend":
        return "لم يحضر";
      case "rejected":
        return "مرفوض";
      case "cancelled by doctor":
        return "ملغى من قبل الطبيب";
      case "cancelled":
        return "ملغى";
      case "no show":
        return "لم يحضر";
      default:
        return status;
    }
  };

  console.log("imageUrl", imageUrl)

  return (
    <div
      className={`flex ${
        language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
      } flex-col p-4 bg-white rounded-xl w-full max-w-[1024px] lg:max-w-[1024px] mx-auto`}
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
          } flex-1`}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{name}</h1>
          <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
          <div className={`mb-2 ${language === "ar" ? "text-right" : "text-left"} w-full`}>
            <span className={`px-3 py-1 rounded-full text-sm inline-block ${
              status.toLowerCase() === "completed" ? "bg-green-100 text-green-800" :
              status.toLowerCase() === "confirmed" ? "bg-blue-100 text-blue-800" :
              status.toLowerCase() === "pending payment" ? "bg-yellow-100 text-yellow-600" :
              status.toLowerCase().includes("cancelled") ? "bg-red-100 text-red-600" :
              status.toLowerCase() === "not attend" || status.toLowerCase() === "no show" ? "bg-gray-100 text-gray-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {getStatusTranslation(status)}
            </span>
          </div>
          <div className="bg-gray-50 lg:p-6 p-2 flex lg:flex-row flex-col w-full justify-between lg:gap-8 gap-4 rounded">
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              } gap-2 flex-1`}
            >
              <Clock className="text-roshitaDarkBlue" />
              <span>
                {language === "ar" ? `الوقت ${time}` : `Time ${time}`}
              </span>
            </div>
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              } gap-2 flex-1`}
            >
              <Calendar className="text-roshitaDarkBlue" />
              <span>{language === "ar" ? `اليوم ${day}` : `Day ${day}`}</span>
            </div>
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row" : "flex-row-reverse"
              } gap-2 flex-1`}
            >
              <span>
                {language === "ar"
                  ? `رقم الحجز ${appointementId === undefined ? "-" : appointementId}`
                  : `Res. N° #{${appointementId}`}
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
              {status === "Cancelled" ? (
                <span className="text-red-500 text-lg">
                  {language === "ar" ? "تم الإلغاء" : "Cancelled"}
                </span>
              ) : (
                ["pending payment", "confirmed"].includes(status.toLowerCase()) && (
                  <Button
                    className="bg-transparent border-transparent text-black text-lg shadow-none hover:bg-gray-50"
                    onClick={handleCancelClick}
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}{" "}
                    <Trash className="text-red-500 w-6 h-6 ml-2" />
                  </Button>
                )
              )}
            </div>
            <div
              className={`w-full flex ${
                language === "ar"
                  ? "lg:justify-start justify-start"
                  : "lg:justify-end justify-end w-full"
              } mt-4`}
            >
              {status.toLowerCase() === "completed" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-transparent border-transparent text-black text-lg shadow-none hover:bg-gray-50 flex"
                >
                  {language === "ar" ? "قيّم" : "Rate"}
                  <Star className="text-yellow-500 w-6 h-6 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:ml-8 ml-4 h-40 w-40 lg:h-48 lg:w-48 rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden flex-shrink-0">
          <img
            src={
              imageUrl &&
              imageUrl !== null &&
              !imageUrl.startsWith("https://www.test-roshita.net/media/media/") &&
              /*!imageUrl.startsWith("/media/media/") &&*/
              !imageUrl.startsWith("/avatar/")
                ? imageUrl.startsWith("http")
                  ? imageUrl
                  : `https://www.test-roshita.net/${imageUrl}`
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
