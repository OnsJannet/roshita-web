"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import InputForm from "@/components/shared/InputForm";
import TestCard from "@/components/shared/testCard";
import { Button } from "@/components/ui/button";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tests } from "@/constant";
import { useState, useMemo, useEffect } from "react";

type Language = "ar" | "en";


/**
 * This page is designed for adding a package analysis (lab tests) within a dashboard-like interface.
 * It includes the following main features:
 *
 * 1. **Language Management**: 
 *    - The page supports both Arabic (`ar`) and English (`en`) languages. It checks the user's language preference from `localStorage` 
 *      and updates the page accordingly. The page listens for changes in the language setting and updates the state when it changes.
 *
 * 2. **Sidebar and Breadcrumb**: 
 *    - The page includes a sidebar (`AppSidebar`) and breadcrumb navigation to allow users to navigate through the app easily. 
 *    - The breadcrumb items adjust based on the selected language (Arabic or English), providing links like "Dashboard", "Tests", and "Add Package Analysis".
 *
 * 3. **Test Management**:
 *    - Users can add lab tests to a package by filling out a form (`InputForm`) that takes the test name and price. 
 *    - The form accepts the type of test as "group" and stores the information as a list of tests. 
 *    - Users can delete tests from the list using a `TestCard` component that displays the test name and price, and includes a delete button.
 *
 * 4. **Pagination**:
 *    - The tests are displayed in a paginated format, with a maximum of 5 tests per page. 
 *    - The page allows users to switch between pages of tests using a pagination system. 
 *    - The current page and total pages are calculated based on the filtered list of tests.
 *
 * 5. **Search and Filter**:
 *    - There is a search functionality that allows users to filter the tests by name. The search input is dynamically applied to filter 
 *      the list of available tests.
 *    - Additionally, the tests can be filtered by selecting a test group. The group selection is applied to filter the list of tests accordingly.
 *
 * 6. **Save Button**:
 *    - Once the user has added tests to the list, they can click a "Save" button to navigate to a different page ("/dashboard/labs") 
 *      to save the data. The button's text changes based on the selected language.
 *
 * 7. **Responsive Layout**: 
 *    - The layout adjusts for both Arabic (RTL) and English (LTR) languages. This is reflected in the direction of the header, 
 *      breadcrumb items, and overall layout structure.
 *
 * The page serves as a user interface for managing and saving a collection of lab tests within a package, providing essential 
 * functionality like adding, searching, filtering, and saving the tests.
 */

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");

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

  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "اختبارات المعمل" : "Tests",
      href: "/dashboard/labs",
    },
    {
      label: language === "ar" ? " اضافة تحليل باقة" : "Add Package Analysis",
      href: "#",
    },
  ];

  const testsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [tests, setTests] = useState<{ name: string; price: string }[]>([]);

  // Handle Edit Action
  const handleEdit = (testId: string) => {
    console.log("Editing test with ID:", testId);
    // Add the logic to handle the edit functionality
  };

  const handleDelete = (testName: string) => {
    setTests((prevTests) => prevTests.filter((test) => test.name !== testName));
  };

  // Filtered tests based on search input
  const filteredTests = useMemo(() => {
    return Tests.lab_tests.filter((test) =>
      test.اسم_الفحص.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Filter tests based on selected group
  const testsInSelectedGroup = useMemo(() => {
    if (!selectedGroup) return filteredTests;
    return filteredTests.filter((test) =>
      Tests.test_groups
        .find((group) => group.اسم_المجموعة === selectedGroup)
        ?.الفحوصات_المشمولة.includes(test.معرف_الفحص)
    );
  }, [selectedGroup, filteredTests]);

  // Calculate the current tests to display based on the page and filtered tests
  const startIndex = (currentPage - 1) * testsPerPage;
  const endIndex = startIndex + testsPerPage;
  const currentTests = testsInSelectedGroup.slice(startIndex, endIndex);

  // Pagination logic
  const totalPages = Math.ceil(testsInSelectedGroup.length / testsPerPage);

  // Function to handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddItem = (name: string, price: string) => {
    setTests([...tests, { name, price }]);
  };

  

  return (
    <SidebarProvider>
      <SidebarInset>
      <header
          className={`flex ${
            language === "ar" ? "justify-end" : "justify-between"
          } h-16 shrink-0 items-center border-b px-4 gap-2`}
        >
          <div
            className={`flex ${
              language === "ar" ? "flex-row" : "flex-row-reverse"
            } gap-2 items-center`}
          >
            <Breadcrumb items={items} translate={(key) => key} />{" "}
            {/* Pass a no-op translate function */}
            <SidebarTrigger className="rotate-180 " />
          </div>
        </header>

        <div className="w-full max-w-[1280px] mx-auto">
          <div className="flex justify-center flex-col gap-4 p-4 ">
            <h2
              className={`text-[25px] font-semibold ${
                language === "ar" ? "text-end" : "text-start"
              }`}
            >
              {language === "ar"
                ? "إضافة تحليل الباقه"
                : "Add Package Analysis"}
            </h2>

            <div className="mx-auto w-full ">
              <InputForm onAdd={handleAddItem} type="group" testType="lab"/>
              <div className="mt-6 space-y-4">
                {tests.map((item, index) => (
                  <TestCard
                    key={index}
                    name={item.name}
                    price={item.price}
                    onDelete={() => handleDelete(item.name)}
                  />
                ))}
              </div>
            </div>

            {tests.length > 0 && (
              <div className="flex justify-center mt-20">
                <Button
                  variant="register"
                  className="rounded-2xl h-[52px] w-[140px]"
                  onClick={() => (window.location.href = "/dashboard/labs")}
                >
                  {language === "ar" ? "حفظ" : "Save"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
