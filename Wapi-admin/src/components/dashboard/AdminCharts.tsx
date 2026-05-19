"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/elements/ui/card";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TrendingUp, PieChart as PieChartIcon, Target } from "lucide-react";
import { useAppSelector } from "@/src/redux/hooks";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AdminChartsProps {
  planRevenue: Array<{
    _id: string;
    totalRevenue: number;
    count: number;
  }>;
  revenueGraph: Array<{
    _id: string;
    totalRevenue: number;
    transactionCount: number;
  }>;
}

export const PlanRevenueChart = ({ planRevenue }: { planRevenue: AdminChartsProps["planRevenue"] }) => {
  const series = planRevenue.map((p) => p.totalRevenue);
  const labels = planRevenue.map((p) => p._id);
  const settings = useAppSelector((state) => state.settings.data);
  const defaultSymbol = settings?.default_currency?.symbol || "$";

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
    },
    labels: labels,
    colors: ["var(--primary)", "var(--chart-teal)", "var(--chart-warning)", "var(--chart-danger)", "var(--chart-purple)", "var(--chart-pink)"],
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      fontWeight: 700,
      labels: { colors: "var(--muted-text-color)" },
      markers: { size: 6 },
      itemMargin: { vertical: 4 },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "82%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "TOTAL REVENUE",
              formatter: () => defaultSymbol + " " + series.reduce((a, b) => a + b, 0).toLocaleString(),
              color: "var(--muted-text-color)",
              fontSize: "10px",
              fontWeight: 900,
            },
            value: {
              fontSize: "24px",
              fontWeight: 900,
              color: "var(--primary)",
              offsetY: 4,
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (v) => defaultSymbol + " " + v.toLocaleString() },
    },
  };

  return (
    <Card className="border-none! dark:border-(--card-border-color) bg-white/70 dark:bg-(--card-color) shadow-sm h-full group overflow-hidden">
      <CardHeader className="pb-2 sm:p-6 p-4 relative z-10 border-b border-(--input-border-color) dark:border-(--card-border-color)">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform duration-500">
            <PieChartIcon size={18} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-[19px] font-medium text-slate-800 dark:text-white">Revenue by Plan</CardTitle>
            <CardDescription className="text-[14px] font-medium text-slate-400 dark:text-gray-400">Revenue by tier</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 mt-5">
        <div className="h-75 flex flex-col justify-center">
          <ReactApexChart options={options} series={series} type="donut" height={320} />
        </div>
      </CardContent>

      {/* Decorative pulse element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
    </Card>
  );
};

export const RevenueTimelineChart = ({ revenueGraph }: { revenueGraph: AdminChartsProps["revenueGraph"] }) => {
  const settings = useAppSelector((state) => state.settings.data);
  const defaultSymbol = settings?.default_currency?.symbol || "$";

  // Pad data if only one point exists to ensure area path renders
  const processedData = [...revenueGraph];
  if (processedData.length === 1) {
    processedData.unshift({
      _id: "Start",
      totalRevenue: 0,
      transactionCount: 0,
    });
  }

  const series = [
    {
      name: "Revenue",
      data: processedData.map((g) => g.totalRevenue),
    },
  ];
  const categories = processedData.map((g) => g._id);

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: true,
        top: 10,
        left: 0,
        blur: 15,
        color: "var(--text-green-primary)",
        opacity: 0.15,
      },
    },
    colors: ["var(--text-green-primary)"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 4 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "rgba(148,163,184,0.06)",
      strokeDashArray: 6,
      xaxis: { lines: { show: true } },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "var(--muted-text-color)", fontWeight: 800, fontSize: "10px" },
        offsetY: 2,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "var(--muted-text-color)", fontWeight: 800, fontSize: "10px" },
        formatter: (v) => defaultSymbol + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toLocaleString()),
      },
    },
    markers: {
      size: 5,
      colors: ["var(--text-green-primary)"],
      strokeColors: "#ffffff",
      strokeWidth: 3,
      hover: { size: 7 },
    },
    tooltip: {
      theme: "dark",
      x: { show: false },
    },
  };

  return (
    <Card className="border-none! dark:border-(--card-border-color) bg-white/70 dark:bg-(--card-color) shadow-sm h-full group overflow-hidden">
      <CardHeader className="pb-4 relative z-10 border-b border-(--input-border-color) dark:border-(--card-border-color)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={18} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-[19px] font-medium text-slate-800 dark:text-white">Total Revenue</CardTitle>
              <CardDescription className="text-[14px] font-medium text-slate-400 dark:text-gray-400">Revenue Trends</CardDescription>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/500/5 dark:bg-primary/10 rounded-full border border-primary/10">
            <Target size={12} className="text-primary animate-pulse" />
            <span className="text-[12px] font-black text-primary">Target Tracked</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="h-75">
          <ReactApexChart options={options} series={series} type="area" height={300} />
        </div>
      </CardContent>

      {/* Decorative gradient flare */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
    </Card>
  );
};
