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
        const stats = await CountriesService.getCommunityStats();
        
        // Mapper les stats aux communautés avec descriptions
        const communityList: CommunityStats[] = [
          { code: 'fr', name: 'Francophone', description: currentLanguage === 'en' ? 'French-speaking countries' : 'Pays francophones', count: 0, flag: '🇫🇷' },
          { code: 'en', name: 'Anglophone', description: currentLanguage === 'en' ? 'English-speaking countries' : 'Pays anglophones', count: 0, flag: '🇬🇧' },
          { code: 'pt', name: 'Lusophone', description: currentLanguage === 'en' ? 'Portuguese-speaking countries' : 'Pays lusophones', count: 0, flag: '🇵🇹' },
          { code: 'ar', name: 'Arabophone', description: currentLanguage === 'en' ? 'Arabic-speaking countries' : 'Pays arabophones', count: 0, flag: '🇸🇦' },
        ];

        // Compter par langue depuis les stats de communauté
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
              <div key={i} className="flex-1 h-24 bg-white/5 rounded-lg" />
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
          <h2 className="text-xl font-medium text-white">
            {currentLanguage === 'en' ? 'Linguistic Communities' : 'Communautés linguistiques'}
          </h2>
          <p className="text-sm text-white/60 mt-2">
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
              className="group rounded-[var(--nx-radius-md)] border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:border-[hsl(var(--nx-gold)/0.5)] hover:bg-white/10 transition-all duration-[var(--nx-dur-2)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{community.flag}</span>
                <span className="font-medium text-white group-hover:text-[hsl(var(--nx-gold))]">
                  {community.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-white/60">
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
