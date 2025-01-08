"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import AnalysisPackage from "@/components/shared/AnalysisPackage";
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
import { useState, useMemo, useEffect } from "react";

type Language = "ar" | "en";

/**
 * This page displays a list of laboratory tests, with support for filtering, pagination, and deletion.
 * It allows users to filter tests by search term and group, and paginate through the results.
 * It also handles localization based on the selected language (Arabic or English).
 * 
 * The page has the following main functionalities:
 * 
 * 1. **Language Handling**: The language is stored in localStorage and can be changed dynamically. 
 *    The layout and text are updated according to the selected language (Arabic or English).
 * 
 * 2. **Test Fetching**: Upon loading, the page fetches a list of tests from the server using an API call.
 *    The `accessToken` is used for authentication when making requests to the backend.
 * 
 * 3. **Test Filtering**: Users can filter the displayed tests based on a search term and a selected group.
 *    The search term is checked against the `medical_services` and `medical_services_category` properties of each test.
 *    The selected group filters the tests by their `medical_services_category`.
 * 
 * 4. **Test Deletion**: Each test can be deleted by clicking on a delete button next to it.
 *    The deletion is confirmed with a success or error message, and the list of tests is updated accordingly.
 * 
 * 5. **Pagination**: The tests are displayed in pages, with a maximum of 5 tests per page.
 *    The page supports navigating between pages using the pagination controls.
 * 
 * 6. **Empty and Error States**: If there are no tests available, a message is displayed indicating this.
 *    If an error occurs while fetching tests, an error message is shown.
 * 
 * 7. **Responsive Layout**: The page is designed to be responsive, with components adjusting based on screen size.
 *    The layout includes the sidebar, breadcrumb navigation, filter inputs, and test listing.
 * 
 * 8. **Components Used**:
 *    - `AppSidebar`: Sidebar component used for navigation.
 *    - `Breadcrumb`: Displays the navigation trail.
 *    - `AnalysisPackage`: Displays each test with its details and actions (edit/delete).
 *    - `FilterTests`: Component for entering search terms to filter tests.
 *    - `TestGroupSelector`: Component for selecting a test group to filter the tests.
 *    - `Pagination`: Pagination controls for navigating through the test list.
 *    - `ActionDropdown`: Dropdown component for performing actions on the page.
 * 
 * The page structure includes a header with breadcrumb navigation, a filter section for tests, and the main content area where tests are displayed.
 * The user can also navigate between pages of tests using the pagination controls at the bottom of the page.
 */


export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [tests, setTests] = useState<any[]>([]); // Store tests data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState<string | null>(null); // Error state
  const [selectedGroup, setSelectedGroup] = useState<string>(""); // Selected group
  const [search, setSearch] = useState(""); // Search state for filter

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, []);

  useEffect(() => {
    const fetchTests = async () => {
      const accessToken =
      typeof window !== "undefined"
      // @ts-ignore
        ? localStorage.getItem("access")
        : null;
      try {
        const response = await fetch("/api/tests/getTests", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleDeleteTest = async (testId: number) => {
    const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("access")
      : null;
    try {
      const response = await fetch(`/api/tests/deleteTest?id=${testId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete test:", data);
        alert("Failed to delete test. Please try again.");
        return;
      }
  
      // Remove the deleted test from the state
      setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
      alert("Test deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("An error occurred while deleting the test.");
    }
  };
  

  const testsPerPage = 5; // Number of tests per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Filtered tests based on search input and selected group
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        test.medical_services?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        test.medical_services_category.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesGroup =
        !selectedGroup || // If no group is selected, include all groups
        test.medical_services_category.name === selectedGroup;

      return matchesGroup && (matchesSearch || !test.medical_services);
    });
  }, [tests, search, selectedGroup]);

  const startIndex = (currentPage - 1) * testsPerPage;
  const endIndex = startIndex + testsPerPage;
  const currentTests = filteredTests.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredTests.length / testsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            <Breadcrumb
              items={[
                {
                  label: language === "ar" ? "الرئسية" : "Dashboard",
                  href: "#",
                },
                {
                  label: language === "ar" ? "اختبارات المعمل" : "Tests",
                  href: "/dashboard/labs",
                },
              ]}
              translate={(key) => key}
            />
            <SidebarTrigger className="rotate-180 " />
          </div>
        </header>

        <div className="w-full max-w-[1280px] mx-auto">
          <div className="flex justify-center flex-col gap-4 p-4">
            <h2
              className={`text-[25px] font-semibold ${
                language === "ar" ? "text-end" : "text-start"
              }`}
            >
              {language === "ar"
                ? "قائمة الاختبارات المعملية"
                : "Laboratory Test List"}
            </h2>

            <div className="mx-auto w-full flex lg:flex-row-reverse flex-col justify-between gap-4 my-8">
              <div className="lg:w-[80%]">
                <FilterTests tests={tests} setSearch={setSearch} />
              </div>
              <div className="lg:w-[80%]">
                <TestGroupSelector
                  groups={tests.map((test) => ({
                    معرف_المجموعة: test.medical_services_category.id,
                    اسم_المجموعة: test.medical_services_category.name,
                    الفحوصات_المشمولة: [
                      test.medical_services?.name || "غير متوفر",
                    ],
                  }))}
                  tests={tests.map((test) => ({
                    معرف_الفحص: test.medical_services?.id || 0,
                    اسم_الفحص: test.medical_services?.name || "غير متوفر",
                  }))}
                  setSelectedGroup={setSelectedGroup}
                />
              </div>
              <div className="lg:w-[30%] w-full flex justify-end items-center">
                <ActionDropdown type="lab"/>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col gap-4">
              <div
                className={`flex flex-col lg:gap-0 gap-6 items-center justify-between border rounded-lg p-4 h-20 bg-gray-50 animate-pulse ${
                  language === "ar" ? "rtl lg:flex-row-reverse" : "lg:flex-row"
                }`}
              ></div>
              <div
              className={`flex flex-col lg:gap-0 gap-6 items-center justify-between border rounded-lg p-4 h-20 bg-gray-50 animate-pulse ${
                language === "ar" ? "rtl lg:flex-row-reverse" : "lg:flex-row"
              }`}
            ></div>
            </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {/* Check for empty state */}
            {!loading && !error && currentTests.length === 0 && (
              <p className="text-center text-gray-500">
                {language === "ar"
                  ? "لا توجد اختبارات متوفرة في الوقت الحالي"
                  : "There are no tests available at the moment"}
              </p>
            )}

            {/* Render the list of tests */}
            {!loading &&
              !error &&
              currentTests.map((test, index) => (
                <AnalysisPackage
                  key={index}
                  title={test.medical_services?.name || "غير متوفر"}
                  subtitle={test.medical_services_category.name}
                  onEdit={() => console.log("Editing test with ID:", test.id)}
                  onDelete={() => handleDeleteTest(test.id)}
                  type="lab"
                  packageData={{
                    price: test.price,
                    open_date: test.open_date,
                    close_date: test.close_date,
                    medical_services_id: test.medical_services.id,
                    medical_services_category_id:
                      test.medical_services_category.id,
                  }}
                  updatedData_id={test.id}
                />
              ))}

            {/* Pagination */}
            {!loading && !error && currentTests.length > 0 && (
              <Pagination className="mt-8">
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                  </PaginationItem>
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage < totalPages - 1 && <PaginationEllipsis />}
                </PaginationContent>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            )}
          </div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
