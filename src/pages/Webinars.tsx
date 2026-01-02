import { WebinarsHero } from "@/components/webinars/WebinarsHero";
import { UpcomingWebinars } from "@/components/webinars/UpcomingWebinars";
import { WebinarReplays } from "@/components/webinars/WebinarReplays";

export default function Webinars() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <WebinarsHero />
      <UpcomingWebinars />
      <WebinarReplays />
    </div>
  );
}
