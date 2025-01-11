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
  onError
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [language, setLanguage] = useState<Language>("ar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("error");
  const [comment, setComment] = useState("");

  console.log("onError", onError);

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

  /*const handleCancel = () => {
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");

    const updatedAppointments = appointments.map((appointment: any) => {
      if (appointment.doctorName === name && appointment.day === day) {
        return { ...appointment, status: "canceled" };
      }
      return appointment;
    });

    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    setStatus("canceled");
    alert(language === "ar" ? "تم إلغاء الموعد" : "Appointment canceled");
  };*/



  const handleCancel = async () => {
    try {
      const url = `https://test-roshita.net/api/user-appointment-reservations/${appointementId}/`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
  
      if (!response.ok) {
        const errorMsg =
          language === "ar"
            ? "حدث خطأ ما. حاول مرة أخرى."
            : "Something went wrong. Please try again.";
        setError(errorMsg);
        onError?.(errorMsg); // Notify parent about the error
        return;
      }
  
      const reservationData = await response.json();
      const updatedReservation = { ...reservationData, reservation_status: "CANCELLED" };
  
      const updateResponse = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(updatedReservation),
      });
  
      if (updateResponse.ok) {
        window.location.reload();
        setStatus("canceled");
        alert(language === "ar" ? "تم إلغاء الموعد" : "Appointment canceled");
      } else {
        const errorMsg =
          language === "ar"
            ? "حدث خطأ ما. حاول مرة أخرى."
            : "Something went wrong. Please try again.";
        const errorData = await updateResponse.json();
        console.error("Error canceling appointment:", errorData);
        onError?.(errorMsg); // Notify parent
      }
    } catch (err) {
      const errorMsg =
        language === "ar"
          ? "حدث خطأ ما. حاول مرة أخرى."
          : "Something went wrong. Please try again.";
      console.error("Error during cancellation:", err);
      onError?.(errorMsg); // Notify parent
    }
  };
  
  console.log("appointement status", appointementStatus);
  

  const handleRate = async () => {
    try {
      // Prepare the payload
      const payload = { rating };
      const token = localStorage.getItem("access")
      // Replace the doctor ID dynamically
      const doctorId = doctorID; // Ensure this variable holds the correct doctor's ID
      const url = `https://test-roshita.net/api/doctor/${doctorId}/update-rating/`;
  
      // Send the POST request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
  
      // Parse the response
      const data = await response.json();
  
      // Check if the request was successful
      if (response.ok) {
        //alert(language === "ar" ? "شكراً لتقييمك!" : "Thank you for your feedback!");
        window.location.reload();
        console.log("Rating submitted successfully:", data);
      } else {
        console.error("Failed to submit rating:", data);
        alert(language === "ar" ? "حدث خطأ ما. حاول مرة أخرى." : "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error while submitting rating:", error);
      alert(language === "ar" ? "حدث خطأ ما. حاول مرة أخرى." : "Something went wrong. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };
  

  return (
    <div
      className={`flex ${
        language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
      } flex-col p-4 bg-white shadow-lg rounded-xl w-full max-w-[80%] lg:max-w-[80%] mx-auto`}
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
          <div className="bg-gray-100 lg:p-4 p-2 flex lg:flex-row flex-col w-full justify-between lg:gap-20 gap-4 rounded">
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

          {}
          <div className="flex justify-between items-center w-full">
            <div
              className={`w-full flex ${
                language === "ar"
                  ? "lg:justify-start justify-start"
                  : "lg:justify-end justify-end"
              } mt-4`}
            >
              {status === "canceled" ? (
                <span className="text-red-500 text-lg">
                  {language === "ar" ? "تم الإلغاء" : "Canceled"}
                </span>
              ) : (
                <Button
                  className="bg-transparent border-transparent text-black text-lg shadow-none hover:bg-gray-50"
                  onClick={handleCancel}
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
            {/*<textarea
              className="w-full p-2 border rounded mb-4"
              rows={3}
              placeholder={
                language === "ar"
                  ? "أضف تعليقك هنا"
                  : "Add your comment here"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>*/}
            {(appointementStatus === "confirmed" || appointementStatus === "pending payment") && (
              <div className="flex justify-center gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={handleCancel}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointementsCard;
