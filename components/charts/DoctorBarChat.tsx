"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
// Removed axios import as we're using fetch API instead

type Language = "ar" | "en";

interface AppointmentStat {
  metric: string;
  value: number;
  localizedLabel: {
    ar: string;
    en: string;
  };
  color: string;
}

interface ApiResponse {
  doctorId: number;
  data: AppointmentStat[];
  stats: {
    percentageChange: number;
    trendDirection: string;
    comparisonPeriod: string;
  };
  metadata: {
    period: string;
    lastUpdated: string;
    doctorName: {
      ar: string;
      en: string;
    };
  };
}

export function DoctorBarChat() {
  const [language, setLanguage] = useState<Language>("ar");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    percentageChange: number;
    trendDirection: string;
  } | null>(null);

  // Dynamic chart config that will be updated with API data
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    patients: { label: "patients" },
  });

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
    const fetchAppointmentStats = async () => {
      try {
        setLoading(true);
        // Get userId from localStorage
        const userId = localStorage.getItem("userId") || "2"; // Default to 2 if not found
        
        // Get access token from localStorage
        const accessToken = localStorage.getItem('access');
        
        // Fetch data from API using fetch with authorization header
        const response = await fetch(
          `https://test-roshita.net/api/kpis/doctors/${userId}/appointment-reservation-stats?lang=${language}&period=6m`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse JSON response
        const data: ApiResponse = await response.json();

        // Transform API data for the chart
        const transformedData = data.data.map((item) => ({
          browser: item.metric,
          patients: item.value,
          fill: item.color,
        }));

        // Create dynamic chart config from API data
        const newChartConfig: ChartConfig = {
          patients: { label: "patients" },
        };

        // Add each metric to the chart config
        data.data.forEach((item) => {
          newChartConfig[item.metric] = {
            label: item.localizedLabel[language],
            color: item.color,
          };
        });

        // Update state with the fetched data
        setChartData(transformedData);
        setChartConfig(newChartConfig);
        setStats({
          percentageChange: data.stats.percentageChange,
          trendDirection: data.stats.trendDirection,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching appointment stats:", err);
        setError("Failed to load appointment statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentStats();
  }, [language]); // Refetch when language changes

  return (
    <Card className="flex flex-col h-full pb-[32px]">
      <CardHeader className="pb-0 flex flex-col justify-start">
        <CardTitle className={language === "ar" ? "text-end" : ""}>
          {language === "ar" ? "المواعيد" : "Appointments"}
        </CardTitle>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {language === "ar"
            ? "إحصائيات لأخر 6 أشهر"
            : "Statistics for the Last 6 Months"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <LoadingDoctors/>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[200px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              width={80}
              height={undefined}
            >
              <YAxis
                dataKey="browser"
                type="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                fontSize={11}
                width={100}
                tickFormatter={(value: string): string =>
                  (chartConfig[value as keyof typeof chartConfig]?.label || value).toString()
                }
              />
              <XAxis dataKey="patients" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="patients" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm items-center text-center">
        {stats && (
          <div className="flex items-center gap-2 font-medium leading-none justify-center text-center">
            {language === "ar"
              ? `${stats.trendDirection === "up" ? "ارتفاع" : "انخفاض"} بنسبة ${stats.percentageChange}% هذا الشهر`
              : `${stats.percentageChange}% ${stats.trendDirection === "up" ? "Increase" : "Decrease"} This Month`}{" "}
            <TrendingUp className={`h-4 w-4 ${stats.trendDirection === "down" ? "rotate-180" : ""}`} />
          </div>
        )}
        <div className="leading-none text-muted-foreground text-center">
          {language === "ar"
            ? "يعرض إجمالي البيانات للأشهر الستة الماضية"
            : "Shows Total Data for the Last 6 Months"}
        </div>
      </CardFooter>
    </Card>
  );
}
