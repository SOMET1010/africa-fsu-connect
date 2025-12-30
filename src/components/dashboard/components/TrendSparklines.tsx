import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface TrendData {
  label: string;
  data: number[];
  currentValue: number;
  previousValue: number;
  unit?: string;
  color: string;
}

interface TrendSparklinesProps {
  trends: TrendData[];
}

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border border-border rounded px-2 py-1 text-xs shadow-lg">
                    {payload[0].value}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendSparklines = ({ trends }: TrendSparklinesProps) => {
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <Card className="premium-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Tendances
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {trends.map((trend, index) => {
            const trendValue = calculateTrend(trend.currentValue, trend.previousValue);
            const isPositive = trendValue > 0;
            const isNeutral = trendValue === 0;

            return (
              <motion.div
                key={trend.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{trend.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold">
                      {trend.currentValue}
                      {trend.unit && <span className="text-sm font-normal text-muted-foreground">{trend.unit}</span>}
                    </span>
                    <div className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      isPositive ? "text-success" : isNeutral ? "text-muted-foreground" : "text-destructive"
                    )}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : isNeutral ? (
                        <Minus className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{isPositive ? "+" : ""}{trendValue}%</span>
                    </div>
                  </div>
                </div>
                <MiniSparkline data={trend.data} color={trend.color} />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
