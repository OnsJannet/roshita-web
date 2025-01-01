"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import AnalysisPackage from "@/components/shared/AnalysisPackage";
import InputForm from "@/components/shared/InputForm";
import TestCard from "@/components/shared/testCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ActionDropdown from "@/components/unique/ActionDropdown";
import FilterTests from "@/components/unique/FilterTests";
import TestGroupSelector from "@/components/unique/TestGroupeSelector";
import { Tests } from "@/constant";
import { useState, useMemo, useEffect } from "react";

type Language = "ar" | "en";

/**
 * This page represents the "Add Test" functionality within a dashboard-style layout.
 * It is designed to allow the user to add new tests, manage test entries, and navigate between different sections.
 * 
 * Key Features:
 * 1. **Language Handling**: The page supports two languages: Arabic (ar) and English (en).
 *    - The language preference is stored in the browser's `localStorage` and can be dynamically changed.
 *    - The page elements, including headers, breadcrumbs, and buttons, adapt based on the selected language.
 * 
 * 2. **Breadcrumb Navigation**: Displays the current navigation path and provides links to other sections:
 *    - "الرئسية" / "Dashboard"
 *    - "اختبارات المعمل" / "Tests"
 *    - "اضافة الاختبارات" / "Add Test"
 * 
 * 3. **Test Management**:
 *    - **Test Entry Form**: The user can add new tests via an `InputForm` component. Each test entry consists of a name and price.
 *    - **Test List**: The tests are displayed using `TestCard` components, showing the test name and price, with options to delete individual entries.
 * 
 * 4. **State Management**:
 *    - The `useState` hook is used for managing the current language (`language`), search filter (`search`), selected test group (`selectedGroup`), and the list of tests (`tests`).
 *    - `useEffect` is used to listen for changes to the `language` in `localStorage` and updates the state accordingly.
 * 
 * 5. **Test Filtering**: 
 *    - The page supports filtering tests by search term using the `search` state.
 *    - The tests are filtered dynamically based on the entered search term, ensuring that only relevant tests are displayed.
 * 
 * 6. **Pagination**: 
 *    - Tests are paginated, displaying a fixed number of tests per page (5 in this case).
 *    - The pagination logic allows users to navigate between pages and see a limited number of test entries at a time.
 *    - The pagination is implemented using the `Pagination` component and allows for page changes based on user input.
 * 
 * 7. **Save Button**: Once tests are added, a "Save" button is available at the bottom of the page to finalize the additions. Clicking this button redirects the user to the `/dashboard/labs` page.
 *    - The button text adapts based on the selected language ("حفظ" for Arabic and "Save" for English).
 * 
 * 8. **Sidebar**: 
 *    - The page includes a sidebar (`AppSidebar`) for additional navigation and options, positioned on the right side of the screen.
 *    - The sidebar visibility and structure are managed using the `SidebarProvider`, `SidebarInset`, and `SidebarTrigger` components.
 * 
 * Overall, this page serves as an interactive and dynamic interface for adding and managing laboratory tests, with language support, test filtering, and pagination functionalities.
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
      label: language === "ar" ? " اضافة الاختبارات " : "Add Test",
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
      <header className={`flex ${language === "ar" ? "justify-end" : "justify-between"} h-16 shrink-0 items-center border-b px-4 gap-2`}>
      <div className={`flex ${language === "ar" ? "flex-row" : "flex-row-reverse"} gap-2 items-center`}>
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
              {language === "ar" ? "اضافة تحليل" : "Add Analysis"}
            </h2>

            <div className="mx-auto w-full ">
              <InputForm onAdd={handleAddItem} type="single"testType="" />
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
                  className=" rounded-2xl h-[52px] w-[140px]"
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
