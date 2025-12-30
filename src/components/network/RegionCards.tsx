import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

interface Region {
  id: string;
  name: string;
  code: string;
  countriesCount: number;
  color: string;
}

const regions: Region[] = [
  { id: '1', name: 'Afrique de l\'Ouest', code: 'west', countriesCount: 15, color: 'bg-blue-500' },
  { id: '2', name: 'Afrique Centrale', code: 'central', countriesCount: 9, color: 'bg-green-500' },
  { id: '3', name: 'Afrique de l\'Est', code: 'east', countriesCount: 13, color: 'bg-purple-500' },
  { id: '4', name: 'Afrique du Nord', code: 'north', countriesCount: 6, color: 'bg-orange-500' },
  { id: '5', name: 'Afrique Australe', code: 'south', countriesCount: 11, color: 'bg-teal-500' },
];

export const RegionCards = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {regions.map((region) => (
        <Link key={region.id} to={`/members?region=${encodeURIComponent(region.name)}`}>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer">
            <CardContent className="p-6 text-center">
              {/* Indicateur de région - pas de classement */}
              <div className={`w-12 h-12 ${region.color} rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="text-white font-bold text-lg">
                  {region.name[0]}
                </span>
              </div>
              
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {region.name}
              </h3>
              
              <p className="text-xs text-muted-foreground">
                {region.countriesCount} {t('common.countries') || 'pays'}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
