import { ACTIVITY_LEVELS, ActivityLevel } from "./activityData";

interface MapLegendProps {
  className?: string;
}

const legendItems: { level: ActivityLevel; size: number }[] = [
  { level: 'high', size: 14 },
  { level: 'medium', size: 12 },
  { level: 'emerging', size: 10 },
  { level: 'joining', size: 8 },
];

export const MapLegend = ({ className = "" }: MapLegendProps) => {
  return (
    <div 
      className={`flex items-center gap-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-full ${className}`}
    >
      {legendItems.map(({ level, size }) => {
        const { color, label } = ACTIVITY_LEVELS[level];
        return (
          <div key={level} className="flex items-center gap-2">
            {/* Marker circle - identical to map markers */}
            <div 
              className="relative flex items-center justify-center"
              style={{ width: size + 4, height: size + 4 }}
            >
              {/* Outer glow */}
              <div 
                className="absolute inset-0 rounded-full opacity-40"
                style={{ 
                  backgroundColor: color,
                  filter: `blur(${size / 4}px)`,
                }}
              />
              {/* Inner circle */}
              <div 
                className="relative rounded-full border-2"
                style={{ 
                  width: size,
                  height: size,
                  backgroundColor: `${color}66`,
                  borderColor: color,
                  boxShadow: `0 0 ${size}px ${color}50`,
                }}
              />
            </div>
            {/* Label */}
            <span className="text-xs text-white/70 whitespace-nowrap">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
