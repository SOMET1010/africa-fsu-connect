import { WebinarsHero } from "@/components/webinars/WebinarsHero";
import { UpcomingWebinars } from "@/components/webinars/UpcomingWebinars";
import { WebinarReplays } from "@/components/webinars/WebinarReplays";
import { useLearningContent } from "@/hooks/useLearningContent";
import { GlassCard } from "@/components/ui/glass-card";

export default function Webinars() {
  const { upcomingWebinars, replayWebinars, isLoading, error } = useLearningContent();

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="animate-fade-in">
          <WebinarsHero />
        </div>
        {isLoading && (
          <GlassCard className="animate-fade-in">
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          </GlassCard>
        )}
        {error && !isLoading && (
          <GlassCard className="animate-fade-in border-destructive/30 text-destructive">
            <p className="text-sm text-center">{error}</p>
          </GlassCard>
        )}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <UpcomingWebinars webinars={upcomingWebinars} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <WebinarReplays webinars={replayWebinars} />
        </div>
      </div>
    </div>
  );
}
