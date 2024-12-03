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

// Updated fake data for doctors, tests, and X-rays
const chartData = [
  { category: "الأطباء", value: 50, fill: "#FF6F1E" }, // Doctors
  { category: "التحاليل", value: 35, fill: "#17C653" }, // Tests
  { category: "الأشعة", value: 25, fill: "#7239EA" }, // X-rays
];

// Updated chart configuration with new labels and colors
const chartConfig = {
  value: {
    label: "القيمة",
  },
  الأطباء: {
    label: "الأطباء",
    color: "#FF6F1E",
  },
  التحاليل: {
    label: "التحاليل",
    color: "#17C653",
  },
  الأشعة: {
    label: "الأشعة",
    color: "#7239EA",
  },
} satisfies ChartConfig;

export function PieChartDash() {
  return (
    <Card className="flex flex-col pb-[30px]">
      <CardHeader className=" pb-0 flex flex-col justify-start">
        <CardTitle className="text-end">رسم بياني دائري</CardTitle>
        <CardDescription className="text-end">إحصائيات لأخر 6 أشهر</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
          ارتفاع بنسبة 5.2% هذا الشهر <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          يعرض إجمالي البيانات للأشهر الستة الماضية
        </div>
      </CardFooter>
    </Card>
  );
}
