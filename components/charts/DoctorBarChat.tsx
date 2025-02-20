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

type Language = "ar" | "en";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "متابعة المريض", color: "hsl(var(--chart-1))" },
  safari: { label: "معدل حضور المريض للمواعيد", color: "hsl(var(--chart-2))" },
  firefox: {
    label: "معدل الغاء الموعد من المريض",
    color: "hsl(var(--chart-3))",
  },
  edge: { label: "معدل الغاء الموعد من الدكتور", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export function DoctorBarChat() {
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

  return (
    <Card className="flex flex-col pb-[32px]">
      <CardHeader className="pb-0 flex flex-col justify-start mb-10">
        <CardTitle className={language === "ar" ? "text-end" : ""}>
          {language === "ar" ? "المواعيد" : "Pie Chart"}
        </CardTitle>
        <CardDescription className={language === "ar" ? "text-end" : ""}>
          {language === "ar"
            ? "إحصائيات لأخر 6 أشهر"
            : "Statistics for the Last 6 Months"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
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
