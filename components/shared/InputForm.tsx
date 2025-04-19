import { useEffect, useState } from "react";
import { CircleDollarSign } from "lucide-react";

interface InputFormProps {
  type: "single" | "group";
  testType: string;
  onAdd: (name: string, price: string) => void;
}

type Language = "ar" | "en";

const InputForm: React.FC<InputFormProps> = ({ type, onAdd, testType }) => {
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [groupName, setGroupName] = useState(""); // For group name
  const [groupId, setGroupId] = useState<number>(0); // For category ID
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState<Language>("ar");
  const [medicalServices, setMedicalServices] = useState<any[]>([]); // State for medical services
  const [categories, setCategories] = useState<any[]>([]); // State for categories
  const [loadingServices, setLoadingServices] = useState(true); // Loading state for medical services
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

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

  const handleAdd = async () => {
    const accessToken = localStorage.getItem("access");

    // Validation check for empty fields
    if (!selectedService.name || !price || (type === "group" && !groupName)) {
      setErrorMessage(
        language === "ar"
          ? "يرجى تعبئة جميع الحقول"
          : "Please fill in all fields"
      );
      return; // Prevent further action if any field is missing
    }

    // Reset the error message if all fields are filled
    setErrorMessage("");

    // Proceed with your existing request logic
    if (selectedService.name && price) {
      const openDate = new Date();
      const closeDate = new Date(openDate);
      closeDate.setFullYear(openDate.getFullYear() + 1); // Add 1 year to the open date

      const requestData = {
        price: price,
        open_date: openDate.toISOString(),
        close_date: closeDate.toISOString(),
        medical_services: {
          name: selectedService.name,
        },
        medical_services_category: {
          name: groupName, // Send category name
        },
        medical_organization: {
          name: "Some Medical Organization", // Modify as needed
        },
        medical_services_id: selectedService.id,
        medical_services_category_id: groupId,
      };

      // Determine the API endpoint based on testType
      const apiEndpoint =
        testType === "rays" ? "/api/radiologic/addTests" : "/api/tests/addTests";

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Failed to send data");
        }

        const data = await response.json();
        // Redirect based on testType
        /*testType === "lab"
          ? (window.location.href = "/dashboard/labs")
          : (window.location.href = "/dashboard/x-rays");*/

        console.log("Data successfully sent:", data);
      } catch (error) {
        console.error("Error adding data:", error);
      }

      setSelectedService({ id: "", name: "" });
      setPrice("");
      if (type === "group") {
        setGroupName("");
        setGroupId(0);
      }
    }
  };

  // Fetch medical services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://test-roshita.net/api/medical-services-list/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch medical services");
        }
        const data = await response.json();
        setMedicalServices(data);
        setLoadingServices(false);
      } catch (error) {
        console.error("Error fetching medical services:", error);
      }
    };

    fetchServices();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://test-roshita.net/api/services-categories/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* Error message */}

      {errorMessage && (
        <div
          className={`text-red-500 bg-red-100 p-4 rounded ${
            language === "ar" ? "text-end" : "text-start"
          }`}
        >
          {errorMessage}
        </div>
      )}

      <div
        className={`flex lg:flex-row-reverse flex-col items-center gap-4 p-4 rounded ${
          language === "ar" ? "rtl" : ""
        }`}
      >
        <div className="relative w-full">
          {/* Input for name */}
          <select
            className="w-full pr-10 p-2 border rounded-[26px] focus:outline-[#00B3E9] h-[60px] text-end placeholder:text-end"
            value={selectedService.name}
            onChange={(e) => {
              const selectedOption = medicalServices.find(
                (service) => service.name === e.target.value
              );
              if (selectedOption) {
                setSelectedService({
                  id: selectedOption.id,
                  name: selectedOption.name,
                });
              }
            }}
          >
            <option value="" disabled>
              {language === "ar" ? "اختر اسم التحليل" : "Choose Test Name"}
            </option>
            {!loadingServices ? (
              medicalServices.map((service) => (
                <option key={service.id} value={service.name}>
                  {language === "ar" ? service.name : service.foreign_name}
                </option>
              ))
            ) : (
              <option>
                {language === "ar" ? "جارٍ التحميل..." : "Loading..."}
              </option>
            )}
          </select>
        </div>

        {type === "group" && (
          <div className="relative w-full">
            {/* Dropdown for test categories */}
            <select
              value={groupName}
              onChange={(e) => {
                const selectedCategory = categories.find(
                  (category) => category.name === e.target.value
                );
                if (selectedCategory) {
                  setGroupName(selectedCategory.name);
                  setGroupId(selectedCategory.id);
                }
              }}
              className="w-full pr-10 p-2 border rounded-[26px] focus:outline-[#00B3E9] h-[60px] text-end placeholder:text-end appearance-none"
              style={{
                background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>') no-repeat right 1rem center`,
                backgroundSize: "1rem",
              }}
            >
              <option value="" disabled>
                {language === "ar"
                  ? "اختر فئة الخدمة الطبية"
                  : "Choose Medical Service Category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {language === "ar" ? category.name : category.foreign_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative w-full">
          {/* Input for price */}
          <input
            type="number"
            placeholder={language === "ar" ? "السعر" : "Price"}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full pr-10 p-2 border rounded-[26px] focus:outline-[#00B3E9] h-[60px] text-end placeholder:text-end"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <CircleDollarSign className="w-5 h-5 text-[#00B3E9]" />
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-4 text-white bg-[#00B3E9] rounded-[26px] hover:bg-blue-500 w-full"
        >
          {language === "ar" ? "إضافة" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
