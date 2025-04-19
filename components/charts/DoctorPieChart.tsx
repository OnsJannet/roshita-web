"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

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

interface ConsultationAppointmentStat {
  metric: string;
  value: number;
  percentage: number;
  color: string;
  localizedLabel: {
    ar: string;
    en: string;
  };
}

interface ApiResponse {
  doctorId: number;
  data: ConsultationAppointmentStat[];
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

const translations = {
  en: {
    value: "Value",
    doctors: "Consultation cases",
    tests: "Appointment booking cases",
    loading: "Loading...",
    error: "Failed to load data",
    title: "Consultation & Appointments",
    description: "Statistics for the Last 6 Months",
    increase: "Increase",
    decrease: "Decrease",
    thisMonth: "This Month",
    showsTotal: "Shows Total Data for the Last 6 Months"
  },
  ar: {
    value: "القيمة",
    doctors: "حالات استشارة",
    tests: "حالات حجز موعد",
    loading: "جاري التحميل...",
    error: "فشل في تحميل البيانات",
    title: "الاستشارات والمواعيد",
    description: "إحصائيات لأخر 6 أشهر",
    increase: "ارتفاع",
    decrease: "انخفاض",
    thisMonth: "هذا الشهر",
    showsTotal: "يعرض إجمالي البيانات للأشهر الستة الماضية"
  },
};

export function DoctorPieChart() {
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
    value: {
      label: translations[language].value,
    },
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
    const fetchConsultationAppointmentData = async () => {
      try {
        setLoading(true);
        // Get userId from localStorage
        const userId = localStorage.getItem("userId") || "2"; // Default to 2 if not found
        
        // Get access token from localStorage
        const accessToken = localStorage.getItem('access');
        
        // Fetch data from API using fetch with authorization header
        const response = await fetch(
          `http://test-roshita.net/api/kpis/doctors/${userId}/consultation-and-appointment-reservation?lang=${language}&period=6m`,
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

        // Log the API response for debugging
        console.log('API Response:', data);
        
        // Transform API data for the chart
        const transformedData = data.data.map((item) => ({
          category: item.localizedLabel[language],
          value: item.value,
          percentage: item.percentage,
          fill: item.color,
        }));
        
        // Ensure we have data to display even if all values are 0
        if (transformedData.every(item => item.value === 0)) {
          // If all values are 0, use percentage values for visualization
          transformedData.forEach(item => {
            item.value = Math.max(item.percentage, 1); // Use percentage or minimum of 1 to make segment visible
          });
        }
        
        console.log('Transformed chart data:', transformedData);

        // Create dynamic chart config from API data
        const newChartConfig: ChartConfig = {
          value: {
            label: translations[language].value,
          },
        };

        // Add each type to the chart config
        data.data.forEach((item) => {
          newChartConfig[item.localizedLabel[language]] = {
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
        console.error("Error fetching consultation and appointment data:", err);
        setError("Failed to load data");
        // Set empty chart data
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationAppointmentData();
  }, [language]); // Refetch when language changes

  return (
    <Card className="flex flex-col h-full pb-[32px]">
      <CardHeader className="pb-0 flex flex-col justify-start">
        <CardTitle className={language === "ar" ? "text-end" : ""}>
          {language === "ar" ? translations.ar.title : translations.en.title}
        </CardTitle>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {language === "ar" ? translations.ar.description : translations.en.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[183px]">
            <LoadingDoctors />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[183px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[183px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={-90}
              endAngle={380}
              innerRadius={30}
              outerRadius={110}
              barSize={20}
              //@ts-ignore
              minAngle={15}
            >
              <ChartTooltip
                cursor={false}
                //@ts-ignore
                content={<ChartTooltipContent nameKey="category" valueKey="percentage" formatter={(value: any) => `${value}`} />}
              />
              <RadialBar dataKey="value" background>
                <LabelList
                  position="insideStart"
                  dataKey="category"
                  className="fill-white capitalize mix-blend-luminosity"
                  fontSize={11}
                />
                <LabelList
                  position="outside"
                  dataKey="percentage"
                  formatter={(value: number) => `${value}%`}
                  fontSize={10}
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {stats && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {language === "ar"
              ? `${stats.trendDirection === "up" ? translations.ar.increase : translations.ar.decrease} بنسبة ${stats.percentageChange}% ${translations.ar.thisMonth}`
              : `${stats.percentageChange}% ${stats.trendDirection === "up" ? translations.en.increase : translations.en.decrease} ${translations.en.thisMonth}`}{" "}
            <TrendingUp className={`h-4 w-4 ${stats.trendDirection === "down" ? "rotate-180" : ""}`} />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          {language === "ar" ? translations.ar.showsTotal : translations.en.showsTotal}
        </div>
      </CardFooter>
    </Card>
  );
}
