
import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ModernSecurityCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "active" | "inactive" | "warning" | "error";
  value?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export function ModernSecurityCard({
  title,
  description,
  icon: Icon,
  status,
  value,
  children,
  className
}: ModernSecurityCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-700 border-green-200/50";
      case "inactive":
        return "bg-gray-500/20 text-gray-700 border-gray-200/50";
      case "warning":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-200/50";
      case "error":
        return "bg-red-500/20 text-red-700 border-red-200/50";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-200/50";
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "inactive":
        return "text-gray-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <GlassCard 
      variant="default" 
      className={cn(
        "p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group",
        "border-l-4 border-l-primary/50 hover:border-l-primary",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
            "bg-primary/10 group-hover:bg-primary/20"
          )}>
            <Icon className={cn("h-5 w-5 transition-colors", getIconColor(status))} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <Badge className={cn(
          "text-xs font-medium transition-all duration-300",
          getStatusColor(status)
        )}>
          {status.toUpperCase()}
        </Badge>
      </div>

      {value && (
        <div className="mb-4">
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
      )}

      {children && (
        <div className="mt-4 pt-4 border-t border-border/50">
          {children}
        </div>
      )}
    </GlassCard>
  );
}
