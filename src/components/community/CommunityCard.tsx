import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Country } from "@/services/countriesService";

interface CommunityCardProps {
  code: string;
  name: string;
  flag: string;
  color: string;
  count: number;
  description: string;
  countries: Country[];
  index?: number;
}

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const CommunityCard = ({
  code,
  name,
  flag,
  color,
  count,
  description,
  countries,
  index = 0,
}: CommunityCardProps) => {
  const displayedCountries = countries.slice(0, 6);
  const remainingCount = countries.length - 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
        <CardContent className="p-6">
          {/* Header with color indicator */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-2xl">{flag}</span>
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          </div>

          {/* Count */}
          <div className="mb-4">
            <span className="text-4xl font-bold text-foreground">{count}</span>
            <span className="text-muted-foreground ml-2">pays membres</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 line-clamp-2">
            {description}
          </p>

          {/* Country flags grid */}
          <div className="flex flex-wrap gap-2 mb-6">
            {displayedCountries.map((country) => (
              <span
                key={country.code}
                className="text-2xl"
                title={country.name_fr}
              >
                {getCountryFlag(country.code)}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                +{remainingCount}
              </span>
            )}
          </div>

          {/* CTA */}
          <Button
            asChild
            variant="outline"
            className="w-full group/btn"
          >
            <Link to={`/members?language=${code}`}>
              Voir les pays
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
