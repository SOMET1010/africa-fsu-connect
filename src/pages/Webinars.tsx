import { WebinarsHero } from "@/components/webinars/WebinarsHero";
import { UpcomingWebinars } from "@/components/webinars/UpcomingWebinars";
import { WebinarReplays } from "@/components/webinars/WebinarReplays";

export default function Webinars() {
  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="animate-fade-in">
          <WebinarsHero />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <UpcomingWebinars />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <WebinarReplays />
        </div>
      </div>
    </div>
  );
}
