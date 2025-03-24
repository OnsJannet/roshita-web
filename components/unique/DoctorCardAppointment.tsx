import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Banknote, Calendar, MapPin } from "lucide-react";
import { AcceptAppointment } from "../shared/accpetAppoitment"; // Ensure the path is correct for this import
import { paiement } from "@/constant";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type DoctorCardAppointmentProps = {
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
  id: number;
  day: string;
  time: string;
  endTime: string;
  medical_organizations: { id: number; name: string };
};

interface City {
  id: number;
  foreign_name: string;
  name: string;
}

type Language = "ar" | "en";

const DoctorCardAppointment: React.FC<DoctorCardAppointmentProps> = ({
  id,
  name,
  specialty,
  price,
  location,
  imageUrl,
  endTime,
  day,
  time,
  medical_organizations,
}) => {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [processId, setProcessId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [selectedPaiementOption, setSelectedPaiementOption] = useState("");
  const [selectedFamilyOption, setSelectedFamilyOption] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [familyPatientId, setFamilyPatientId] = useState(false);
  const [existingFamilyMember, setExistingFamilyMember] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState(false);
  const [patientID, setPatientID] = useState("");
  const [isExistingFamilyViewOpen, setIsExistingFamilyViewOpen] =
    useState(false);
  const [isNewFamilyMemberModalOpen, setIsNewFamilyMemberModalOpen] =
    useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    relative: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });
  const [patients, setPatients] = useState([]); // State to store patients from profile

  // Fetch the user's profile using the access token from localStorage
  const fetchProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(
        "https://test-roshita.net/api/account/profile/detail/",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error fetching profile:", errorResponse);
        return errorResponse;
      }

      const profileData = await response.json();
      setPatientID(profileData.user.patient_id);
      //setPatients(profileData.patients);
      return profileData;
    } catch (error) {
      console.error("Network or other error occurred:", error);
      //@ts-ignore
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchProfile().then((profileData) => {
      if (profileData && !profileData.error) {
        console.log("Profile Data:", profileData);

        // Remove duplicates from the patients array
        const uniquePatients = profileData.patients.filter(
          //@ts-ignore
          (patient, index, self) =>
            //@ts-ignore
            index === self.findIndex((p) => p.id === patient.id)
        );

        // Set the unique patients in the state
        setPatients(uniquePatients || []);
      } else {
        console.error("Error fetching profile:", profileData.error);
      }
    });
  }, []);

  console.log("patients", patients);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    setIsNewFamilyMemberModalOpen(false);
  };

  const handleCheckboxFamilyChange = () => {
    setSelectedFamilyOption(!selectedFamilyOption);
    setIsModalOpen(!selectedFamilyOption);
  };

  const handleClick = (id: number) => {
    setSelectedId(id);
  };

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

  return (
    <div className="shadow-lg py-10 mt-2 max-w-[1280px] rounded-2xl">
      {step === 1 && (
        <>
          <h2 className="text-center font-semibold lg:text-4xl text-2xl">
            {language === "en" ? "Booking Confirmation" : "تأكيد الحجز"}
          </h2>
          {/* Right Section: Doctor Info */}
          <div
            className={`flex flex-1 ${
              language === "en" ? "justify-end flex-row-reverse" : "justify-end"
            } gap-4 lg:px-40 lg:py-10 p-4`}
          >
            {/* Doctor's Details */}
            <div
              className={`flex flex-col ${
                language === "en" ? "items-start " : "items-end"
              }`}
            >
              <h1 className="lg:text-2xl text-xl font-bold text-gray-800 mb-1">
                {name}
              </h1>
              <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
              <div
                className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <span>
                  {language === "en" ? "Price: " : "سعر الكشف: "} {price}
                </span>
                <Banknote className="text-roshitaDarkBlue" />
              </div>

              <div
                className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <p className="text-sm text-gray-500">
                  {language === "en" ? "Location: " : ""}
                  {location}
                </p>
                <MapPin className="text-roshitaDarkBlue" />
              </div>

              <h1
                className={`lg:text-2xl text-xl font-bold text-gray-800 mb-1 mt-4 flex gap-2 items-center ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                {language === "en" ? "Day" : "اليوم"}{" "}
                <Calendar className="text-roshitaDarkBlue w-6 h-6" />
              </h1>

              <p>
                {time} {day}
              </p>

              <div>
                <div className="flex items-center space-x-2 mt-4 mb-2">
                  <input
                    type="checkbox"
                    id="family"
                    checked={selectedFamilyOption}
                    onChange={handleCheckboxFamilyChange}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="full"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language === "en"
                      ? "Is this appointment for a family member?"
                      : " هل هذا الموعد لأحد أفراد العائلة؟"}
                  </label>
                </div>
              </div>

              {/* First Modal: Choose between Existing or New Family Member */}
              {isModalOpen && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        {language === "en"
                          ? "Family Member Details"
                          : "تفاصيل أحد أفراد العائلة"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className=" flex justify-center gap-4">
                      <Button
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsSelectionModalOpen(true);
                          setExistingFamilyMember(true);
                        }}
                      >
                        {language === "en"
                          ? "Existing Family Member"
                          : "فرد عائلة موجود"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsNewFamilyMemberModalOpen(true);
                          setNewFamilyMember(true);
                        }}
                      >
                        {language === "en"
                          ? "New Family Member"
                          : "فرد عائلة جديد"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Second Modal: Existing Family Member Selection */}
              {isSelectionModalOpen && (
                <Dialog
                  open={isSelectionModalOpen}
                  onOpenChange={setIsSelectionModalOpen}
                >
                  <DialogContent className="h-[90%] flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        {language === "en"
                          ? "Select a Family Member"
                          : "اختر فرد العائلة"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 overflow-y-auto max-h-[80vh] p-2">
                      {patients.map((patient) => (
                        <div
                          /*@ts-ignore*/
                          key={patient.id}
                          className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            console.log("Selected Patient:", patient);
                            //@ts-ignore
                            setFamilyPatientId(patient.id);
                            setIsSelectionModalOpen(false);
                          }}
                        >
                          <p>
                            {/*@ts-ignore*/}
                            {patient.first_name} {patient.last_name} -{" "}
                            {/*@ts-ignore*/}
                            {patient.relative}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Third Modal: New Family Member Form */}
              {isNewFamilyMemberModalOpen && (
                <Dialog
                  open={isNewFamilyMemberModalOpen}
                  onOpenChange={setIsNewFamilyMemberModalOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        {language === "en"
                          ? "New Family Member"
                          : "فرد عائلة جديد"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder={language === "en" ? "First Name" : "الاسم"}
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={
                          language === "ar" ? "placeholder:text-right" : ""
                        }
                      />
                      <Input
                        placeholder={language === "en" ? "Last Name" : "اللقب"}
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={
                          language === "ar" ? "placeholder:text-right" : ""
                        }
                      />
                      {/* Dropdown for Relative */}
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, relative: value })
                        }
                        value={formData.relative}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            language === "ar" ? "text-right rtl" : "text-left"
                          }`}
                        >
                          <SelectValue
                            placeholder={
                              language === "en"
                                ? "Select Relative"
                                : "اختر صلة القرابة"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent
                          className={`absolute top-full w-[460px] mt-1 z-50 max-h-48 overflow-auto bg-white shadow-md border rounded-md 
      ${language === "ar" ? "right-0" : "left-0"}`}
                        >
                          {[
                            { value: "Father", en: "Father", ar: "أب" },
                            { value: "Mother", en: "Mother", ar: "أم" },
                            { value: "Daughter", en: "Daughter", ar: "ابنة" },
                            { value: "Son", en: "Son", ar: "ابن" },
                            {
                              value: "Grandfather",
                              en: "Grandfather",
                              ar: "جد",
                            },
                            {
                              value: "Grandmother",
                              en: "Grandmother",
                              ar: "جدة",
                            },
                            { value: "Brother", en: "Brother", ar: "أخ" },
                            { value: "Sister", en: "Sister", ar: "أخت" },
                            { value: "Uncle", en: "Uncle", ar: "عم / خال" },
                            { value: "Aunt", en: "Aunt", ar: "عمة / خالة" },
                            {
                              value: "Cousin",
                              en: "Cousin",
                              ar: "ابن عم / ابن خال",
                            },
                            { value: "Husband", en: "Husband", ar: "زوج" },
                            { value: "Wife", en: "Wife", ar: "زوجة" },
                          ].map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              className={`px-3 py-2 ${
                                language === "ar" ? "text-right" : "text-left"
                              }`}
                            >
                              {language === "en" ? item.en : item.ar}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsNewFamilyMemberModalOpen(false)}
                      >
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                      <Button onClick={handleSubmit}>
                        {language === "en" ? "Save" : "حفظ"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Navigate to Step 2 Button */}
              <Button onClick={() => setStep(2)} className="mt-4">
                {language === "en"
                  ? "Proceed to Payment"
                  : "الانتقال إلى الدفع"}
              </Button>
            </div>

            {/* Doctor's Image */}
            <div className="ml-4 h-[120px] w-[120px] rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
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
        </>
      )}

      {step === 2 && (
        <div className="lg:p-20 p-4">
          <h2 className="text-center font-semibold lg:text-4xl text-2x">
            {language === "en" ? "Payment Methods" : "طــــرق الدفـــع"}
          </h2>
          {/* Payment Section */}
          <div
            className={`flex flex-col p-4 ${
              language === "en" ? "text-start" : "text-end"
            }`}
          >
            {/* Payment Details */}
            <div className={`text-${language === "en" ? "start" : "end"} mb-4`}>
              <p className="text-gray-600 mb-2 pb-2 text-center">
                {language === "en"
                  ? "Select the payment method available to you"
                  : "أختار الطريقــة المعاملة التي موجودة لديــــــك"}
              </p>

              <p className="text-black mb-2 pb-2 text-center">
                {language === "en"
                  ? "Your payment for Roshita will be processed using the selected method. Please note that payments for the doctor must be made in cash directly at the doctor's cabinet."
                  : "سيتم معالجة دفعتك لروشيتا باستخدام الطريقة المحددة. يرجى ملاحظة أن الدفع للطبيب يجب أن يتم نقدًا مباشرة في عيادة الطبيب."}
              </p>
              <p
                className={`text-gray-600 mb-2 pb-2 text-2xl font-semibold ${
                  language === "en" ? "text-start" : "text-end"
                }`}
              >
                {language === "en" ? "Choose your card" : "أختـــار البطــاقة"}
              </p>
              <div>
                <div className="flex flex-wrap gap-4">
                  {paiement.map((option) => (
                    <div
                      key={option.id}
                      className={`flex ${
                        language === "en" ? "flex-row" : "flex-row-reverse"
                      } justify-start gap-2 items-center p-4 rounded-lg cursor-pointer transition-colors w-full ${
                        selectedId === option.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleClick(option.id)}
                    >
                      <img
                        src={option.image}
                        alt={language === "en" ? option.name_en : option.name} // Use name_en for English
                        className="w-16 h-16 mb-2 object-contain"
                      />
                      <span className="text-lg font-semibold">
                        {language === "en" ? option.name_en : option.name}{" "}
                        {/* Use name_en if language is en */}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accept Appointment Button */}
            <AcceptAppointment
              name={name}
              specialty={specialty}
              rating={0}
              reviewsCount={0}
              price={price}
              location={location}
              imageUrl={imageUrl}
              id={id}
              day={day}
              time={time}
              endTime={endTime}
              medical_organizations={medical_organizations}
              payement={selectedPaiementOption}
              formData={
                selectedFamilyOption
                  ? newFamilyMember
                    ? {
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        phone: formData.phone,
                        email: formData.email,
                        address: formData.address,
                        city: formData.city,
                        relative: formData.relative,
                      }
                    : { id: familyPatientId, relative: "isForFamilyMember" }
                  : { id: patientID || "", relative: "Myself" }
              }
              familymember={selectedFamilyOption}
              familymemberType={
                newFamilyMember ? "newFamilyMember" : "existingFamilyMember"
              }
              paymentMethod={
                selectedId
                  ? paiement.find((option) => option.id === selectedId)
                  : null
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCardAppointment;
