import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";
import { PageHero } from "@/components/shared/PageHero";
import { Activity, Globe, Filter, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { useCountries } from "@/hooks/useCountries";
import { useNetworkActivity } from "@/hooks/useNetworkActivity";

const NetworkActivity = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const { data: countries } = useCountries();
  const { activities, loading: activityLoading, error: activityError } = useNetworkActivity(50);

  const regions = [
    { value: "all", label: t('filter.region.all') },
    { value: "west", label: t('filter.region.west') },
    { value: "central", label: t('filter.region.central') },
    { value: "east", label: t('filter.region.east') },
    { value: "south", label: t('filter.region.south') },
    { value: "north", label: t('filter.region.north') },
  ];

  const activityTypes = [
    { value: "all", label: t('filter.type.all') },
    { value: "project", label: t('filter.type.project') },
    { value: "document", label: t('filter.type.document') },
    { value: "event", label: t('filter.type.event') },
    { value: "discussion", label: t('filter.type.discussion') },
    { value: "collaboration", label: t('filter.type.collaboration') },
  ];

  const periods = [
    { value: "week", label: t('filter.period.week') },
    { value: "month", label: t('filter.period.month') },
    { value: "quarter", label: t('filter.period.quarter') },
    { value: "year", label: t('filter.period.year') },
  ];

  const normalizeLabel = (value?: string) => value
    ? value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z]/g, "")
    : "";

  const findCountryByLabel = (label?: string) => {
    if (!label || !countries) return null;
    const normalizedLabel = normalizeLabel(label);
    return countries.find((country) => {
      const codeMatch = normalizeLabel(country.code) === normalizedLabel;
      const nameFrMatch = normalizeLabel(country.name_fr) === normalizedLabel;
      const nameEnMatch = normalizeLabel(country.name_en) === normalizedLabel;
      const partialFr = normalizeLabel(country.name_fr).includes(normalizedLabel);
      const partialEn = normalizeLabel(country.name_en).includes(normalizedLabel);
      return codeMatch || nameFrMatch || nameEnMatch || partialFr || partialEn;
    });
  };

  const REGION_KEYWORDS: Record<string, string[]> = {
    west: ["ouest"],
    central: ["centrale"],
    east: ["est"],
    south: ["australe", "sud"],
    north: ["nord", "maghreb"],
  };

  const matchesRegion = (countryLabel: string) => {
    if (selectedRegion === "all") return true;
    const country = findCountryByLabel(countryLabel);
    if (!country || !country.region) return false;
    const regionKeywords = REGION_KEYWORDS[selectedRegion] || [];
    const regionValue = country.region.toLowerCase();
    return regionKeywords.some((keyword) => regionValue.includes(keyword));
  };

  const periodDays: Record<string, number> = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
  };

  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    const thresholdMs = periodDays[selectedPeriod] * 24 * 60 * 60 * 1000;
    const minTimestamp = Date.now() - thresholdMs;

    return activities.filter((activity) => {
      const matchesType =
        selectedType === "all"
          ? true
          : selectedType === "collaboration"
            ? activity.type === "discussion"
            : activity.type === selectedType;

      const matchesRegionFilter = activity.country
        ? matchesRegion(activity.country)
        : selectedRegion === "all";

      const matchesPeriod = activity.timestamp >= minTimestamp;

      return matchesType && matchesRegionFilter && matchesPeriod;
    });
  }, [activities, selectedType, selectedRegion, selectedPeriod]);

  const timelineActivities = filteredActivities.slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <PageContainer className="py-8">
        {/* Hero */}
        <PageHero
          badge={t('activity.page.badge')}
          badgeIcon={Activity}
          title={t('activity.page.title')}
          subtitle={t('activity.page.subtitle')}
          className="mb-8"
        />

        {/* Network Presence Summary */}
        <Card className="mb-8 bg-card border-border">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('activity.presence.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('activity.presence.desc')}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <PresenceIndicator level={8} maxLevel={10} size="lg" />
                <span className="text-sm text-muted-foreground font-medium">
                  {t('activity.presence.status')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Filter className="h-5 w-5" />
              {t('activity.filter.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium text-muted-foreground flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-4 w-4" />
                  {t('filter.period')}
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filter.period.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium text-muted-foreground flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Globe className="h-4 w-4" />
                  {t('filter.region')}
                </label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filter.region.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium text-muted-foreground flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Activity className="h-4 w-4" />
                  {t('filter.type')}
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filter.type.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className="h-5 w-5 text-primary" />
              {t('activity.timeline.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline
              maxItems={20}
              activities={timelineActivities}
              loading={activityLoading}
              error={activityError}
            />
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default NetworkActivity;
