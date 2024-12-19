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

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [tests, setTests] = useState<any[]>([]); // Store tests data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState<string | null>(null); // Error state
  const [selectedGroup, setSelectedGroup] = useState<string>(""); // Selected group
  const [search, setSearch] = useState(""); // Search state for filter

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

  useEffect(() => {
    const fetchTests = async () => {
      const accessToken = localStorage.getItem("access");
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

  const testsPerPage = 5; // Number of tests per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Filtered tests based on search input and selected group
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        test.medical_services?.name?.toLowerCase().includes(search.toLowerCase()) ||
        test.medical_services_category.name.toLowerCase().includes(search.toLowerCase());
  
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
        <header className={`flex ${language === "ar" ? "justify-end" : "justify-between"} h-16 shrink-0 items-center border-b px-4 gap-2`}>
          <div className={`flex ${language === "ar" ? "flex-row" : "flex-row-reverse"} gap-2 items-center`}>
            <Breadcrumb
              items={[
                { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
                { label: language === "ar" ? "اختبارات المعمل" : "Tests", href: "/dashboard/labs" },
              ]}
              translate={(key) => key}
            />
            <SidebarTrigger className="rotate-180 " />
          </div>
        </header>

        <div className="w-full max-w-[1280px] mx-auto">
          <div className="flex justify-center flex-col gap-4 p-4">
            <h2 className={`text-[25px] font-semibold ${language === "ar" ? "text-end" : "text-start"}`}>
              {language === "ar" ? "قائمة الاختبارات المعملية" : "Laboratory Test List"}
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
                    الفحوصات_المشمولة: [test.medical_services?.name || "غير متوفر"],
                  }))}
                  tests={tests.map((test) => ({
                    معرف_الفحص: test.medical_services?.id || 0,
                    اسم_الفحص: test.medical_services?.name || "غير متوفر",
                  }))}
                  setSelectedGroup={setSelectedGroup}
                />
              </div>
              <div className="lg:w-[30%] w-full flex justify-end items-center">
                <ActionDropdown />
              </div>
            </div>

            {loading && <p>{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && currentTests.map((test, index) => (
              <AnalysisPackage
                key={index}
                title={test.medical_services?.name || "غير متوفر"}
                subtitle={test.medical_services_category.name}
                onEdit={() => console.log("Editing test with ID:", test.id)}
                onDelete={() => console.log("Deleting test with ID:", test.id)}
                packageData={{
                  price: test.price,
                  open_date: test.open_date,
                  close_date: test.close_date,
                  medical_services_id: test.medical_services.id,
                  medical_services_category_id: test.medical_services_category.id,
                }}
                updatedData_id ={test.id}
              />
            ))}

            {!loading && !error && (
              <Pagination className="mt-8">
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                  </PaginationItem>
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage < totalPages - 1 && <PaginationEllipsis />}
                </PaginationContent>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
              </Pagination>
            )}
          </div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
