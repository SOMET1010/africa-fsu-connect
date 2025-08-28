import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
}

interface PresentationNavigationProps {
  sections: Section[];
  currentSection: number;
  onSectionChange: (index: number) => void;
}

export function PresentationNavigation({ 
  sections, 
  currentSection, 
  onSectionChange 
}: PresentationNavigationProps) {
  return (
    <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-foreground">SUTEL Présentation</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2 overflow-x-auto">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={currentSection === index ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(index)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap",
                    currentSection === index && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{section.title}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{currentSection + 1}</span>
            <span>/</span>
            <span>{sections.length}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}