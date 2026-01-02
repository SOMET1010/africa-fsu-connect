import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeIllustration, ThemeBadge, ThemeType } from "@/components/shared/ThemeIllustration";
import { CountryVisual } from "@/components/shared/CountryVisual";
import { cn } from "@/lib/utils";

interface PracticeCardVisualProps {
  title: string;
  description: string;
  country: string;
  countryFlag: string;
  theme: ThemeType;
  date: string;
  impact?: { value: string; label: string };
  agency?: string;
  featured?: boolean;
  variant?: "default" | "featured" | "compact";
}

export function PracticeCardVisual({
  title,
  description,
  country,
  countryFlag,
  theme,
  date,
  impact,
  agency,
  featured = false,
  variant = "default",
}: PracticeCardVisualProps) {
  
  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4 }}
      >
        <Card className={cn(
          "overflow-hidden group cursor-pointer",
          "border-2 hover:border-primary/30 transition-all duration-300",
          "african-card-accent shadow-lg hover:shadow-xl"
        )}>
          {/* Large visual header */}
          <div className={cn(
            "relative h-48 flex items-center justify-center overflow-hidden",
            "bg-gradient-to-br from-muted/50 to-muted",
            "african-pattern-bogolan-subtle"
          )}>
            {/* Theme illustration */}
            <ThemeIllustration 
              theme={theme} 
              size="xl" 
              showBackground={false}
              className="opacity-90"
            />
            
            {/* Country badge in corner */}
            <div className="absolute top-4 right-4">
              <CountryVisual 
                country={country} 
                flag={countryFlag} 
                variant="badge"
              />
            </div>

            {/* Impact overlay */}
            {impact && (
              <motion.div
                className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-3xl font-bold text-primary">{impact.value}</span>
                <span className="text-sm text-muted-foreground ml-2">{impact.label}</span>
              </motion.div>
            )}
          </div>

          <CardContent className="p-5">
            {/* Theme badge */}
            <ThemeBadge theme={theme} className="mb-3" />

            {/* Title */}
            <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>

            {/* Agency attribution */}
            {agency && (
              <p className="text-sm text-muted-foreground/80 italic mb-4">
                Porté par {agency}
              </p>
            )}

            {/* CTA */}
            <Button className="w-full group/btn">
              <span>Découvrir le projet</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-4 flex gap-4">
            {/* Mini illustration */}
            <ThemeIllustration theme={theme} size="sm" animated={false} />

            <div className="flex-1 min-w-0">
              {/* Country + Date line */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>{countryFlag} {country}</span>
                <span>•</span>
                <span>{date}</span>
              </div>

              {/* Title */}
              <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {title}
              </h4>

              {/* Impact inline */}
              {impact && (
                <p className="text-xs mt-1">
                  <span className="font-bold text-primary">{impact.value}</span>
                  <span className="text-muted-foreground ml-1">{impact.label}</span>
                </p>
              )}
            </div>

            <Eye className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors self-center" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={cn(
        "overflow-hidden group cursor-pointer h-full",
        "hover:shadow-lg transition-all duration-300",
        featured && "border-primary/20 ring-1 ring-primary/10"
      )}>
        {/* Visual header with illustration */}
        <div className={cn(
          "relative h-32 flex items-center justify-center",
          "bg-gradient-to-br from-muted/30 to-muted/60",
          "african-pattern-bogolan-subtle"
        )}>
          <ThemeIllustration 
            theme={theme} 
            size="lg" 
            showBackground={false}
          />

          {/* Country flag in corner */}
          <div className="absolute top-3 right-3">
            <CountryVisual 
              country={country} 
              flag={countryFlag} 
              size="sm"
            />
          </div>
        </div>

        <CardContent className="p-4">
          {/* Theme + Date row */}
          <div className="flex items-center justify-between mb-2">
            <ThemeBadge theme={theme} className="text-xs" />
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Impact highlight */}
          {impact && (
            <div className="flex items-baseline gap-2 mb-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-2xl font-bold text-primary">{impact.value}</span>
              <span className="text-sm text-muted-foreground">{impact.label}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>

          {/* Agency */}
          {agency && (
            <p className="text-xs text-muted-foreground/70 italic mb-3">
              {agency}
            </p>
          )}

          {/* CTA */}
          <Button variant="outline" size="sm" className="w-full group/btn">
            <Eye className="h-4 w-4 mr-2" />
            <span>Découvrir</span>
            <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
