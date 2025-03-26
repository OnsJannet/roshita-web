"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  File,
  MoreHorizontal,
  PencilLine,
  Star,
  Trash2,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

type Language = "ar" | "en";

// Add your new data here
const doctorData: APIResponse = {
  count: 10,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      staff: {
        first_name: "أحمد",
        last_name: "سعيد",
        staff_avatar:
          "/Images/doctors/pexels-carmel-nsenga-735492-19218034.jpg",
        medical_organization: "مستشفى النيل",
        city: "القاهرة",
        address: "شارع التحرير، الجيزة",
      },
      specialty: 101,
      fixed_price: "500",
      rating: 4.7,
      is_consultant: true,
    },
    {
      id: 2,
      staff: {
        first_name: "فاطمة",
        last_name: "حسن",
        staff_avatar: "/Images/doctors/pexels-ivan-samkov-4989165.jpg",
        medical_organization: "مستشفى المدينة",
        city: "الإسكندرية",
        address: "شارع سيدي بشر، الإسكندرية",
      },
      specialty: 102,
      fixed_price: "400",
      rating: 5.0,
      is_consultant: false,
    },
    {
      id: 3,
      staff: {
        first_name: "يوسف",
        last_name: "طارق",
        staff_avatar: "/Images/doctors/pexels-karolina-grabowska-5207098.jpg",
        medical_organization: "مستشفى الأمل",
        city: "طنطا",
        address: "شارع 23 يوليو، طنطا",
      },
      specialty: 103,
      fixed_price: "300",
      rating: 4.3,
      is_consultant: true,
    },
    {
      id: 4,
      staff: {
        first_name: "ليلى",
        last_name: "محمد",
        staff_avatar: "/Images/doctors/pexels-klaus-nielsen-6303555.jpg",
        medical_organization: "مستشفى السعادة",
        city: "دمياط",
        address: "شارع بورسعيد، دمياط",
      },
      specialty: 104,
      fixed_price: "450",
      rating: 4.8,
      is_consultant: false,
    },
    {
      id: 5,
      staff: {
        first_name: "خالد",
        last_name: "يوسف",
        staff_avatar: "/Images/doctors/pexels-klaus-nielsen-6303591.jpg",
        medical_organization: "مستشفى الإيمان",
        city: "المنصورة",
        address: "شارع عبد السلام عارف، المنصورة",
      },
      specialty: 105,
      fixed_price: "550",
      rating: 4.2,
      is_consultant: true,
    },
    {
      id: 6,
      staff: {
        first_name: "مريم",
        last_name: "علي",
        staff_avatar: "/Images/doctors/pexels-mikewiz-6605090.jpg",
        medical_organization: "مستشفى الشفاء",
        city: "الزقازيق",
        address: "شارع سعد زغلول، الزقازيق",
      },
      specialty: 106,
      fixed_price: "350",
      rating: 4.9,
      is_consultant: false,
    },
    {
      id: 7,
      staff: {
        first_name: "عماد",
        last_name: "مصطفى",
        staff_avatar:
          "/Images/doctors/pexels-pexels-user-1920570806-28755708.jpg",
        medical_organization: "مستشفى الرياض",
        city: "القاهرة",
        address: "شارع الهرم، الجيزة",
      },
      specialty: 107,
      fixed_price: "600",
      rating: 4.6,
      is_consultant: true,
    },
    {
      id: 8,
      staff: {
        first_name: "ريم",
        last_name: "محمود",
        staff_avatar: "/Images/doctors/pexels-polina-tankilevitch-5234482.jpg",
        medical_organization: "مستشفى المستقبل",
        city: "أسيوط",
        address: "شارع الجمهورية، أسيوط",
      },
      specialty: 108,
      fixed_price: "470",
      rating: 4.4,
      is_consultant: false,
    },
    {
      id: 9,
      staff: {
        first_name: "سامي",
        last_name: "حسين",
        staff_avatar: "/Images/doctors/pexels-tima-miroshnichenko-5407206.jpg",
        medical_organization: "مستشفى النور",
        city: "طنطا",
        address: "شارع 23 يوليو، طنطا",
      },
      specialty: 109,
      fixed_price: "400",
      rating: 4.1,
      is_consultant: true,
    },
    {
      id: 10,
      staff: {
        first_name: "ليلى",
        last_name: "سامي",
        staff_avatar: "/Images/doctors/pexels-tima-miroshnichenko-6235015.jpg",
        medical_organization: "مستشفى دار الشفاء",
        city: "القاهرة",
        address: "شارع الميرغني، القاهرة",
      },
      specialty: 110,
      fixed_price: "510",
      rating: 4.5,
      is_consultant: false,
    },
  ],
};

export type Payment = {
  img: string;
  id: string;
  دكاترة: string;
  "تاريخ الانضمام": Date;
  التقييم: number;
};

interface DoctorStaff {
  first_name: string;
  last_name: string;
  staff_avatar: string;
  medical_organization: string;
  city: string;
  address: string;
}

interface Doctor {
  id: number;
  staff: DoctorStaff;
  specialty?: number;
  fixed_price?: string;
  rating?: number;
  is_consultant: boolean;
}

interface APIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Doctor[];
}

export function DataTable({
  data,
  onPageChange,
  lengthData,
}: {
  data: Payment[];
  lengthData: number;
  onPageChange?: (page: number) => void;
}) {
  // Log data whenever the component renders
  React.useEffect(() => {
    console.log("Data passed to the table:", data);
  }, [data]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [language, setLanguage] = React.useState<Language>("ar");

  React.useEffect(() => {
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

  const [currentPage, setCurrentPage] = React.useState(0); // Tracks the current page
  const rowsPerPage = 5; // Rows per page

  // Calculate paginated data
  const paginatedData = data.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // Notify parent component of page change
  React.useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage + 1); // Send 1-based index to parent
    }
  }, [currentPage, onPageChange]);

  const pageCount = Math.ceil(lengthData / rowsPerPage);
  console.log("data: " + lengthData);
  console.log("pageCount: " + pageCount);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSelect = (index: number) => {
    setCurrentPage(index);
  };
  

  const columns: ColumnDef<Payment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mr-2" // Add left margin here
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mr-2" // Add left margin here
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "دكاترة",
      header: language === "ar" ? "دكاترة" : "Doctors",
      cell: ({ row }) => {
        const img = row.original.img?.replace(/^http:/, "https:");

        const name = row.getValue<string>("دكاترة");

        return (
          <div className="flex items-center space-x-3 gap-6">

              <img
                src={
                  img &&
                  img !== null &&
                  !img.startsWith("/media/media/") &&
                  !img.startsWith("/avatar/")
                    ? img
                    : "/Images/default-doctor.jpeg"
                }
                alt={name}
                className="h-10 w-10 rounded-full object-cover"
              />

            <span className="capitalize">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "تاريخ الانضمام",
      header: ({ column }) => (
        <Button
          className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="pl-2" />
          {localStorage.getItem("language") === "ar"
            ? "تاريخ الانضمام"
            : "Join Date"}
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue<Date>("تاريخ الانضمام");
        const formattedDate = date
          ? new Intl.DateTimeFormat("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(date)
          : "—";

        return <div className="lowercase pr-6">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "التقييم",
      header: () => (
        <div className="text-right">
          {" "}
          {language === "ar" ? "التقييم" : "Rating"}
        </div>
      ),
      cell: ({ row }) => {
        const rating = parseFloat(row.getValue("التقييم"));
        const maxStars = 5;
        const filledStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = maxStars - filledStars - (halfStar ? 1 : 0);

        return (
          <div className="flex justify-start items-center space-x-1">
            {Array.from({ length: filledStars }).map((_, i) => (
              <Star
                key={`filled-${i}`}
                className="text-yellow-500 h-4 w-4"
                fill="currentColor"
              />
            ))}
            {halfStar && (
              <Star className="text-yellow-500 h-4 w-4" fill="none" />
            )}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star
                key={`empty-${i}`}
                className="text-gray-400 h-4 w-4"
                fill="none"
              />
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;
        const [isDialogOpen, setIsDialogOpen] = React.useState(false);
        const handleDelete = async (id: number) => {
          try {
            const accessToken = localStorage.getItem("access"); // Get the token from localStorage
            const response = await fetch(`/api/doctors/removeDoctor?id=${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`, // Add the Authorization header with the token
              },
            });
            if (response.ok) {
              console.log(`Deleted doctor with ID: ${id}`);
              // Refresh the page or update the list to reflect the changes
              //window.location.reload();
            } else {
              console.error("Failed to delete doctor");
            }
          } catch (error) {
            console.error("Error deleting doctor:", error);
          }
        };

        const openDialog = () => {
          setIsDialogOpen(true); // Open dialog when user clicks delete
        };

        return (
          <>
            {/* Dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-right justify-end">
                  <Link
                    href={`/dashboard/doctors/${payment.id}`}
                    className="flex"
                  >
                    {language === "ar" ? "عرض الملف" : "View Profile"}
                    <File className="h-4 w-4 ml-2" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-right justify-end">
                  <Link
                    href={`/dashboard/doctors/edit/${payment.id}`}
                    className="flex"
                  >
                    {language === "ar" ? "تعديل" : "Edit"}
                    <PencilLine className="h-4 w-4 ml-2" />
                  </Link>
                </DropdownMenuItem>

                {/* Trigger dialog through this button */}
                <DropdownMenuItem
                  onClick={openDialog} // Open dialog when user clicks delete
                  className="text-right justify-end cursor-pointer"
                >
                  {language === "ar" ? "حذف" : "Delete"}
                  <Trash2 className="h-4 w-4 ml-2" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AlertDialog - separate from dropdown */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    {language === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    {language === "ar"
                      ? "هل أنت متأكد أنك تريد حذف هذا السجل؟ هذه العملية لا يمكن التراجع عنها."
                      : "Are you sure you want to delete this record? This action cannot be undone."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!justify-center">
                  <AlertDialogCancel
                    onClick={() => setIsDialogOpen(false)} // Ensure closing the dialog correctly
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(Number(payment.id))}
                    className="bg-red-600 hover:bg-red-400"
                  >
                    {language === "ar" ? "حذف" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="max-w-[1280px] mx-auto " dir="rtl">
      {" "}
      {/* Apply RTL direction */}
      <div className="flex items-center py-4">
        <Input
          placeholder={
            language === "ar" ? "فلترة دكاترة..." : "Filter Doctors..."
          }
          value={(table.getColumn("دكاترة")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("دكاترة")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-right" // Align text to the right
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto">
              {language === "ar" ? "الأعمدة" : "Columns"} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <Button variant="register" className="mr-2">
            <Link href="/dashboard/doctors/add">
              {language === "ar" ? "إضافة" : "Add"}
            </Link>
          </Button>
          <DropdownMenuContent align="start">
            {" "}
            {/* Align menu to the start */}
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-right">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-right">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {language === "ar" ? "لا توجد نتائج." : "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground text-right">
          {language === "ar"
            ? `${table.getFilteredSelectedRowModel().rows.length} من ${
                table.getFilteredRowModel().rows.length
              } صف (صفوف) مختارة.`
            : `${table.getFilteredSelectedRowModel().rows.length} of ${
                table.getFilteredRowModel().rows.length
              } row(s) selected.`}
        </div>
        <div className="flex items-center justify-between space-x-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`pagination-btn ${currentPage === 0 ? "disabled" : ""}`}
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2 pr-2 gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageSelect(index)}
                className={`px-3  py-1 ${
                  currentPage === index
                    ? "bg-[#71c9f9] text-white rounded-md"
                    : "bg-gray-100 rounded-md"
                }`}
              >
                {index + 1} {/* Correctly display the page number */}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === pageCount - 1}
          >
            {language === "ar" ? "التالي" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
