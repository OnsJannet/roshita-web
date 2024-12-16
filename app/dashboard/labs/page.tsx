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
import { Tests } from "@/constant";
import { useState, useMemo, useEffect } from "react";

type Language = "ar" | "en";

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
  ];

  const testsPerPage = 5; // Number of tests per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [search, setSearch] = useState(""); // Search state for filter
  const [selectedGroup, setSelectedGroup] = useState(""); // State for selected group

  // Handle Edit Action
  const handleEdit = (testId: string) => {
    console.log("Editing test with ID:", testId);
    // Add the logic to handle the edit functionality
  };

  // Handle Delete Action
  const handleDelete = (testId: string) => {
    console.log("Deleting test with ID:", testId);
    // Add the logic to handle the delete functionality
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

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center border-b px-4 gap-2">
          <div className="flex flex-row-reverse gap-2 items-center">
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
                ? "قائمة الاختبارات المعملية"
                : "Laboratory Test List"}
            </h2>

            <div className="mx-auto w-full flex lg:flex-row-reverse flex-col justify-between gap-8 my-8">
              <div className="lg:w-[100%] ">
                <FilterTests tests={Tests.lab_tests} setSearch={setSearch} />
              </div>
              <div className="lg:w-[100%] ">
                <TestGroupSelector
                  groups={Tests.test_groups}
                  tests={Tests.lab_tests}
                  setSelectedGroup={setSelectedGroup} // Pass down the setter to the selector
                />
              </div>
              <div className="lg:w-[30%] w-full flex justify-end items-center ">
                <ActionDropdown />
              </div>
            </div>

            {/* Render the filtered and paginated tests */}
            {currentTests.map((test, index) => (
              <AnalysisPackage
                key={index}
                title={test.اسم_الفحص}
                subtitle={test.الفئة}
                onEdit={() => handleEdit(test.معرف_الفحص)}
                onDelete={() => handleDelete(test.معرف_الفحص)}
              />
            ))}

            {/* Pagination */}
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
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
