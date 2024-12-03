"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const chartData = [
  { date: "2024-04-01", الأطباء: 222, mobile: 150 },
  { date: "2024-04-02", الأطباء: 97, mobile: 180 },
  { date: "2024-04-03", الأطباء: 167, mobile: 120 },
  { date: "2024-04-04", الأطباء: 242, mobile: 260 },
  { date: "2024-04-05", الأطباء: 373, mobile: 290 },
  { date: "2024-04-06", الأطباء: 301, mobile: 340 },
  { date: "2024-04-07", الأطباء: 245, mobile: 180 },
  { date: "2024-04-08", الأطباء: 409, mobile: 320 },
  { date: "2024-04-09", الأطباء: 59, mobile: 110 },
  { date: "2024-04-10", الأطباء: 261, mobile: 190 },
  { date: "2024-04-11", الأطباء: 327, mobile: 350 },
  { date: "2024-04-12", الأطباء: 292, mobile: 210 },
  { date: "2024-04-13", الأطباء: 342, mobile: 380 },
  { date: "2024-04-14", الأطباء: 137, mobile: 220 },
  { date: "2024-04-15", الأطباء: 120, mobile: 170 },
  { date: "2024-04-16", الأطباء: 138, mobile: 190 },
  { date: "2024-04-17", الأطباء: 446, mobile: 360 },
  { date: "2024-04-18", الأطباء: 364, mobile: 410 },
  { date: "2024-04-19", الأطباء: 243, mobile: 180 },
  { date: "2024-04-20", الأطباء: 89, mobile: 150 },
  { date: "2024-04-21", الأطباء: 137, mobile: 200 },
  { date: "2024-04-22", الأطباء: 224, mobile: 170 },
  { date: "2024-04-23", الأطباء: 138, mobile: 230 },
  { date: "2024-04-24", الأطباء: 387, mobile: 290 },
  { date: "2024-04-25", الأطباء: 215, mobile: 250 },
  { date: "2024-04-26", الأطباء: 75, mobile: 130 },
  { date: "2024-04-27", الأطباء: 383, mobile: 420 },
  { date: "2024-04-28", الأطباء: 122, mobile: 180 },
  { date: "2024-04-29", الأطباء: 315, mobile: 240 },
  { date: "2024-04-30", الأطباء: 454, mobile: 380 },
  { date: "2024-05-01", الأطباء: 165, mobile: 220 },
  { date: "2024-05-02", الأطباء: 293, mobile: 310 },
  { date: "2024-05-03", الأطباء: 247, mobile: 190 },
  { date: "2024-05-04", الأطباء: 385, mobile: 420 },
  { date: "2024-05-05", الأطباء: 481, mobile: 390 },
  { date: "2024-05-06", الأطباء: 498, mobile: 520 },
  { date: "2024-05-07", الأطباء: 388, mobile: 300 },
  { date: "2024-05-08", الأطباء: 149, mobile: 210 },
  { date: "2024-05-09", الأطباء: 227, mobile: 180 },
  { date: "2024-05-10", الأطباء: 293, mobile: 330 },
  { date: "2024-05-11", الأطباء: 335, mobile: 270 },
  { date: "2024-05-12", الأطباء: 197, mobile: 240 },
  { date: "2024-05-13", الأطباء: 197, mobile: 160 },
  { date: "2024-05-14", الأطباء: 448, mobile: 490 },
  { date: "2024-05-15", الأطباء: 473, mobile: 380 },
  { date: "2024-05-16", الأطباء: 338, mobile: 400 },
  { date: "2024-05-17", الأطباء: 499, mobile: 420 },
  { date: "2024-05-18", الأطباء: 315, mobile: 350 },
  { date: "2024-05-19", الأطباء: 235, mobile: 180 },
  { date: "2024-05-20", الأطباء: 177, mobile: 230 },
  { date: "2024-05-21", الأطباء: 82, mobile: 140 },
  { date: "2024-05-22", الأطباء: 81, mobile: 120 },
  { date: "2024-05-23", الأطباء: 252, mobile: 290 },
  { date: "2024-05-24", الأطباء: 294, mobile: 220 },
  { date: "2024-05-25", الأطباء: 201, mobile: 250 },
  { date: "2024-05-26", الأطباء: 213, mobile: 170 },
  { date: "2024-05-27", الأطباء: 420, mobile: 460 },
  { date: "2024-05-28", الأطباء: 233, mobile: 190 },
  { date: "2024-05-29", الأطباء: 78, mobile: 130 },
  { date: "2024-05-30", الأطباء: 340, mobile: 280 },
  { date: "2024-05-31", الأطباء: 178, mobile: 230 },
  { date: "2024-06-01", الأطباء: 178, mobile: 200 },
  { date: "2024-06-02", الأطباء: 470, mobile: 410 },
  { date: "2024-06-03", الأطباء: 103, mobile: 160 },
  { date: "2024-06-04", الأطباء: 439, mobile: 380 },
  { date: "2024-06-05", الأطباء: 88, mobile: 140 },
  { date: "2024-06-06", الأطباء: 294, mobile: 250 },
  { date: "2024-06-07", الأطباء: 323, mobile: 370 },
  { date: "2024-06-08", الأطباء: 385, mobile: 320 },
  { date: "2024-06-09", الأطباء: 438, mobile: 480 },
  { date: "2024-06-10", الأطباء: 155, mobile: 200 },
  { date: "2024-06-11", الأطباء: 92, mobile: 150 },
  { date: "2024-06-12", الأطباء: 492, mobile: 420 },
  { date: "2024-06-13", الأطباء: 81, mobile: 130 },
  { date: "2024-06-14", الأطباء: 426, mobile: 380 },
  { date: "2024-06-15", الأطباء: 307, mobile: 350 },
  { date: "2024-06-16", الأطباء: 371, mobile: 310 },
  { date: "2024-06-17", الأطباء: 475, mobile: 520 },
  { date: "2024-06-18", الأطباء: 107, mobile: 170 },
  { date: "2024-06-19", الأطباء: 341, mobile: 290 },
  { date: "2024-06-20", الأطباء: 408, mobile: 450 },
  { date: "2024-06-21", الأطباء: 169, mobile: 210 },
  { date: "2024-06-22", الأطباء: 317, mobile: 270 },
  { date: "2024-06-23", الأطباء: 480, mobile: 530 },
  { date: "2024-06-24", الأطباء: 132, mobile: 180 },
  { date: "2024-06-25", الأطباء: 141, mobile: 190 },
  { date: "2024-06-26", الأطباء: 434, mobile: 380 },
  { date: "2024-06-27", الأطباء: 448, mobile: 490 },
  { date: "2024-06-28", الأطباء: 149, mobile: 200 },
  { date: "2024-06-29", الأطباء: 103, mobile: 160 },
  { date: "2024-06-30", الأطباء: 446, mobile: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  الأطباء: {
    label: "الأطباء",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AreaChartDash() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 flex-row-reverse gap-1 text-center sm:text-left">
          <CardTitle>تحليل عدد الأطباء</CardTitle>
          <CardDescription>
          رصد وتوجهات عدد الأطباء على مدار الأيام
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="40%"
                  stopColor="#1B84FF1A"
                  stopOpacity={2}
                />
                <stop
                  offset="60%"
                  stopColor="#FFFFFF00"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="الأطباء"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="#1B84FF"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
