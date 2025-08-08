import { useState, useDeferredValue, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { debounce } from "@/utils/performanceOptimizer";

interface OptimizedSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const OptimizedSearchBar = ({ 
  onSearch, 
  placeholder = "Rechercher...", 
  className,
  debounceMs = 300
}: OptimizedSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  // Debounced search function
  const debouncedSearch = debounce((searchQuery: string) => {
    startTransition(() => {
      onSearch(searchQuery);
    });
  }, debounceMs);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className={cn(
          "pl-10 pr-4",
          isPending && "opacity-50"
        )}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};