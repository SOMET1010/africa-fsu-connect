import { cn } from "@/lib/utils";

interface NexusNetworkPatternProps {
  variant?: "subtle" | "soft" | "visible";
  animated?: boolean;
  className?: string;
}

const opacityMap = {
  subtle: "opacity-[0.03]",
  soft: "opacity-[0.05]",
  visible: "opacity-[0.08]",
};

export function NexusNetworkPattern({
  variant = "subtle",
  animated = false,
  className,
}: NexusNetworkPatternProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      <svg
        className={cn("w-full h-full", opacityMap[variant])}
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          
          {/* Gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(220, 100%, 56%)" />
            <stop offset="100%" stopColor="hsl(43, 75%, 52%)" />
          </linearGradient>
        </defs>

        {/* Network connections - abstract lines */}
        <g stroke="url(#connectionGradient)" strokeWidth="0.5" fill="none">
          {/* Main connection arcs */}
          <path d="M100,300 Q200,150 350,200" />
          <path d="M350,200 Q500,100 600,180" />
          <path d="M600,180 Q700,250 750,350" />
          <path d="M100,300 Q150,400 250,420" />
          <path d="M250,420 Q400,500 500,450" />
          <path d="M500,450 Q650,400 750,350" />
          <path d="M350,200 Q400,300 500,450" />
          <path d="M200,200 Q300,250 350,200" />
          <path d="M450,150 Q550,200 600,180" />
          <path d="M300,350 Q400,380 500,450" />
          
          {/* Secondary connections */}
          <path d="M150,250 Q250,200 300,250" opacity="0.5" />
          <path d="M400,250 Q500,300 550,280" opacity="0.5" />
          <path d="M200,380 Q300,400 350,380" opacity="0.5" />
          <path d="M550,380 Q620,350 680,380" opacity="0.5" />
        </g>

        {/* Network nodes - key points */}
        <g>
          {/* Primary nodes (countries/hubs) */}
          <circle cx="100" cy="300" r="4" fill="hsl(220, 100%, 56%)" />
          <circle cx="350" cy="200" r="5" fill="hsl(43, 75%, 52%)" />
          <circle cx="600" cy="180" r="4" fill="hsl(174, 60%, 56%)" />
          <circle cx="750" cy="350" r="4" fill="hsl(220, 100%, 56%)" />
          <circle cx="250" cy="420" r="4" fill="hsl(43, 75%, 52%)" />
          <circle cx="500" cy="450" r="5" fill="hsl(174, 60%, 56%)" />
          
          {/* Secondary nodes */}
          <circle cx="200" cy="200" r="2" fill="hsl(220, 100%, 70%)" />
          <circle cx="450" cy="150" r="2" fill="hsl(220, 100%, 70%)" />
          <circle cx="300" cy="350" r="2" fill="hsl(43, 75%, 60%)" />
          <circle cx="550" cy="280" r="2" fill="hsl(174, 60%, 60%)" />
          <circle cx="150" cy="250" r="1.5" fill="hsl(220, 100%, 70%)" />
          <circle cx="680" cy="380" r="1.5" fill="hsl(43, 75%, 60%)" />
        </g>

        {/* No animated pulse rings */}
      </svg>
    </div>
  );
}
