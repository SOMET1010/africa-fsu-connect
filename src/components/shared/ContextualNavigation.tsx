
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  TrendingUp, 
  Building2, 
  FileText, 
  MessageSquare, 
  Calendar,
  ArrowLeft
} from "lucide-react";

const navigationItems = [
  { title: "Tableau de Bord", path: "/dashboard", icon: Home, description: "Vue d'ensemble" },
  { title: "Indicateurs", path: "/indicators", icon: TrendingUp, description: "Données et métriques" },
  { title: "Organisations", path: "/organizations", icon: Building2, description: "Annuaire FSU" },
  { title: "Projets", path: "/projects", icon: FileText, description: "Initiatives FSU" },
  { title: "Forum", path: "/forum", icon: MessageSquare, description: "Discussions" },
  { title: "Événements", path: "/events", icon: Calendar, description: "Agenda" },
];

export function ContextualNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Navigation Rapide</h3>
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "outline"}
                className="flex flex-col h-auto p-3 text-center"
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-5 w-5 mb-2" />
                <span className="text-xs font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground mt-1">{item.description}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default ContextualNavigation;
