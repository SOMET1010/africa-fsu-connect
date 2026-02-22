import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { CountriesService, SUTEL_COMMUNITIES } from "@/services/countriesService";
import { useTranslation } from "@/hooks/useTranslation";
import { logger } from "@/utils/logger";

interface CommunityStats {
  code: string;
  name: string;
  description: string;
  count: number;
  flag: string;
}

export const LinguisticCommunitiesSection = () => {
  const { t, currentLanguage } = useTranslation();
  const [communities, setCommunities] = useState<CommunityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const communityList: CommunityStats[] = [
          { code: 'fr', name: 'Francophone', description: currentLanguage === 'en' ? 'French-speaking countries' : 'Pays francophones', count: 0, flag: '🇫🇷' },
          { code: 'en', name: 'Anglophone', description: currentLanguage === 'en' ? 'English-speaking countries' : 'Pays anglophones', count: 0, flag: '🇬🇧' },
          { code: 'pt', name: 'Lusophone', description: currentLanguage === 'en' ? 'Portuguese-speaking countries' : 'Pays lusophones', count: 0, flag: '🇵🇹' },
          { code: 'ar', name: 'Arabophone', description: currentLanguage === 'en' ? 'Arabic-speaking countries' : 'Pays arabophones', count: 0, flag: '🇸🇦' },
        ];

        const langStats = await CountriesService.getLanguageStats();
        communityList[0].count = langStats['fr'] || 0;
        communityList[1].count = langStats['en'] || 0;
        communityList[2].count = langStats['pt'] || 0;
        communityList[3].count = langStats['ar'] || 0;

        setCommunities(communityList);
      } catch (error) {
        logger.error('Error loading community stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [currentLanguage]);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="animate-pulse flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 h-24 bg-slate-100 dark:bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">
            {currentLanguage === 'en' ? 'Linguistic Communities' : 'Communautés linguistiques'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-2">
            {currentLanguage === 'en' 
              ? 'The UDC network brings together countries from different linguistic areas' 
              : 'Le réseau UDC réunit des pays de différentes zones linguistiques'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {communities.map((community) => (
            <Link
              key={community.code}
              to={`/members?language=${community.code}`}
              className="group rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-sm p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{community.flag}</span>
                <span className="font-medium text-slate-900 dark:text-foreground group-hover:text-primary transition-colors">
                  {community.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{community.count} {currentLanguage === 'en' ? 'countries' : 'pays'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
