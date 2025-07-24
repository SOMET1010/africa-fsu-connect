import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, AlertTriangle, Info } from "lucide-react";

interface AccessibleAlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoFocus?: boolean;
  priority?: "polite" | "assertive";
}

const AccessibleAlert = React.forwardRef<HTMLDivElement, AccessibleAlertProps>(
  ({ 
    variant = "info", 
    title, 
    children, 
    className, 
    dismissible = false,
    onDismiss,
    autoFocus = false,
    priority = "polite",
    ...props 
  }, ref) => {
    const alertRef = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(true);

    React.useImperativeHandle(ref, () => alertRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (autoFocus && alertRef.current) {
        alertRef.current.focus();
      }
    }, [autoFocus]);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (dismissible && e.key === 'Escape') {
        handleDismiss();
      }
    };

    const getIcon = () => {
      switch (variant) {
        case "success":
          return <Check className="h-5 w-5" aria-hidden="true" />;
        case "warning":
          return <AlertTriangle className="h-5 w-5" aria-hidden="true" />;
        case "error":
          return <X className="h-5 w-5" aria-hidden="true" />;
        default:
          return <Info className="h-5 w-5" aria-hidden="true" />;
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200";
        case "warning":
          return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
        case "error":
          return "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200";
        default:
          return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200";
      }
    };

    if (!isVisible) return null;

    return (
      <div
        ref={alertRef}
        role="alert"
        aria-live={priority}
        aria-atomic="true"
        tabIndex={autoFocus ? 0 : -1}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative w-full rounded-lg border p-4",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          getVariantStyles(),
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-medium mb-1">
                {title}
              </h3>
            )}
            <div className="text-sm">
              {children}
            </div>
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Fermer l'alerte"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

AccessibleAlert.displayName = "AccessibleAlert";

export { AccessibleAlert };