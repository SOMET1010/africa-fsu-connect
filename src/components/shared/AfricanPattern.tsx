import { cn } from "@/lib/utils";

interface AfricanPatternProps {
  variant?: "bogolan" | "kente" | "adinkra" | "subtle";
  className?: string;
  children?: React.ReactNode;
}

export function AfricanPattern({
  variant = "subtle",
  className,
  children,
}: AfricanPatternProps) {
  const patternClass = {
    bogolan: "african-pattern-bogolan",
    kente: "african-pattern-kente", 
    adinkra: "african-pattern-adinkra",
    subtle: "african-pattern-bogolan-subtle",
  }[variant];

  return (
    <div className={cn(patternClass, className)}>
      {children}
    </div>
  );
}

// Decorative divider component
export function AfricanDivider({ 
  variant = "default",
  className,
}: { 
  variant?: "default" | "subtle"; 
  className?: string;
}) {
  return (
    <div 
      className={cn(
        variant === "default" ? "african-divider" : "african-divider-subtle",
        "w-full my-6",
        className
      )} 
    />
  );
}

// Section with African background
export function AfricanSection({
  variant = "warm",
  children,
  className,
}: {
  variant?: "warm" | "cool" | "premium";
  children: React.ReactNode;
  className?: string;
}) {
  const bgClass = {
    warm: "african-bg-warm",
    cool: "african-bg-cool",
    premium: "african-bg-premium",
  }[variant];

  return (
    <section className={cn(bgClass, className)}>
      {children}
    </section>
  );
}

// Card with African accent border
export function AfricanAccentCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "african-card-accent bg-card rounded-lg border shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}

// Corner decoration wrapper
export function AfricanCornerDecoration({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("african-corner-decoration", className)}>
      {children}
    </div>
  );
}

// Animated stats number with African styling
export function AfricanStatNumber({
  value,
  label,
  className,
}: {
  value: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <p 
        className="text-4xl md:text-5xl font-bold"
        style={{ 
          background: "linear-gradient(135deg, hsl(45 95% 50%), hsl(25 80% 55%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
