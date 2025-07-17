import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MemoizedCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClick?: () => void;
}

const MemoizedCardComponent = React.memo<MemoizedCardProps>(({
  title,
  description,
  children,
  className,
  loading = false,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-medium cursor-pointer",
        "hover:scale-[1.02] hover:-translate-y-1",
        loading && "opacity-50 pointer-events-none",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
});

MemoizedCardComponent.displayName = "MemoizedCard";

export { MemoizedCardComponent as MemoizedCard };