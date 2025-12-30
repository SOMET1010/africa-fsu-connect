
import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  keywords?: string[];
  category: string;
}

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Tableau de bord",
      description: "Voir votre dashboard personnalisé",
      category: "Navigation",
      action: () => {
        navigate("/dashboard");
        setOpen(false);
      },
      keywords: ["dashboard", "accueil", "home"]
    },
    {
      id: "nav-projects",
      title: "Projets",
      description: "Gérer vos projets",
      category: "Navigation", 
      action: () => {
        navigate("/projects");
        setOpen(false);
      },
      keywords: ["projects", "projets"]
    },
    {
      id: "nav-map",
      title: "Carte",
      description: "Voir la carte interactive",
      category: "Navigation",
      action: () => {
        navigate("/map");
        setOpen(false);
      },
      keywords: ["map", "carte", "géographique"]
    },
    {
      id: "nav-forum",
      title: "Forum",
      description: "Participer aux discussions",
      category: "Navigation",
      action: () => {
        navigate("/forum");
        setOpen(false);
      },
      keywords: ["forum", "discussion", "communauté"]
    },
    {
      id: "nav-resources",
      title: "Ressources",
      description: "Consulter les documents",
      category: "Navigation",
      action: () => {
        navigate("/resources");
        setOpen(false);
      },
      keywords: ["resources", "ressources", "documents", "docs"]
    },
    // Quick actions
    {
      id: "create-project",
      title: "Créer un projet",
      description: "Lancer un nouveau projet",
      category: "Actions",
      action: () => {
        navigate("/projects?action=create");
        setOpen(false);
      },
      keywords: ["créer", "nouveau", "projet"]
    },
    {
      id: "profile",
      title: "Mon profil",
      description: "Modifier votre profil",
      category: "Compte",
      action: () => {
        navigate("/profile");
        setOpen(false);
      },
      keywords: ["profil", "compte", "paramètres"]
    }
  ];

  // Filter commands based on user permissions
  const availableCommands = commands.filter(cmd => {
    if (!user && cmd.category === "Actions") return false;
    return true;
  });

  const groupedCommands = availableCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <>
      {/* Trigger button - can be placed anywhere */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez une commande ou cherchez..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <CommandGroup key={category} heading={category}>
              {commands.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={command.action}
                  className="flex items-center justify-between p-3 cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{command.title}</div>
                    {command.description && (
                      <div className="text-sm text-muted-foreground">{command.description}</div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
