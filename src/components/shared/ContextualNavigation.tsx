
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
    <div className="glass-card mb-6 animate-fade-in">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-primary rounded-full"></div>
            <h3 className="text-xl font-poppins font-semibold text-foreground gradient-text">
              Navigation Rapide
            </h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGoBack}
            className="hover-lift glass-subtle border-border/50 hover:border-primary/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <div
                key={item.path}
                className="group animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Button
                  variant={isActive ? "default" : "outline"}
                  className={`
                    w-full h-auto p-4 flex flex-col text-center nav-item hover-lift
                    ${isActive 
                      ? 'bg-gradient-primary shadow-elegant border-primary/20 text-primary-foreground' 
                      : 'glass-subtle border-border/50 hover:border-primary/30 hover:shadow-soft hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5'
                    }
                  `}
                  onClick={() => navigate(item.path)}
                >
                  <div className={`p-2 rounded-lg mb-3 transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium font-poppins">{item.title}</span>
                  <span className={`text-xs mt-1 transition-colors ${
                    isActive 
                      ? 'text-primary-foreground/80' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {item.description}
                  </span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ContextualNavigation;
