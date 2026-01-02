import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";
import { PageHero } from "@/components/shared/PageHero";
import { Activity, Globe, Filter, Calendar } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";

const NetworkActivity = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");

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
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
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
            <ActivityTimeline maxItems={20} />
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default NetworkActivity;
