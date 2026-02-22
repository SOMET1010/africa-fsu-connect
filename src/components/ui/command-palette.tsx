import { useState, useEffect, useMemo } from "react";
import { Search, ChevronRight, FileText, MessageSquare, FolderKanban, Loader2, X } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useUnifiedSearch, type SearchFilters } from "@/hooks/useUnifiedSearch";
import { useCountries } from "@/hooks/useCountries";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ContentType = 'document' | 'forum' | 'project';

const DOCUMENT_TYPES = ['guide', 'rapport', 'presentation', 'formulaire', 'autre'] as const;

interface NavCommand {
  id: string;
  title: string;
  description?: string;
  action: () => void;
  category: string;
}

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<ContentType[]>(['document', 'forum', 'project']);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [documentType, setDocumentType] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, currentLanguage } = useTranslation();
  const { data: countries } = useCountries();

  const filters: SearchFilters = useMemo(() => ({
    types: activeTypes,
    country: country || undefined,
    documentType: documentType || undefined,
  }), [activeTypes, country, documentType]);

  const { results, loading, hasResults } = useUnifiedSearch(query, filters);

  const hasActiveFilters = activeTypes.length < 3 || !!country || !!documentType;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveTypes(['document', 'forum', 'project']);
      setCountry(undefined);
      setDocumentType(undefined);
    }
  }, [open]);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const toggleType = (type: ContentType) => {
    setActiveTypes(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const clearFilters = () => {
    setActiveTypes(['document', 'forum', 'project']);
    setCountry(undefined);
    setDocumentType(undefined);
  };

  const navCommands: NavCommand[] = [
    { id: "nav-dashboard", title: t("nav.dashboard") || "Tableau de bord", category: "Navigation", action: () => go("/dashboard") },
    { id: "nav-projects", title: t("nav.projects") || "Projets", category: "Navigation", action: () => go("/projects") },
    { id: "nav-map", title: t("nav.map") || "Carte", category: "Navigation", action: () => go("/map") },
    { id: "nav-forum", title: t("nav.forum") || "Forum", category: "Navigation", action: () => go("/forum") },
    { id: "nav-resources", title: t("nav.resources") || "Ressources", category: "Navigation", action: () => go("/resources") },
  ];

  const actionCommands: NavCommand[] = user
    ? [
        { id: "create-project", title: t("nav.submit") || "Créer un projet", category: "Actions", action: () => go("/projects?action=create") },
        { id: "profile", title: t("nav.profile") || "Mon profil", category: "Compte", action: () => go("/profile") },
      ]
    : [];

  const isSearching = query.trim().length >= 2;
  const placeholder = t("search.placeholder") || "Rechercher documents, forum, projets...";

  const countryName = (c: any) => currentLanguage === 'en' ? c.name_en : c.name_fr;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>{t("search.hint") || "Rechercher..."}</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
        />

        {/* Filter chips row */}
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-border">
          {/* Content type toggles */}
          {([
            { type: 'document' as ContentType, label: t("search.filters.documents") || "Documents", icon: FileText },
            { type: 'forum' as ContentType, label: t("search.filters.forum") || "Forum", icon: MessageSquare },
            { type: 'project' as ContentType, label: t("search.filters.projects") || "Projets", icon: FolderKanban },
          ]).map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                activeTypes.includes(type)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-border hover:bg-accent'
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}

          {/* Country dropdown */}
          <Select value={country || "__all__"} onValueChange={(v) => setCountry(v === "__all__" ? undefined : v)}>
            <SelectTrigger className="h-7 w-auto min-w-[80px] max-w-[140px] text-xs border-border rounded-full px-2 gap-1">
              <SelectValue placeholder={t("search.filters.country") || "Pays"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t("search.filters.all") || "Tous"}</SelectItem>
              {(countries || []).map((c) => (
                <SelectItem key={c.code} value={c.code}>{countryName(c)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Document type dropdown */}
          <Select value={documentType || "__all__"} onValueChange={(v) => setDocumentType(v === "__all__" ? undefined : v)}>
            <SelectTrigger className="h-7 w-auto min-w-[70px] max-w-[130px] text-xs border-border rounded-full px-2 gap-1">
              <SelectValue placeholder={t("search.filters.document_type") || "Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t("search.filters.all") || "Tous"}</SelectItem>
              {DOCUMENT_TYPES.map((dt) => (
                <SelectItem key={dt} value={dt}>
                  {t(`search.filters.doctype.${dt}`) || dt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
              {t("search.filters.clear") || "Effacer"}
            </button>
          )}
        </div>

        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {isSearching && !loading && !hasResults && (
            <CommandEmpty>{t("search.no_results") || "Aucun résultat trouvé."}</CommandEmpty>
          )}

          {isSearching && results.documents.length > 0 && (
            <CommandGroup heading={t("search.documents") || "Documents"}>
              {results.documents.map((r) => (
                <CommandItem key={r.id} onSelect={() => go(r.url)} className="flex items-center gap-3 p-3 cursor-pointer">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.title}</div>
                    {r.description && <div className="text-sm text-muted-foreground truncate">{r.description}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {isSearching && results.forum.length > 0 && (
            <CommandGroup heading={t("search.forum") || "Discussions du Forum"}>
              {results.forum.map((r) => (
                <CommandItem key={r.id} onSelect={() => go(r.url)} className="flex items-center gap-3 p-3 cursor-pointer">
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.title}</div>
                    {r.description && <div className="text-sm text-muted-foreground truncate">{r.description}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {isSearching && results.projects.length > 0 && (
            <CommandGroup heading={t("search.projects") || "Projets"}>
              {results.projects.map((r) => (
                <CommandItem key={r.id} onSelect={() => go(r.url)} className="flex items-center gap-3 p-3 cursor-pointer">
                  <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.title}</div>
                    {r.description && <div className="text-sm text-muted-foreground truncate">{r.description}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isSearching && (
            <>
              <CommandGroup heading="Navigation">
                {navCommands.map((cmd) => (
                  <CommandItem key={cmd.id} onSelect={cmd.action} className="flex items-center justify-between p-3 cursor-pointer">
                    <div className="font-medium">{cmd.title}</div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
              {actionCommands.length > 0 && (
                <CommandGroup heading="Actions">
                  {actionCommands.map((cmd) => (
                    <CommandItem key={cmd.id} onSelect={cmd.action} className="flex items-center justify-between p-3 cursor-pointer">
                      <div className="font-medium">{cmd.title}</div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
