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

type Language = "ar" | "en";

const translations = {
  en: {
    title: "Appointment rate this month",
    description: "Showing total visitors for the last 6 months",
    trending: "Trending up by 5.2% this month",
    dateRange: "January - June 2024",
    desktop: "Desktop",
    mobile: "Mobile",
  },
  ar: {
    title: "معدل المواعيد هذا الشهر",
    description: "عرض إجمالي الزوار للأشهر الستة الماضية",
    trending: "ارتفاع بنسبة 5.2% هذا الشهر",
    dateRange: "يناير - يونيو 2024",
    desktop: "سطح المكتب",
    mobile: "الهاتف المحمول",
  },
};

export function DoctorAreaChart() {
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

  const chartData = [
    { month: language === "ar" ? "يناير" : "January", desktop: 186 },
    { month: language === "ar" ? "فبراير" : "February", desktop: 305 },
    { month: language === "ar" ? "مارس" : "March", desktop: 237 },
    { month: language === "ar" ? "أبريل" : "April", desktop: 73 },
    { month: language === "ar" ? "مايو" : "May", desktop: 209 },
    { month: language === "ar" ? "يونيو" : "June", desktop: 214 },
  ];

  const chartConfig = {
    desktop: {
      label: translations[language].desktop,
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: translations[language].mobile,
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col pb-[32px]">
      <CardHeader className="pb-0 flex flex-col justify-start mb-10">
        <CardTitle className={language === "ar" ? "text-end" : ""}>
          {translations[language].title}
        </CardTitle>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {translations[language].description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
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
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {translations[language].trending} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {translations[language].dateRange}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
