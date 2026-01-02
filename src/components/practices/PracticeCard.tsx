import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle, Calendar } from "lucide-react";

interface PracticeCardProps {
  title: string;
  description: string;
  country: string;
  countryFlag: string;
  theme: string;
  date: string;
  featured?: boolean;
}

export function PracticeCard({
  title,
  description,
  country,
  countryFlag,
  theme,
  date,
  featured = false,
}: PracticeCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${featured ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <Badge variant="secondary" className="text-xs">
            {theme}
          </Badge>
          {featured && (
            <Badge className="bg-primary/10 text-primary text-xs">
              ⭐ Mis en avant
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="text-lg">{countryFlag}</span>
          <span>{country}</span>
          <span className="mx-2">•</span>
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Découvrir
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contacter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
