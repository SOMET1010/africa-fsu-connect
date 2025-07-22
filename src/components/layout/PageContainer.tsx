
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const PageContainer = ({
  children,
  size = "xl",
  className,
  padding = "md"
}: PageContainerProps) => {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none"
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 py-4",
    md: "px-4 sm:px-6 lg:px-8 py-6",
    lg: "px-6 sm:px-8 lg:px-12 py-8"
  };

  return (
    <div className={cn(
      "mx-auto",
      sizeClasses[size],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};
