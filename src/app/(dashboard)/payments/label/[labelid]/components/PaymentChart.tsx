"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the types for the props
type PaymentData = {
  _id: string;
  labelId: string;
  amount: string;
  status: boolean;
  time: string;
};

type PaymentChartProps = {
  data: PaymentData[];
  totalPayout: number;
  availableBalance: number;
};

// Define the type for the formatted chart data
type ChartData = {
  date: string;
  amount: number;
};

// Update the chart config to fit your data
const chartConfig = {
  amount: {
    label: "Total Earnings",
    color: "#2563eb",
  },
} satisfies ChartConfig;

// Function to convert the data to the chartData format
const formatChartData = (data: PaymentData[]): ChartData[] => {
  return data.map((item: PaymentData) => ({
    date: new Date(item.time).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    amount: parseFloat(item.amount),
  }));
};

export function PaymentChart({
  data,
  totalPayout,
  availableBalance,
}: PaymentChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("amount");

  // Format the data for the chart
  const chartData = React.useMemo(() => formatChartData(data), [data]);

  // Calculate the total amount
  const total = React.useMemo(
    () =>
      chartData.reduce(
        (acc: number, curr: { amount: number }) => acc + curr.amount,
        0
      ),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Earning Chart</CardTitle>
          <CardDescription>Showing total earning</CardDescription>
        </div>
        <div className="flex">
          <button
            data-active={true}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-m text-muted-foreground">
              {chartConfig.amount.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              ₹{total.toLocaleString()}
            </span>
          </button>

          <button
            data-active={true}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-m text-muted-foreground">Total Payout</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              ₹{totalPayout.toLocaleString()}
            </span>
          </button>

          <button
            data-active={true}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-m text-muted-foreground">
              Available Earning
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              ₹{availableBalance.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="amount"
                  labelFormatter={(value) => {
                    return value;
                  }}
                />
              }
            />
            <Bar dataKey="amount" fill={`var(--color-amount)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
