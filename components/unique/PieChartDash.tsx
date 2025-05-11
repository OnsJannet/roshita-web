"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

type Language = "ar" | "en";
type Period = "6m" | "12m";

interface ApiResponse {
  data: {
    metric: string;
    value: number;
    percentage: number;
    localizedLabel: string;
    color: string;
  }[];
  stats: {
    totalCases: number;
    percentageChange: number;
    trendDirection: string;
    comparisonPeriod: string;
  };
  metadata: {
    period: string;
    lastUpdated: string;
  };
}

const translations = {
  en: {
    value: "Value",
    title: "Pie Chart",
    description: "Statistics for the Last",
    months6: "6 Months",
    months12: "12 Months",
    increase: "Increase This Month",
    decrease: "Decrease This Month",
    showsTotal: "Shows Total Data for the Selected Period",
    loading: "Loading...",
    error: "Failed to load data",
  },
  ar: {
    value: "القيمة",
    title: "رسم بياني دائري",
    description: "إحصائيات لأخر",
    months6: "6 أشهر",
    months12: "12 شهر",
    increase: "ارتفاع بنسبة",
    decrease: "انخفاض بنسبة",
    showsTotal: "يعرض إجمالي البيانات للفترة المحددة",
    loading: "جاري التحميل...",
    error: "فشل في تحميل البيانات",
  },
};

export function PieChartDash() {
  const [language, setLanguage] = useState<Language>("ar");
  const [period, setPeriod] = useState<Period>("6m");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('access');
        
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await fetch(
          `http://www.test-roshita.net/api/kpis/hospital/consultation-and-appointment-reservation?lang=${language}&period=${period}`,
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
        
        const transformedData = data.data.map(item => ({
          category: item.localizedLabel,
          value: Math.max(item.value, 1),
          percentage: item.percentage,
          fill: item.color
        }));

        setChartData(transformedData);
        setStats({
          percentageChange: data.stats.percentageChange,
          trendDirection: data.stats.trendDirection
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(translations[language].error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, period]);

  const handlePeriodChange = (value: Period) => {
    setPeriod(value);
  };

  // Create dynamic chart config from the data
  const chartConfig: ChartConfig = {
    value: {
      label: translations[language].value,
    },
    ...Object.fromEntries(
      chartData.map(item => [
        item.category,
        {
          label: item.category,
          color: item.fill,
        },
      ])
    ),
  };

  return (
    <Card className="flex flex-col h-full pb-[32px]">
      <CardHeader className="pb-0 flex flex-col justify-start">
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-2 ${language === "ar" ? "sm:flex-row-reverse" : ""}`}>
          <CardTitle className={`${language === "ar" ? "text-end" : ""} w-full`}>
            {language === "ar" ? translations.ar.title : translations.en.title}
          </CardTitle>
          <Select value={period} onValueChange={handlePeriodChange as (value: string) => void}>
            <SelectTrigger className="w-[120px] sm:w-[100px]">
              <SelectValue placeholder={period === "6m" ? 
                (language === "ar" ? translations.ar.months6 : translations.en.months6) : 
                (language === "ar" ? translations.ar.months12 : translations.en.months12)} 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">{language === "ar" ? translations.ar.months6 : translations.en.months6}</SelectItem>
              <SelectItem value="12m">{language === "ar" ? translations.ar.months12 : translations.en.months12}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {language === "ar" 
            ? `${translations.ar.description} ${period === "6m" ? translations.ar.months6 : translations.ar.months12}`
            : `${translations.en.description} ${period === "6m" ? translations.en.months6 : translations.en.months12}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <p>{translations[language].loading}</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] w-full"
          >
            <RadialBarChart
              data={chartData}
              startAngle={-90}
              endAngle={380}
              innerRadius="30%"
              outerRadius="80%"
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="category" />}
              />
              <RadialBar dataKey="value" background>
                <LabelList
                  position="insideStart"
                  dataKey="category"
                  className="fill-white capitalize mix-blend-luminosity text-xs sm:text-sm"
                  fontSize={11}
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm px-4 sm:px-6">
        {stats && (
          <div className="flex items-center justify-center gap-2 font-medium leading-none w-full">
            {language === "ar"
              ? `${stats.trendDirection === "up" ? translations.ar.increase : translations.ar.decrease} ${stats.percentageChange}%`
              : `${stats.percentageChange}% ${stats.trendDirection === "up" ? translations.en.increase : translations.en.decrease}`}{" "}
            <TrendingUp className={`h-4 w-4 ${stats.trendDirection === "down" ? "rotate-180" : ""}`} />
          </div>
        )}
        <div className="leading-none text-muted-foreground text-center w-full">
          {language === "ar"
            ? translations.ar.showsTotal
            : translations.en.showsTotal}
        </div>
      </CardFooter>
    </Card>
  );
}