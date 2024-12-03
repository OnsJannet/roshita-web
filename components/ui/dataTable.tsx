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

// Add your new data here
const data: Payment[] = [
  {
    img: "/Images/doctors/pexels-carmel-nsenga-735492-19218034.jpg",
    id: "001",
    دكاترة: "دكتور أحمد سعيد",
    "تاريخ الانضمام": new Date("2024-01-15"),
    التقييم: 4.7,
  },
  {
    img: "/Images/doctors/pexels-ivan-samkov-4989165.jpg",
    id: "002",
    دكاترة: "دكتور فاطمة حسن",
    "تاريخ الانضمام": new Date("2023-08-10"),
    التقييم: 5.0,
  },
  {
    img: "/Images/doctors/pexels-karolina-grabowska-5207098.jpg",
    id: "003",
    دكاترة: "دكتور يوسف طارق",
    "تاريخ الانضمام": new Date("2022-05-05"),
    التقييم: 4.3,
  },
  {
    img: "/Images/doctors/pexels-klaus-nielsen-6303555.jpg",
    id: "004",
    دكاترة: "دكتور ليلى محمد",
    "تاريخ الانضمام": new Date("2024-03-22"),
    التقييم: 4.8,
  },
  {
    img: "/Images/doctors/pexels-klaus-nielsen-6303591.jpg",
    id: "005",
    دكاترة: "دكتور خالد يوسف",
    "تاريخ الانضمام": new Date("2021-12-18"),
    التقييم: 4.2,
  },
  {
    img: "/Images/doctors/pexels-mikewiz-6605090.jpg",
    id: "006",
    دكاترة: "دكتور مريم علي",
    "تاريخ الانضمام": new Date("2024-05-10"),
    التقييم: 4.9,
  },
  {
    img: "/Images/doctors/pexels-pexels-user-1920570806-28755708.jpg",
    id: "007",
    دكاترة: "دكتور عماد مصطفى",
    "تاريخ الانضمام": new Date("2023-11-25"),
    التقييم: 4.6,
  },
  {
    img: "/Images/doctors/pexels-polina-tankilevitch-5234482.jpg",
    id: "008",
    دكاترة: "دكتور ريم محمود",
    "تاريخ الانضمام": new Date("2022-07-19"),
    التقييم: 4.4,
  },
  {
    img: "/Images/doctors/pexels-tima-miroshnichenko-5407206.jpg",
    id: "009",
    دكاترة: "دكتور سامي حسين",
    "تاريخ الانضمام": new Date("2021-09-03"),
    التقييم: 4.1,
  },
  {
    img: "/Images/doctors/pexels-tima-miroshnichenko-6235015.jpg",
    id: "010",
    دكاترة: "دكتور ليلى سامي",
    "تاريخ الانضمام": new Date("2023-02-27"),
    التقييم: 4.5,
  },
];

export type Payment = {
  img: string;
  id: string;
  دكاترة: string;
  "تاريخ الانضمام": Date;
  التقييم: number;
};

export const columns: ColumnDef<Payment>[] = [
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
    header: "دكاترة",
    cell: ({ row }) => {
      const img = row.original.img;
      const name = row.getValue<string>("دكاترة");

      return (
        <div className="flex items-center space-x-3 gap-6">
          <img
            src={img}
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
        تاريخ الانضمام
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
    header: () => <div className="text-right">التقييم</div>,
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
          {halfStar && <Star className="text-yellow-500 h-4 w-4" fill="none" />}
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
      const handleDelete = () => {
        // Your delete logic here
        console.log(`Deleted payment with ID: ${payment.id}`);

        // Reload the page after the delete action
        window.location.reload();
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
                  عرض الملف
                  <File className="h-4 w-4 ml-2" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-right justify-end">
                <Link
                  href={`/dashboard/doctors/edit/${payment.id}`}
                  className="flex"
                >
                  تعديل
                  <PencilLine className="h-4 w-4 ml-2" />
                </Link>
              </DropdownMenuItem>

              {/* Trigger dialog through this button */}
              <DropdownMenuItem
                onClick={openDialog} // Open dialog when user clicks delete
                className="text-right justify-end cursor-pointer"
              >
                حذف
                <Trash2 className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AlertDialog - separate from dropdown */}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-end">
                  تأكيد الحذف
                </AlertDialogTitle>
                <AlertDialogDescription className="text-end">
                  هل أنت متأكد أنك تريد حذف هذا السجل؟ هذه العملية لا يمكن
                  التراجع عنها.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setIsDialogOpen(false)} // Ensure closing the dialog correctly
                >
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-400"
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
          placeholder="فلترة دكاترة..."
          value={(table.getColumn("دكاترة")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("دكاترة")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-right" // Align text to the right
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto">
              {" "}
              {/* Margin shifted to the left */}
              الأعمدة <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <Button variant="register" className="mr-2">
            <Link href="/dashboard/doctors/add">إضافة</Link>
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
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground text-right">
          {table.getFilteredSelectedRowModel().rows.length} من{" "}
          {table.getFilteredRowModel().rows.length} صف (صفوف) مختارة.
        </div>
        <div className="flex items-center justify-between space-x-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2 pr-2">
            {Array.from({ length: table.getPageCount() }, (_, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(index)}
                className={
                  index === table.getState().pagination.pageIndex
                    ? "bg-blue-500 text-white"
                    : ""
                }
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}
