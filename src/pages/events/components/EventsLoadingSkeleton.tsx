import { Skeleton } from "@/components/ui/skeleton";

export const EventsLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="p-6 lg:p-8 space-y-8">
        <Skeleton className="h-64 w-full rounded-3xl bg-white/5" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
};
