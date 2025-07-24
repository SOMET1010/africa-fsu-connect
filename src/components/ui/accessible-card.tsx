import * as React from "react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/useAccessibility";

interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  interactive?: boolean;
  focusable?: boolean;
  announceChanges?: boolean;
}

const AccessibleCard = React.forwardRef<HTMLDivElement, AccessibleCardProps>(
  ({ 
    className, 
    title, 
    description, 
    children, 
    interactive = false,
    focusable = false,
    announceChanges = false,
    ...props 
  }, ref) => {
    const { announceToScreenReader } = useAccessibility();
    const [hasChanges, setHasChanges] = React.useState(false);

    React.useEffect(() => {
      if (announceChanges && hasChanges && title) {
        announceToScreenReader(`Contenu mis à jour dans ${title}`, 'polite');
        setHasChanges(false);
      }
    }, [hasChanges, title, announceChanges, announceToScreenReader]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
      }
    };

    const cardProps = {
      ref,
      className: cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        "transition-all duration-200",
        interactive && [
          "cursor-pointer hover:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        ],
        focusable && "enhanced-focus",
        className
      ),
      role: interactive ? "button" : undefined,
      tabIndex: (interactive || focusable) ? 0 : undefined,
      onKeyDown: interactive ? handleKeyDown : undefined,
      "aria-label": title ? `${title}${description ? `. ${description}` : ''}` : undefined,
      "aria-describedby": description ? `${props.id}-description` : undefined,
      ...props
    };

    return (
      <div {...cardProps}>
        {title && (
          <div className="sr-only">
            <h3 id={`${props.id}-title`}>{title}</h3>
            {description && (
              <p id={`${props.id}-description`}>{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);

AccessibleCard.displayName = "AccessibleCard";

export { AccessibleCard };