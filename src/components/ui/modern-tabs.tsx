
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { glassEffect, modernTransition, hoverEffects, designTokens } from "@/lib/design-tokens";

const ModernTabs = TabsPrimitive.Root;

const ModernTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-xl p-1.5 relative overflow-hidden",
      glassEffect('medium'),
      hoverEffects.lift,
      className
    )}
    {...props}
  />
));
ModernTabsList.displayName = TabsPrimitive.List.displayName;

const ModernTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium",
      modernTransition(),
      "text-muted-foreground hover:text-foreground",
      designTokens.states.focus,
      designTokens.states.disabled,
      designTokens.states.active,
      "data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20",
      "data-[state=active]:backdrop-blur-sm",
      hoverEffects.scale,
      "relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
      "before:translate-x-[-100%] before:transition-transform before:duration-500",
      "hover:before:translate-x-[100%]",
      className
    )}
    {...props}
  >
    <motion.div
      className="relative z-10 flex items-center gap-2"
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  </TabsPrimitive.Trigger>
));
ModernTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const ModernTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "animate-fade-in",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  </TabsPrimitive.Content>
));
ModernTabsContent.displayName = TabsPrimitive.Content.displayName;

// Enhanced tabs with icon support
interface ModernTabsWithIconProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  tabs: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }[];
  defaultValue?: string;
}

const ModernTabsWithIcon = ({ tabs, defaultValue, className, ...props }: ModernTabsWithIconProps) => {
  return (
    <ModernTabs defaultValue={defaultValue || tabs[0]?.value} className={className} {...props}>
      <ModernTabsList className="grid grid-cols-auto gap-1" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => (
          <ModernTabsTrigger key={tab.value} value={tab.value}>
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </ModernTabsTrigger>
        ))}
      </ModernTabsList>
      <AnimatePresence mode="wait">
        {tabs.map((tab) => (
          <ModernTabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </ModernTabsContent>
        ))}
      </AnimatePresence>
    </ModernTabs>
  );
};

export { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent, ModernTabsWithIcon };
