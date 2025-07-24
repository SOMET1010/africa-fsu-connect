import * as React from "react";
import { cn } from "@/lib/utils";

interface SkipLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

const SkipLinks: React.FC<SkipLinksProps> = ({ links, className }) => {
  return (
    <div className={cn("skip-links", className)}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium focus:transition-all focus:duration-200"
          onClick={(e) => {
            e.preventDefault();
            const targetId = link.href.replace('#', '');
            const target = document.getElementById(targetId);
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export { SkipLinks };