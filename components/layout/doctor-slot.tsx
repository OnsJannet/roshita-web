import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Table, TableRow, TableCell } from "../ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

type Slot = {
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm
  endTime: string; // Format: HH:mm
  backendFormat: string; // Format: YYYY-MM-DD HH:mm:00
  appointment_status: string;
};

type DateRange = {
  from: Date;
  to: Date;
};

type Language = "ar" | "en";

const translations = {
  en: {
    title: "Doctor Availability Slots",
    selectDate: "Select Date",
    startTime: "Start Time",
    endTime: "End Time",
    duration: "Duration (Hours)",
    addSlot: "Add Slot",
    currentSlots: "Current Slots",
    noSlots: "No slots added yet.",
    remove: "Remove",
    durationError: "Duration is greater than the available time range.",
    date: "Date",
  },
  ar: {
    title: "مواعيد توفر الطبيب",
    selectDate: "اختر التاريخ",
    startTime: "وقت البدء",
    endTime: "وقت الانتهاء",
    duration: "المدة (بالساعات)",
    addSlot: "إضافة موعد",
    currentSlots: "المواعيد الحالية",
    noSlots: "لم تتم إضافة أي مواعيد بعد.",
    remove: "حذف",
    durationError: "المدة أكبر من نطاق الوقت المتاح.",
    date: "التاريخ",
  },
};

type DoctorSlotsProps = {
  onSlotsChange: (slots: Slot[]) => void;
};

const DoctorSlots: React.FC<DoctorSlotsProps> = ({ onSlotsChange }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [language, setLanguage] = useState<Language>("ar");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const t = translations[language]; // Select translation based on language

  const handleAddSlot = () => {
    if (dateRange?.from && dateRange?.to && startTime && endTime) {
      const slotsToAdd: Slot[] = [];
      const currentDate = new Date(dateRange.from);
  
      // Reset time part to avoid timezone issues
      currentDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange.to);
      endDate.setHours(0, 0, 0, 0);
  
      while (currentDate <= endDate) {
        // Use local date formatting
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        const start = new Date(`${dateStr}T${startTime}`);
        const end = new Date(`${dateStr}T${endTime}`);
        const totalDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
        if (totalDuration < duration) {
          alert(t.durationError);
          return;
        }
  
        for (let i = 0; i < Math.floor(totalDuration / duration); i++) {
          const slotStartTime = new Date(start.getTime() + i * duration * 60 * 60 * 1000);
          const slotEndTime = new Date(slotStartTime.getTime() + duration * 60 * 60 * 1000);
  
          // Format backend string in local time
          const backendFormat = `${dateStr} ${slotStartTime.getHours().toString().padStart(2, '0')}:${slotStartTime.getMinutes().toString().padStart(2, '0')}:00`;
  
          slotsToAdd.push({
            date: dateStr,
            startTime: slotStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            endTime: slotEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            backendFormat,
            appointment_status: 'pending',
          });
        }
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      const updatedSlots = [...slots, ...slotsToAdd];
      setSlots(updatedSlots);
      onSlotsChange(updatedSlots);
      setStartTime("");
      setEndTime("");
    }
  };

  const handleRemoveSlot = (index: number) => {
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSlots(updatedSlots);
    onSlotsChange(updatedSlots); // Notify the parent about the updated slots
  };

  return (
    <div className="p-6 space-y-6 bg-white w-full mx-auto border rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {t.title}
      </h2>

      <div className="flex flex-col lg:flex-row justify-center lg:space-x-6 space-y-6 lg:space-y-0">
        <div>
          <label className="block mx-auto items-center text-sm font-medium text-gray-600">
            {t.selectDate}
          </label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              //@ts-ignore
              setDateRange(range || undefined);
            }}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-lg border shadow-sm"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              {t.startTime}
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              {t.endTime}
            </label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              {t.duration}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="rounded-lg border-gray-300"
            >
              {[1, 2, 3, 4, 5, 6].map((hour) => (
                <option key={hour} value={hour}>
                  {hour} Hour{hour > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleAddSlot}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
            disabled={!dateRange?.from || !startTime || !endTime}
          >
            {t.addSlot}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
          {t.currentSlots}
        </h3>
        {slots.length > 0 ? (
          <>
          <Table className="w-full border border-gray-300 rounded-lg shadow-sm divide-y divide-gray-200 text-right">
            <thead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-bold text-gray-700 py-3 px-4 text-right">
                  {t.date}
                </TableCell>
                <TableCell className="font-bold text-gray-700 py-3 px-4 text-right">
                  {t.startTime}
                </TableCell>
                <TableCell className="font-bold text-gray-700 py-3 px-4 text-right">
                  {t.endTime}
                </TableCell>
                <TableCell className="py-3 px-4" />
              </TableRow>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {slots.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((slot, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell className="py-3 px-4 text-right">{slot.date}</TableCell>
                  <TableCell className="py-3 px-4 text-right">{slot.startTime}</TableCell>
                  <TableCell className="py-3 px-4 text-right">{slot.endTime}</TableCell>
                  <TableCell className="py-3 px-4">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveSlot(index)}
                      className="text-white hover:text-red-800"
                    >
                      {t.remove}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(slots.length / itemsPerPage) }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(slots.length / itemsPerPage), prev + 1))}
                    className={currentPage === Math.ceil(slots.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 text-center">{t.noSlots}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSlots;
