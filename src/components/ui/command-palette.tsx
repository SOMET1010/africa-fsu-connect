import { useState, useEffect } from "react";
import { Search, ChevronRight, FileText, MessageSquare, FolderKanban, Loader2 } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useUnifiedSearch } from "@/hooks/useUnifiedSearch";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { results, loading, hasResults } = useUnifiedSearch(query);

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

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
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
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {isSearching && !loading && !hasResults && (
            <CommandEmpty>{t("search.no_results") || "Aucun résultat trouvé."}</CommandEmpty>
          )}

          {/* Live search results */}
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

          {/* Static nav fallback when not searching */}
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
