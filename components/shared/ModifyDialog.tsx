import React, { useState, useEffect } from "react";

interface ModifyDialogProps {
  packageData: {
    price: string;
    open_date: string;
    close_date: string;
    medical_services_id: number;
    medical_services_category_id: number;
  };
  onClose: () => void;
  onSave: (updatedData: any) => void;
  language: "ar" | "en";
}

const ModifyDialog: React.FC<ModifyDialogProps> = ({
  packageData,
  onClose,
  onSave,
  language,
}) => {
  const [formData, setFormData] = useState(packageData);
  const [categories, setCategories] = useState<any[]>([]); // State to hold categories
  const [services, setServices] = useState<any[]>([]); // State to hold medical services
  const [loading, setLoading] = useState(true); // To manage loading state for the categories
  const [loadingServices, setLoadingServices] = useState(true); // To manage loading state for services

  useEffect(() => {
    setFormData(packageData);
  }, [packageData]);

  // Fetch categories from the services categories API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://test-roshita.net/api/services-categories/");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data); // Set categories state
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch medical services from the medical services API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://test-roshita.net/api/medical-services-list/");
        if (!response.ok) {
          throw new Error("Failed to fetch medical services");
        }
        const data = await response.json();
        setServices(data); // Set services state
        setLoadingServices(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching medical services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form data before saving:", formData); // Log the form data
    onSave(formData); // Send the updated data back to the parent
    onClose(); // Close the dialog
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="text-lg font-bold mb-4">
          {language === "ar" ? "تعديل الباقه" : "Modify Package"}
        </div>
        <div className="flex flex-col gap-4">
          <label>
            {language === "ar" ? "السعر" : "Price"}
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
            />
          </label>
          {/*<label>
            {language === "ar" ? "تاريخ الفتح" : "Open Date"}
            <input
              type="datetime-local"
              name="open_date"
              value={formData.open_date}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
            />
          </label>
          <label>
            {language === "ar" ? "تاريخ الإغلاق" : "Close Date"}
            <input
              type="datetime-local"
              name="close_date"
              value={formData.close_date}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
            />
          </label>*/}
          
          {/* Dropdown for Medical Service ID */}
          <label>
            {language === "ar" ? "خدمة طبية" : "Medical Service ID"}
            <select
              name="medical_services_id"
              value={formData.medical_services_id}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
            >
              <option value="" disabled>
                {language === "ar" ? "اختار خدمة طبية" : "Select a medical service"}
              </option>
              {!loadingServices ? (
                services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {language === "ar" ? service.name : service.foreign_name}
                  </option>
                ))
              ) : (
                <option>{language === "ar" ? "جارٍ التحميل..." : "Loading..."}</option>
              )}
            </select>
          </label>

          <label>
            {language === "ar" ? "فئة الخدمة الطبية" : "Medical Service Category ID"}
            {/* Dropdown for Medical Service Category */}
            <select
              name="medical_services_category_id"
              value={formData.medical_services_category_id}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
            >
              <option value="" disabled>
                {language === "ar" ? "اختار فئة الخدمة" : "Select a category"}
              </option>
              {!loading ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {language === "ar" ? category.name : category.foreign_name}
                  </option>
                ))
              ) : (
                <option>{language === "ar" ? "جارٍ التحميل..." : "Loading..."}</option>
              )}
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={onClose}
          >
            {language === "ar" ? "إغلاق" : "Close"}
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            {language === "ar" ? "حفظ" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyDialog;
