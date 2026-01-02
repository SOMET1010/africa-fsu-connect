import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Calendar } from "lucide-react";

interface PracticeCardProps {
  title: string;
  description: string;
  country: string;
  countryFlag: string;
  theme: string;
  date: string;
}

export function PracticeCard({
  title,
  description,
  country,
  countryFlag,
  theme,
  date,
}: PracticeCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <CardContent className="p-5">
        {/* Theme - discret */}
        <span className="text-xs font-medium text-primary/80 uppercase tracking-wide">
          {theme}
        </span>

        {/* Title - fort */}
        <h3 className="font-semibold text-lg mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {/* Impact - 2 lignes max */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Context - léger */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 pb-4 border-b">
          <span className="text-base">{countryFlag}</span>
          <span>{country}</span>
          <span className="mx-1">•</span>
          <Calendar className="h-3 w-3" />
          <span>{date}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Découvrir
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contacter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
