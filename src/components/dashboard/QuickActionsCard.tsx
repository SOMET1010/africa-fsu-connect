
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
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();

  const quickActions: QuickAction[] = [
    {
      id: "new-project",
      title: t('actions.new.project'),
      description: t('actions.new.project.desc'),
      icon: Plus,
      route: "/projects",
      variant: "default",
      roles: ["contributor", "editor", "country_admin", "super_admin"],
      badge: t('actions.priority')
    },
    {
      id: "documents",
      title: t('actions.share.document'),
      description: t('actions.share.document.desc'),
      icon: FileText,
      route: "/submit",
      variant: "outline",
      roles: ["contributor", "editor", "country_admin", "super_admin"]
    },
    {
      id: "organizations",
      title: t('actions.explore.organizations'),
      description: t('actions.explore.organizations.desc'),
      icon: Building2,
      route: "/organizations",
      variant: "outline",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    },
    {
      id: "events",
      title: t('actions.plan.event'),
      description: t('actions.plan.event.desc'),
      icon: Calendar,
      route: "/events",
      variant: "outline",
      roles: ["editor", "country_admin", "super_admin"]
    },
    {
      id: "forum",
      title: t('actions.new.discussion'),
      description: t('actions.new.discussion.desc'),
      icon: MessageSquare,
      route: "/forum",
      variant: "outline",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    },
    {
      id: "resources",
      title: t('actions.consult.resources'),
      description: t('actions.consult.resources.desc'),
      icon: BookOpen,
      route: "/resources",
      variant: "secondary",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    }
  ];

  const userRole = profile?.role || "reader";
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
          <span>{t('actions.title')}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('actions.subtitle')}
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
            {t('actions.customize')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
