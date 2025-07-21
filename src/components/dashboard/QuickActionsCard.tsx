
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Users, 
  Building2,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  variant: "default" | "outline" | "secondary";
  roles: string[];
  badge?: string;
}

export function QuickActionsCard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: "new-project",
      title: "Nouveau Projet FSU",
      description: "Lancer une nouvelle initiative",
      icon: Plus,
      route: "/projects",
      variant: "default",
      roles: ["contributeur", "editeur", "admin_pays", "super_admin"],
      badge: "Priorité"
    },
    {
      id: "documents",
      title: "Partager Document",
      description: "Ajouter une ressource",
      icon: FileText,
      route: "/submit",
      variant: "outline",
      roles: ["contributeur", "editeur", "admin_pays", "super_admin"]
    },
    {
      id: "organizations",
      title: "Explorer Organisations",
      description: "Découvrir les partenaires",
      icon: Building2,
      route: "/organizations",
      variant: "outline",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    },
    {
      id: "events",
      title: "Planifier Événement",
      description: "Organiser une rencontre",
      icon: Calendar,
      route: "/events",
      variant: "outline",
      roles: ["editeur", "admin_pays", "super_admin"]
    },
    {
      id: "forum",
      title: "Nouvelle Discussion",
      description: "Démarrer un échange",
      icon: MessageSquare,
      route: "/forum",
      variant: "outline",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    },
    {
      id: "resources",
      title: "Consulter Ressources",
      description: "Accéder aux guides",
      icon: BookOpen,
      route: "/docs",
      variant: "secondary",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    }
  ];

  const userRole = profile?.role || "lecteur";
  const availableActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  );

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <span>Actions Rapides</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Accès direct aux fonctionnalités principales
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3">
          {availableActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                onClick={() => handleActionClick(action.route)}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm text-foreground">
                        {action.title}
                      </p>
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/profile")}
          >
            <Users className="h-4 w-4 mr-2" />
            Personnaliser mes actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
