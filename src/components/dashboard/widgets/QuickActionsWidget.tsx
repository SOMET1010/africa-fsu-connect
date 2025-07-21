import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Users,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant: 'primary' | 'secondary' | 'accent' | 'outline';
  badge?: string;
  roles?: string[];
}

const quickActions: QuickAction[] = [
  {
    id: 'new-project',
    title: 'Nouveau Projet',
    description: 'Créer un projet FSU',
    icon: Plus,
    href: '/projects?action=create',
    variant: 'primary',
    badge: 'Populaire',
    roles: ['admin_pays', 'editeur', 'super_admin']
  },
  {
    id: 'upload-doc',
    title: 'Partager Document',
    description: 'Ajouter une ressource',
    icon: Upload,
    href: '/resources?action=upload',
    variant: 'secondary'
  },
  {
    id: 'join-event',
    title: 'Événements',
    description: 'Voir les formations',
    icon: Calendar,
    href: '/events',
    variant: 'accent'
  },
  {
    id: 'join-forum',
    title: 'Forum',
    description: 'Participer aux discussions',
    icon: MessageSquare,
    href: '/forum',
    variant: 'outline'
  },
  {
    id: 'submit',
    title: 'Soumettre',
    description: 'Nouvelle soumission',
    icon: FileText,
    href: '/submit',
    variant: 'outline',
    roles: ['editeur', 'admin_pays', 'super_admin']
  },
  {
    id: 'organizations',
    title: 'Organisations',
    description: 'Explorer la carte',
    icon: Users,
    href: '/organizations',
    variant: 'outline'
  }
];

export function QuickActionsWidget() {
  const { profile } = useProfile();
  
  const filteredActions = quickActions.filter(action => 
    !action.roles || action.roles.includes(profile?.role || 'lecteur')
  );

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-dark text-primary-foreground shadow-elegant';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-soft';
      case 'accent':
        return 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-soft';
      default:
        return 'bg-card hover:bg-muted border-2 border-border hover:border-primary/30 shadow-subtle';
    }
  };

  return (
    <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Actions Rapides
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {filteredActions.length} disponibles
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.id} to={action.href} className="group">
                <Button
                  variant="ghost"
                  className={`h-auto p-4 flex-col items-start text-left w-full relative overflow-hidden transition-all duration-300 hover:scale-[1.02] animate-fade-in ${getVariantClasses(action.variant)}`}
                >
                  {action.badge && (
                    <Badge 
                      variant="outline" 
                      className="absolute top-2 right-2 text-xs bg-background/80 backdrop-blur-sm"
                    >
                      {action.badge}
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between w-full mb-2">
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  
                  <div className="w-full">
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs opacity-80 line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}