import { motion } from "framer-motion";
import { 
  Radio, 
  GraduationCap, 
  HeartPulse, 
  Leaf, 
  Landmark,
  Globe,
  Wifi,
  BookOpen,
  Stethoscope,
  Sprout,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ThemeType = 
  | "connectivity" 
  | "education" 
  | "ehealth" 
  | "agriculture" 
  | "governance"
  | "Connectivité"
  | "Éducation"
  | "E-Santé"
  | "Agriculture"
  | "Gouvernance";

interface ThemeIllustrationProps {
  theme: ThemeType;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
  showBackground?: boolean;
}

const themeConfig: Record<string, {
  icon: React.ElementType;
  secondaryIcon: React.ElementType;
  color: string;
  bgClass: string;
  gradientFrom: string;
  gradientTo: string;
}> = {
  connectivity: {
    icon: Radio,
    secondaryIcon: Wifi,
    color: "hsl(230 55% 35%)",
    bgClass: "illustration-bg-connectivity",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-blue-400",
  },
  "Connectivité": {
    icon: Radio,
    secondaryIcon: Wifi,
    color: "hsl(230 55% 35%)",
    bgClass: "illustration-bg-connectivity",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-blue-400",
  },
  education: {
    icon: GraduationCap,
    secondaryIcon: BookOpen,
    color: "hsl(140 65% 35%)",
    bgClass: "illustration-bg-education",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-green-400",
  },
  "Éducation": {
    icon: GraduationCap,
    secondaryIcon: BookOpen,
    color: "hsl(140 65% 35%)",
    bgClass: "illustration-bg-education",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-green-400",
  },
  ehealth: {
    icon: HeartPulse,
    secondaryIcon: Stethoscope,
    color: "hsl(18 76% 55%)",
    bgClass: "illustration-bg-ehealth",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-400",
  },
  "E-Santé": {
    icon: HeartPulse,
    secondaryIcon: Stethoscope,
    color: "hsl(18 76% 55%)",
    bgClass: "illustration-bg-ehealth",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-400",
  },
  agriculture: {
    icon: Leaf,
    secondaryIcon: Sprout,
    color: "hsl(150 45% 30%)",
    bgClass: "illustration-bg-agriculture",
    gradientFrom: "from-green-600",
    gradientTo: "to-lime-400",
  },
  "Agriculture": {
    icon: Leaf,
    secondaryIcon: Sprout,
    color: "hsl(150 45% 30%)",
    bgClass: "illustration-bg-agriculture",
    gradientFrom: "from-green-600",
    gradientTo: "to-lime-400",
  },
  governance: {
    icon: Landmark,
    secondaryIcon: Building2,
    color: "hsl(25 80% 55%)",
    bgClass: "illustration-bg-governance",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-400",
  },
  "Gouvernance": {
    icon: Landmark,
    secondaryIcon: Building2,
    color: "hsl(25 80% 55%)",
    bgClass: "illustration-bg-governance",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-400",
  },
};

const sizeConfig = {
  sm: { container: "w-16 h-16", icon: 24, secondary: 14 },
  md: { container: "w-24 h-24", icon: 40, secondary: 20 },
  lg: { container: "w-32 h-32", icon: 56, secondary: 28 },
  xl: { container: "w-40 h-40", icon: 72, secondary: 36 },
};

export function ThemeIllustration({
  theme,
  size = "md",
  animated = true,
  className,
  showBackground = true,
}: ThemeIllustrationProps) {
  const config = themeConfig[theme] || themeConfig.connectivity;
  const sizeValues = sizeConfig[size];
  const Icon = config.icon;
  const SecondaryIcon = config.secondaryIcon;

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center rounded-2xl",
        sizeValues.container,
        showBackground && config.bgClass,
        showBackground && "bg-gradient-to-br",
        showBackground && config.gradientFrom,
        showBackground && config.gradientTo,
        showBackground && "bg-opacity-10",
        className
      )}
      initial={animated ? { scale: 0.9, opacity: 0 } : false}
      animate={animated ? { scale: 1, opacity: 1 } : false}
      whileHover={animated ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Decorative circles */}
      {showBackground && (
        <>
          <motion.div
            className={cn(
              "absolute inset-2 rounded-xl bg-gradient-to-br opacity-20",
              config.gradientFrom,
              config.gradientTo
            )}
            animate={animated ? { rotate: 360 } : false}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-current opacity-10"
            style={{ borderColor: config.color }}
          />
        </>
      )}

      {/* Main Icon */}
      <motion.div
        className="relative z-10"
        animate={animated ? { y: [0, -3, 0] } : false}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon
          size={sizeValues.icon}
          style={{ color: config.color }}
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Secondary floating icon */}
      {showBackground && (
        <motion.div
          className="absolute -right-1 -bottom-1"
          animate={animated ? { 
            x: [0, 3, 0],
            y: [0, -3, 0],
            rotate: [0, 5, -5, 0]
          } : false}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <SecondaryIcon
            size={sizeValues.secondary}
            style={{ color: config.color }}
            className="opacity-60"
            strokeWidth={2}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// Simplified inline version for cards
export function ThemeIcon({
  theme,
  size = 20,
  className,
}: {
  theme: ThemeType;
  size?: number;
  className?: string;
}) {
  const config = themeConfig[theme] || themeConfig.connectivity;
  const Icon = config.icon;

  return (
    <Icon
      size={size}
      style={{ color: config.color }}
      className={className}
      strokeWidth={2}
    />
  );
}

// Badge version with colored background
export function ThemeBadge({
  theme,
  label,
  className,
}: {
  theme: ThemeType;
  label?: string;
  className?: string;
}) {
  const config = themeConfig[theme] || themeConfig.connectivity;
  const Icon = config.icon;
  
  // Normalize theme to get badge class
  const themeKey = theme.toLowerCase().replace("é", "e").replace("-", "");
  const badgeClass = `theme-badge-${
    themeKey.includes("connect") ? "connectivity" :
    themeKey.includes("educ") ? "education" :
    themeKey.includes("sant") ? "ehealth" :
    themeKey.includes("agri") ? "agriculture" :
    "governance"
  }`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        badgeClass,
        className
      )}
    >
      <Icon size={14} strokeWidth={2} />
      {label || theme}
    </span>
  );
}
