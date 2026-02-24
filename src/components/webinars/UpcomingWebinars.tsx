import { WebinarCard, type WebinarCardProps } from "./WebinarCard";

interface UpcomingWebinarsProps {
  webinars?: WebinarCardProps[];
}

export function UpcomingWebinars({ webinars = [] }: UpcomingWebinarsProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        📅 Prochains webinaires
      </h2>
      
      {webinars.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground">
          Aucune session planifiée pour le moment.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map((webinar) => (
            <WebinarCard key={webinar.id} {...webinar} />
          ))}
        </div>
      )}
    </section>
  );
}
