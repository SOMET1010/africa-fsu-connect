import { lazy, Suspense } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { TooltipFormatter } from '@/types/common';

interface ChartSkeletonProps {
  height?: number;
}

const ChartSkeleton = ({ height = 200 }: ChartSkeletonProps) => (
  <div className="space-y-3">
    <Skeleton className={`w-full h-${height/8}`} />
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

interface PieChartComponentProps {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
}

export const LazyPieChart = ({ data, height = 200 }: PieChartComponentProps) => (
  <Suspense fallback={<ChartSkeleton height={height} />}>
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={((value: number, name: string) => [`${value} indicateurs`, 'Total']) as TooltipFormatter} />
      </PieChart>
    </ResponsiveContainer>
  </Suspense>
);

interface BarChartComponentProps {
  data: Array<{ name: string; internet: number; mobile: number; coverage4g: number }>;
  height?: number;
}

export const LazyBarChart = ({ data, height = 300 }: BarChartComponentProps) => (
  <Suspense fallback={<ChartSkeleton height={height} />}>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={((value: number, name: string) => [`${value?.toFixed(1)}%`, name]) as TooltipFormatter} />
        <Bar dataKey="internet" fill="hsl(var(--primary))" name="Internet %" />
        <Bar dataKey="mobile" fill="hsl(var(--secondary))" name="Mobile %" />
        <Bar dataKey="coverage4g" fill="hsl(var(--accent))" name="4G %" />
      </BarChart>
    </ResponsiveContainer>
  </Suspense>
);