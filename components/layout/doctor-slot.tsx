import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Table, TableRow, TableCell } from "../ui/table";

type Slot = {
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm
  endTime: string; // Format: HH:mm
  backendFormat: string; // Format: YYYY-MM-DD HH:mm:00
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
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

  const t = translations[language]; // Select translation based on language

  const handleAddSlot = () => {
    if (selectedDate && startTime && endTime) {
      const start = new Date(
        `${selectedDate.toISOString().split("T")[0]}T${startTime}:00`
      );
      const end = new Date(
        `${selectedDate.toISOString().split("T")[0]}T${endTime}:00`
      );
      const totalDuration =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      if (totalDuration < duration) {
        alert(t.durationError);
        return;
      }

      const slotsToAdd: Slot[] = [];

      for (let i = 0; i < Math.floor(totalDuration / duration); i++) {
        const slotStartTime = new Date(
          start.getTime() + i * duration * 60 * 60 * 1000
        );
        const slotEndTime = new Date(
          slotStartTime.getTime() + duration * 60 * 60 * 1000
        );

        const backendFormat = new Date(
          slotStartTime.getTime() -
            slotStartTime.getTimezoneOffset() * 60 * 1000
        )
          .toISOString()
          .replace(".000Z", ":00Z");

        slotsToAdd.push({
          date: selectedDate.toISOString().split("T")[0],
          startTime: slotStartTime.toISOString().split("T")[1].slice(0, 5),
          endTime: slotEndTime.toISOString().split("T")[1].slice(0, 5),
          backendFormat,
        });
      }

      const updatedSlots = [...slots, ...slotsToAdd];
      setSlots(updatedSlots);
      onSlotsChange(updatedSlots); // Notify the parent about the updated slots
      // setSelectedDate(undefined); // Remove this line if you want to retain the selected date
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
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                // Make sure to reset the time to midnight in UTC to avoid time zone shifts
                const utcDate = new Date(
                  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
                );
                setSelectedDate(utcDate);
              }
            }}
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
            disabled={!selectedDate || !startTime || !endTime}
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
          <Table className="w-full border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <TableRow>
                <TableCell className="font-bold text-gray-700">
                  {t.date}
                </TableCell>
                <TableCell className="font-bold text-gray-700">
                  {t.startTime}
                </TableCell>
                <TableCell className="font-bold text-gray-700">
                  {t.endTime}
                </TableCell>
                <TableCell />
              </TableRow>
            </thead>
            <tbody>
              {slots.map((slot, index) => (
                <TableRow key={index}>
                  <TableCell>{slot.date}</TableCell>
                  <TableCell>{slot.startTime}</TableCell>
                  <TableCell>{slot.endTime}</TableCell>
                  <TableCell>
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
        ) : (
          <p className="text-sm text-gray-500 text-center">{t.noSlots}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSlots;
