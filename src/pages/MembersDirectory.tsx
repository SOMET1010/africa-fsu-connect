import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Globe, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useMembersDirectory } from "@/hooks/useMembersDirectory";
import { RegionSection } from "@/components/members/RegionSection";
import { LANGUAGE_LABELS } from "@/services/countriesService";

const MembersDirectory = () => {
  const { t, currentLanguage } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const { 
    countriesByRegion, 
    regions,
    languages,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedRegion,
    setSelectedRegion,
    selectedStatus,
    setSelectedStatus,
    selectedLanguage,
    setSelectedLanguage,
    filteredCount
  } = useMembersDirectory();

  // Appliquer le filtre langue depuis l'URL
  useEffect(() => {
    const langParam = searchParams.get('language');
    if (langParam && languages.includes(langParam)) {
      setSelectedLanguage(langParam);
    }
  }, [searchParams, languages, setSelectedLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header ultra-léger */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center space-y-4">
          <Badge 
            variant="outline" 
            className="px-4 py-2 bg-primary/5 border-primary/20"
          >
            <Users className="w-4 h-4 mr-2" />
            {t('members.badge') || 'Annuaire'}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('members.title') || 'Pays Membres du Réseau'}
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('members.subtitle') || 
              "54 pays construisent ensemble l'avenir du Service Universel en Afrique"}
          </p>
        </div>
      </section>

      {/* Filtres - ligne unique */}
      <section className="py-4 border-y border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('members.search.placeholder') || "Rechercher un pays..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-3 items-center">
              <Select value={selectedRegion || "all"} onValueChange={(v) => setSelectedRegion(v === "all" ? null : v)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('members.filter.region') || "Région"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('members.filter.region.all') || "Toutes les régions"}</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus || "all"} onValueChange={(v) => setSelectedStatus(v === "all" ? null : v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('members.filter.status') || "Statut"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('members.filter.status.all') || "Tous"}</SelectItem>
                  <SelectItem value="active">{t('members.filter.status.active') || "Actif"}</SelectItem>
                  <SelectItem value="member">{t('members.filter.status.member') || "Membre"}</SelectItem>
                  <SelectItem value="joining">{t('members.filter.status.joining') || "En adhésion"}</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtre langue */}
              <Select value={selectedLanguage || "all"} onValueChange={(v) => setSelectedLanguage(v === "all" ? null : v)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder={currentLanguage === 'en' ? "Language" : "Langue"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{currentLanguage === 'en' ? "All languages" : "Toutes les langues"}</SelectItem>
                  {languages.map((lang) => {
                    const labelInfo = LANGUAGE_LABELS[lang];
                    const label = labelInfo 
                      ? `${labelInfo.flag} ${currentLanguage === 'en' ? labelInfo.en : labelInfo.fr}`
                      : lang.toUpperCase();
                    return (
                      <SelectItem key={lang} value={lang}>{label}</SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Badge résultats */}
              <Badge variant="secondary" className="hidden md:flex">
                {filteredCount} {t('members.results') || 'pays'}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Grille des pays par région */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">{t('common.loading') || 'Chargement...'}</p>
            </div>
          ) : Object.keys(countriesByRegion).length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('members.empty') || "Aucun pays ne correspond à vos critères"}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(countriesByRegion).map(([region, countries]) => (
                <RegionSection 
                  key={region} 
                  region={region} 
                  countries={countries} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MembersDirectory;
