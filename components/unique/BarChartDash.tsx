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
type View = "day" | "week" | "month" | "year";

interface DayData {
  period: string;
  value: number;
  timestamp: string;
}

interface OtherData {
  date: string;
  value: number;
}

interface ApiResponse {
  totalAmount: number;
  currency: string;
  data: (DayData | OtherData)[];
  lastUpdated: string;
}

const chartConfig = {
  value: {
    label: "المعاملات",
    color: "hsl(210, 76%, 66%)",
  },
} satisfies ChartConfig;

interface TransactionData {
  date: string;
  value: number;
}

export function BarChartDash() {
  const [view, setView] = useState<View>("month");
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<TransactionData[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

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

  const transformData = (data: ApiResponse) => {
    if (!data.data || data.data.length === 0) return [];

    // Check if it's day data by looking for the period property
    if ('period' in data.data[0]) {
      return (data.data as DayData[]).map(item => ({
        date: item.period,
        value: item.value
      }));
    }

    // For other views, data already has the correct format
    return data.data as OtherData[];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('access');
        
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await fetch(
          `https://www.test-roshita.net/api/kpis/transactions/summary?view=${view}&lang=${language}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        const transformedData = transformData(data);
        setChartData(transformedData);
        setTotalAmount(data.totalAmount);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(language === "ar" ? "فشل في تحميل البيانات" : "Failed to load data");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view, language]);

  return (
    <Card className={`flex flex-col h-full ${language === "ar" ? "rtl" : ""}`}>
      <CardHeader className="flex flex-col justify-start pb-0">
        <CardTitle className={language === "ar" ? "text-end" : ""}>
          {language === "ar" ? "صافي" : "Net"}
        </CardTitle>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {language === "ar" ? "المعاملات" : "Transactions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="text-center">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="text-3xl font-bold text-center mb-4">
              {totalAmount.toLocaleString()} {language === "ar" ? "د.ل" : "LYD"}
            </div>
            <ChartContainer config={chartConfig}>
              <BarChart width={300} height={200} data={chartData}>
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
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-around text-sm mt-auto">
        {[
          language === "ar" ? "اليوم" : "Today",
          language === "ar" ? "الأسبوع" : "Week",
          language === "ar" ? "الشهر" : "Month",
          language === "ar" ? "السنة" : "Year",
        ].map((label, index) => {
          const value = ["day", "week", "month", "year"][index] as View;
          return (
            <button
              key={value}
              onClick={() => setView(value)}
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
