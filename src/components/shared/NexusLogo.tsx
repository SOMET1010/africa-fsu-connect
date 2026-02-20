import { cn } from "@/lib/utils";

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
  showSubtext?: boolean;
}

const sizeMap = {
  sm: { icon: 32, text: 'text-sm', subtext: 'text-[6px]' },
  md: { icon: 44, text: 'text-base', subtext: 'text-[8px]' },
  lg: { icon: 64, text: 'text-xl', subtext: 'text-[10px]' },
  xl: { icon: 80, text: 'text-2xl', subtext: 'text-xs' },
};

const NexusIcon = ({ size = 44, animated = true, className }: { size?: number; animated?: boolean; className?: string }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    width={size} 
    height={size}
    className={cn("transition-transform duration-300", animated && "group-hover:scale-105", className)}
  >
    <defs>
      <linearGradient id="nexus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B3C5D"/>
        <stop offset="100%" stopColor="#1F7A63"/>
      </linearGradient>
      <linearGradient id="nexus-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B3C5D" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#1F7A63" stopOpacity="0.3"/>
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Hexagone de fond (réseau) */}
    <path 
      d="M32 6 L54 18 L54 46 L32 58 L10 46 L10 18 Z" 
      stroke="url(#nexus-gradient)" 
      strokeWidth="2" 
      fill="url(#nexus-gradient-light)"
      className={cn(animated && "animate-pulse")}
      style={{ animationDuration: '4s' }}
    />
    
    {/* Lignes de connexion internes */}
    <path 
      d="M32 6 L32 58" 
      stroke="url(#nexus-gradient)" 
      strokeWidth="1.5" 
      opacity="0.5"
    />
    <path 
      d="M10 18 L54 46" 
      stroke="url(#nexus-gradient)" 
      strokeWidth="1.5" 
      opacity="0.5"
    />
    <path 
      d="M54 18 L10 46" 
      stroke="url(#nexus-gradient)" 
      strokeWidth="1.5" 
      opacity="0.5"
    />
    
    {/* Connexions secondaires vers le centre */}
    <path 
      d="M32 6 L32 32 M54 18 L32 32 M54 46 L32 32 M32 58 L32 32 M10 46 L32 32 M10 18 L32 32" 
      stroke="url(#nexus-gradient)" 
      strokeWidth="1" 
      opacity="0.4"
    />
    
    {/* Nœuds périphériques (6 pays/agences) */}
    <circle cx="32" cy="6" r="4" fill="#0B3C5D" filter={animated ? "url(#glow)" : undefined}/>
    <circle cx="54" cy="18" r="4" fill="#0D4560"/>
    <circle cx="54" cy="46" r="4" fill="#156B56"/>
    <circle cx="32" cy="58" r="4" fill="#1F7A63" filter={animated ? "url(#glow)" : undefined}/>
    <circle cx="10" cy="46" r="4" fill="#156B56"/>
    <circle cx="10" cy="18" r="4" fill="#0D4560"/>
    
    {/* Nœud central (NEXUS hub) */}
    <circle 
      cx="32" 
      cy="32" 
      r="7" 
      fill="url(#nexus-gradient)"
      filter={animated ? "url(#glow)" : undefined}
    />
    
    {/* Point lumineux central */}
    <circle cx="32" cy="32" r="3" fill="white" opacity="0.9"/>
  </svg>
);

export const NexusLogo = ({ 
  size = 'md', 
  variant = 'full',
  animated = true,
  showSubtext = true,
  className 
}: NexusLogoProps) => {
  const config = sizeMap[size];

  if (variant === 'icon') {
    return (
      <div className={cn("group", className)}>
        <NexusIcon size={config.icon} animated={animated} />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <span className={cn(
          "font-black tracking-wider bg-gradient-to-r from-[#0B3C5D] to-[#1F7A63] bg-clip-text text-transparent",
          config.text
        )}>
          UDC
        </span>
        {showSubtext && (
          <span className={cn("font-medium text-muted-foreground tracking-widest", config.subtext)}>
            USF • Universal Digital Connect
          </span>
        )}
      </div>
    );
  }

  // variant === 'full'
  return (
    <div className={cn("group flex items-center gap-3", className)}>
      <NexusIcon size={config.icon} animated={animated} />
      <div className="flex flex-col">
        <span className={cn(
          "font-black tracking-wider bg-gradient-to-r from-[#0B3C5D] to-[#1F7A63] bg-clip-text text-transparent leading-tight",
          config.text
        )}>
          UDC
        </span>
        {showSubtext && (
          <span className={cn("font-medium text-muted-foreground tracking-wide", config.subtext)}>
            USF • Universal Digital Connect
          </span>
        )}
      </div>
    </div>
  );
};

export default NexusLogo;
