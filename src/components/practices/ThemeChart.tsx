import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ThemeIcon, ThemeType } from "@/components/shared/ThemeIllustration";
import { cn } from "@/lib/utils";

interface ThemeDataItem {
  name: ThemeType;
  value: number;
  color: string;
}

const themeData: ThemeDataItem[] = [
  { name: "Connectivité", value: 35, color: "hsl(230 55% 45%)" },
  { name: "E-Santé", value: 25, color: "hsl(18 76% 55%)" },
  { name: "Éducation", value: 20, color: "hsl(140 65% 40%)" },
  { name: "Gouvernance", value: 12, color: "hsl(25 80% 55%)" },
  { name: "Agriculture", value: 8, color: "hsl(150 45% 35%)" },
];

interface ThemeChartProps {
  onThemeClick?: (theme: ThemeType) => void;
  selectedTheme?: string;
  className?: string;
}

export function ThemeChart({ onThemeClick, selectedTheme, className }: ThemeChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("bg-card rounded-2xl border p-5", className)}
    >
      <h3 className="font-semibold mb-4 text-center">Répartition par thème</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={themeData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {themeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={selectedTheme && selectedTheme !== "all" && entry.name.toLowerCase() !== selectedTheme ? 0.3 : 1}
                    className="cursor-pointer transition-opacity duration-200"
                    onClick={() => onThemeClick?.(entry.name)}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ThemeDataItem;
                    return (
                      <div className="bg-popover border rounded-lg shadow-lg px-3 py-2">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">{data.value} pratiques</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with clickable items */}
        <div className="flex flex-wrap gap-2 justify-center">
          {themeData.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onThemeClick?.(item.name)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                "hover:border-primary/30 hover:bg-primary/5",
                selectedTheme === item.name.toLowerCase() && "border-primary bg-primary/10"
              )}
            >
              <ThemeIcon theme={item.name} size={18} />
              <span className="text-sm font-medium">{item.name}</span>
              <span 
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                {item.value}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Simpler horizontal bar version
export function ThemeBarChart({ className }: { className?: string }) {
  const total = themeData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn("space-y-3", className)}>
      {themeData.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <ThemeIcon theme={item.name} size={20} />
          <span className="text-sm font-medium w-24 truncate">{item.name}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / total) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">{item.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
