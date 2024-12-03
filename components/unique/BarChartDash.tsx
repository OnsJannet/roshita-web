"use client";

import { useState } from "react";
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

// Define datasets for different views
const chartData = {
  day: [
    { date: "6 AM", value: 300 },
    { date: "9 AM", value: 450 },
    { date: "12 PM", value: 400 },
    { date: "3 PM", value: 550 },
    { date: "6 PM", value: 700 },
    { date: "9 PM", value: 600 },
  ],
  week: [
    { date: "Mon", value: 3200 },
    { date: "Tue", value: 2800 },
    { date: "Wed", value: 3400 },
    { date: "Thu", value: 2900 },
    { date: "Fri", value: 3100 },
    { date: "Sat", value: 3700 },
    { date: "Sun", value: 3500 },
  ],
  month: [
    { date: "June 22", value: 1740 },
    { date: "June 23", value: 600 },
    { date: "June 24", value: 1000 },
    { date: "June 25", value: 800 },
    { date: "June 26", value: 1500 },
    { date: "June 27", value: 2000 },
    { date: "June 28", value: 1740 },
  ],
  year: [
    { date: "Jan", value: 40000 },
    { date: "Feb", value: 35000 },
    { date: "Mar", value: 45000 },
    { date: "Apr", value: 30000 },
    { date: "May", value: 50000 },
    { date: "Jun", value: 42000 },
    { date: "Jul", value: 48000 },
    { date: "Aug", value: 52000 },
    { date: "Sep", value: 46000 },
    { date: "Oct", value: 49000 },
    { date: "Nov", value: 43000 },
    { date: "Dec", value: 51000 },
  ],
};

// Chart configuration
const chartConfig = {
  value: {
    label: "Transactions",
    color: "hsl(210, 76%, 66%)", // Blue shade
  },
} satisfies ChartConfig;

export function BarChartDash() {
  const [view, setView] = useState<"day" | "week" | "month" | "year">("month");

  return (
    <Card className="rtl">
      <CardHeader className="flex flex-col justify-start">
        <CardTitle className="text-end ">صافي</CardTitle>
        
        <CardDescription className="text-end">المعاملات</CardDescription>
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
        {["اليوم", "الأسبوع", "الشهر", "السنة"].map((label, index) => {
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
