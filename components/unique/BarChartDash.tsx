"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Language = "ar" | "en";

// Define datasets for different views



// Chart configuration
const chartConfig = {
  value: {
    label: "المعاملات",
    color: "hsl(210, 76%, 66%)", // Blue shade
  },
} satisfies ChartConfig;

export function BarChartDash() {
  const [view, setView] = useState<"day" | "week" | "month" | "year">("month");
  const [language, setLanguage] = useState<Language>("ar");

  const chartData = {
    day: [
      { date: language === "ar" ? "6 صباحًا" : "6 AM", value: 300 },
      { date: language === "ar" ? "9 صباحًا" : "9 AM", value: 450 },
      { date: language === "ar" ? "12 ظهرًا" : "12 PM", value: 400 },
      { date: language === "ar" ? "3 مساءً" : "3 PM", value: 550 },
      { date: language === "ar" ? "6 مساءً" : "6 PM", value: 700 },
      { date: language === "ar" ? "9 مساءً" : "9 PM", value: 600 },
    ],
    week: [
      { date: language === "ar" ? "الإثنين" : "Mon", value: 3200 },
      { date: language === "ar" ? "الثلاثاء" : "Tue", value: 2800 },
      { date: language === "ar" ? "الأربعاء" : "Wed", value: 3400 },
      { date: language === "ar" ? "الخميس" : "Thu", value: 2900 },
      { date: language === "ar" ? "الجمعة" : "Fri", value: 3100 },
      { date: language === "ar" ? "السبت" : "Sat", value: 3700 },
      { date: language === "ar" ? "الأحد" : "Sun", value: 3500 },
    ],
    month: [
      { date: language === "ar" ? "22 يونيو" : "June 22", value: 1740 },
      { date: language === "ar" ? "23 يونيو" : "June 23", value: 600 },
      { date: language === "ar" ? "24 يونيو" : "June 24", value: 1000 },
      { date: language === "ar" ? "25 يونيو" : "June 25", value: 800 },
      { date: language === "ar" ? "26 يونيو" : "June 26", value: 1500 },
      { date: language === "ar" ? "27 يونيو" : "June 27", value: 2000 },
      { date: language === "ar" ? "28 يونيو" : "June 28", value: 1740 },
    ],
    year: [
      { date: language === "ar" ? "يناير" : "Jan", value: 40000 },
      { date: language === "ar" ? "فبراير" : "Feb", value: 35000 },
      { date: language === "ar" ? "مارس" : "Mar", value: 45000 },
      { date: language === "ar" ? "أبريل" : "Apr", value: 30000 },
      { date: language === "ar" ? "مايو" : "May", value: 50000 },
      { date: language === "ar" ? "يونيو" : "Jun", value: 42000 },
      { date: language === "ar" ? "يوليو" : "Jul", value: 48000 },
      { date: language === "ar" ? "أغسطس" : "Aug", value: 52000 },
      { date: language === "ar" ? "سبتمبر" : "Sep", value: 46000 },
      { date: language === "ar" ? "أكتوبر" : "Oct", value: 49000 },
      { date: language === "ar" ? "نوفمبر" : "Nov", value: 43000 },
      { date: language === "ar" ? "ديسمبر" : "Dec", value: 51000 },
    ],
  };

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

  return (
    <Card className={language === "ar" ? "rtl" : ""}>
    <CardHeader className="flex flex-col justify-start">
      <CardTitle className={language === "ar" ? "text-end" : ""}>
        {language === "ar" ? "صافي" : "Net"}
      </CardTitle>
      <CardDescription className={language === "ar" ? "text-end" : ""}>
        {language === "ar" ? "المعاملات" : "Transactions"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-center mb-4">$9,395.72</div>
      <ChartContainer config={chartConfig}>
        <BarChart width={300} height={200} data={chartData[view]}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="value" fill="hsl(210, 76%, 66%)" radius={4} />
        </BarChart>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex justify-around text-sm">
      {[
        language === "ar" ? "اليوم" : "Today",
        language === "ar" ? "الأسبوع" : "Week",
        language === "ar" ? "الشهر" : "Month",
        language === "ar" ? "السنة" : "Year",
      ].map((label, index) => {
        const value = ["day", "week", "month", "year"][index];
        return (
          <button
            key={value}
            onClick={() => setView(value as "day" | "week" | "month" | "year")}
            className={`px-4 py-2 rounded ${
              view === value ? "bg-gray-300 font-bold" : "bg-gray-100"
            }`}
          >
            {label}
          </button>
        );
      })}
    </CardFooter>
  </Card>
  
  );
}
