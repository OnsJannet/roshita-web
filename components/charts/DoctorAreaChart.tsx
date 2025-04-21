"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { useEffect, useState } from "react";
import LoadingDoctors from "../layout/LoadingDoctors";

type Language = "ar" | "en";

interface ApiResponse {
  doctorId: string;
  data: {
    month: string;
    appointments: number;
    localizedMonth: {
      ar: string;
      en: string;
    };
  }[];
  stats: {
    percentageChange: number;
    trendDirection: string;
    comparisonPeriod: string;
  };
  metadata: {
    period: string;
    lastUpdated: string;
    doctorDetails: {
      name: {
        ar: string;
        en: string;
      };
      specialty: {
        ar: string;
        en: string;
      };
    };
  };
}

const translations = {
  en: {
    title: "Appointment rate this month",
    description: "Showing total appointments for the last 6 months",
    appointments: "Appointments",
    loading: "Loading...",
    error: "Failed to load data",
  },
  ar: {
    title: "معدل المواعيد هذا الشهر",
    description: "عرض إجمالي المواعيد للأشهر الستة الماضية",
    appointments: "المواعيد",
    loading: "جاري التحميل...",
    error: "فشل في تحميل البيانات",
  },
};

export function DoctorAreaChart() {
  const [language, setLanguage] = useState<Language>("ar");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    percentageChange: number;
    trendDirection: string;
  } | null>(null);

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
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId") || "2";
        const accessToken = localStorage.getItem('access');

        const response = await fetch(
          `http://test-roshita.net/api/kpis/doctors/${userId}/appointment-reservation-summary?lang=${language}&period=6m`,
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

        const transformedData = data.data.map((item) => ({
          month: item.localizedMonth[language],
          appointments: item.appointments,
        }));

        setChartData(transformedData);
        setStats({
          percentageChange: data.stats.percentageChange,
          trendDirection: data.stats.trendDirection,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching appointment data:", err);
        setError(translations[language].error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [language]);

  const chartConfig = {
    appointments: {
      label: translations[language].appointments,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col h-full pb-[32px]">
      <CardHeader className="pb-4 flex flex-col justify-start">
        <CardTitle className={language === "ar" ? "text-end" : ""}>
          {translations[language].title}
        </CardTitle>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {translations[language].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <LoadingDoctors />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[200px]">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 10,
                bottom: 10
              }}
              width={undefined}
              height={undefined}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="appointments"
                //type="natural"
                type="linear"
                fill="#17c653"
                fillOpacity={0.4}
                stroke="#17c653"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      {stats && (
        <CardFooter className="flex justify-center items-center">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              {stats.trendDirection === "up" ? "ارتفاع" : "انخفاض"} بنسبة {stats.percentageChange}% هذا الشهر
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}