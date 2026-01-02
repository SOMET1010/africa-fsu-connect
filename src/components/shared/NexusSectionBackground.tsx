import { cn } from "@/lib/utils";
import { NexusNetworkPattern } from "./NexusNetworkPattern";

interface NexusSectionBackgroundProps {
  variant?: "subtle" | "soft" | "visible";
  animated?: boolean;
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
}

export function NexusSectionBackground({
  variant = "subtle",
  animated = false,
  children,
  className,
  as: Component = "section",
}: NexusSectionBackgroundProps) {
  return (
    <Component className={cn("relative", className)}>
      <NexusNetworkPattern variant={variant} animated={animated} />
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
