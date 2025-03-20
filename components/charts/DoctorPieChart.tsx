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

type Language = "ar" | "en";

const translations = {
  en: {
    value: "Value",
    doctors: "Consultation cases",
    tests: "Appointment booking cases",
  },
  ar: {
    value: "القيمة",
    doctors: "حالات استشارة",
    tests: "حالات حجز موعد",
  },
};

export function DoctorPieChart() {
  const [language, setLanguage] = useState<Language>("ar");
  // Updated fake data for doctors, tests, and X-rays
  const chartData = [
    { category: translations[language].doctors, value: 50, fill: "#FF6F1E" }, // Doctors
    { category: translations[language].tests, value: 35, fill: "#17C653" }, // Tests
  ];

  // Updated chart configuration with dynamic labels and colors based on language
  const chartConfig = {
    value: {
      label: translations[language].value,
    },
    [translations[language].doctors]: {
      label: translations[language].doctors,
      color: "#FF6F1E",
    },
    [translations[language].tests]: {
      label: translations[language].tests,
      color: "#17C653",
    },
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
    <Card className="flex flex-col pb-[32px]">
<CardHeader className="pb-0 flex flex-col justify-start mb-10">


<CardTitle className={language === "ar" ? "text-end" : ""}>
          {language === "ar" ? "رسم بياني دائري" : "Pie Chart"}
        </CardTitle>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {language === "ar"
            ? "إحصائيات لأخر 6 أشهر"
            : "Statistics for the Last 6 Months"}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="category" />}
            />
            <RadialBar dataKey="value" background>
              <LabelList
                position="insideStart"
                dataKey="category"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {language === "ar"
            ? "ارتفاع بنسبة 5.2% هذا الشهر"
            : "5.2% Increase This Month"}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {language === "ar"
            ? "يعرض إجمالي البيانات للأشهر الستة الماضية"
            : "Shows Total Data for the Last 6 Months"}
        </div>
      </CardFooter>
    </Card>
  );
}
