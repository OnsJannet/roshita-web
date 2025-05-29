"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language = "ar" | "en";

interface AnalyticsData {
  date: string;
  الأطباء: number;
  الحجوزات: number;
}

interface ApiResponse {
  data: AnalyticsData[];
  timeRange: string;
  lastUpdated: string;
}

const getArabicMonth = (month: string): string => {
  const monthMap: { [key: string]: string } = {
    'January': 'يناير',
    'February': 'فبراير',
    'March': 'مارس',
    'April': 'أبريل',
    'May': 'مايو',
    'June': 'يونيو',
    'July': 'يوليو',
    'August': 'أغسطس',
    'September': 'سبتمبر',
    'October': 'أكتوبر',
    'November': 'نوفمبر',
    'December': 'ديسمبر'
  };
  return monthMap[month] || month;
};

export function AreaChartDash() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [language, setLanguage] = React.useState<Language>("ar");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [chartData, setChartData] = React.useState<AnalyticsData[]>([]);

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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('access');
        
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await fetch(
          `https://www.test-roshita.net/api/kpis/analytics/doctors-and-reservation?timeRange=${timeRange}&language=${language}`,
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
        setChartData(data.data);
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
  }, [timeRange, language]);

  const chartConfig = {
    الأطباء: {
      label: language === "ar" ? "الأطباء" : "Doctors",
      color: "#1683c5",
    },
    الحجوزات: {
      label: language === "ar" ? "الحجوزات" : "Reservations",
      color: "#17c653",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 flex-row-reverse gap-1 text-center sm:text-left">
          <CardTitle>
            {language === "ar" ? "تحليل عدد الأطباء والحجوزات" : "Doctors and Reservations Analysis"}
          </CardTitle>
          <CardDescription>
            {language === "ar"
              ? "رصد وتوجهات عدد الأطباء والحجوزات"
              : "Tracking and trends of doctors and reservations"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label={language === "ar" ? "اختر قيمة" : "Select a value"}
          >
            <SelectValue
              placeholder={language === "ar" ? "آخر 3 شهور" : "Last 3 months"}
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              {language === "ar" ? "آخر 3 شهور" : "Last 3 months"}
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              {language === "ar" ? "آخر 30 يومًا" : "Last 30 days"}
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              {language === "ar" ? "آخر 7 أيام" : "Last 7 days"}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[250px] text-red-500">
            {error}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDoctors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="40%" stopColor="#1683c51A" stopOpacity={2} />
                  <stop offset="60%" stopColor="#FFFFFF00" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillReservations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="40%" stopColor="#17c6531A" stopOpacity={2} />
                  <stop offset="60%" stopColor="#FFFFFF00" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const month = date.toLocaleDateString('en-US', { month: 'long' });
                  const day = date.getDate();
                  return language === "ar" 
                    ? `${day} ${getArabicMonth(month)}`
                    : `${month} ${day}`;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'long' });
                      const day = date.getDate();
                      return language === "ar" 
                        ? `${day} ${getArabicMonth(month)}`
                        : `${month} ${day}`;
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="الأطباء"
                type="natural"
                fill="url(#fillDoctors)"
                stroke="#1683c5"
                strokeWidth={2}
              />
              <Area
                dataKey="الحجوزات"
                type="natural"
                fill="url(#fillReservations)"
                stroke="#17c653"
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
