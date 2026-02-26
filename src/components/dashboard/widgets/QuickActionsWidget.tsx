import { Plus, FileText, Users, Calendar, MessageSquare, Settings, BarChart3, Shield } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface QuickActionsWidgetProps {
  id: string;
  onRemove?: (id: string) => void;
}

export const QuickActionsWidget = ({ id, onRemove }: QuickActionsWidgetProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const quickActions = [
    {
      label: "Nouveau Projet",
      description: "Créer un nouveau projet",
      icon: Plus,
      action: () => navigate("/submit"),
      color: "bg-primary hover:bg-primary/90",
      available: true
    },
    {
      label: "Documents",
      description: "Gérer les ressources",
      icon: FileText,
      action: () => navigate("/resources"),
      color: "bg-green-600 hover:bg-green-700",
      available: true
    },
    {
      label: "Événements",
      description: "Voir le calendrier",
      icon: Calendar,
      action: () => navigate("/events"),
      color: "bg-purple-600 hover:bg-purple-700",
      available: true
    },
    {
      label: "Forum",
      description: "Discussions communautaires",
      icon: MessageSquare,
      action: () => navigate("/forum"),
      color: "bg-blue-600 hover:bg-blue-700",
      available: true
    },
    {
      label: "Analytics",
      description: "Tableaux de bord",
      icon: BarChart3,
      action: () => navigate("/organizations"),
      color: "bg-orange-600 hover:bg-orange-700",
      available: profile?.role === 'super_admin' || profile?.role === 'country_admin'
    },
    {
      label: "Administration",
      description: "Gestion système",
      icon: Settings,
      action: () => navigate("/admin"),
      color: "bg-gray-600 hover:bg-gray-700",
      available: profile?.role === 'super_admin' || profile?.role === 'country_admin'
    },
    {
      label: "Sécurité",
      description: "Paramètres de sécurité",
      icon: Shield,
      action: () => navigate("/security"),
      color: "bg-red-600 hover:bg-red-700",
      available: true
    },
    {
      label: "Organisations",
      description: "Gérer les agences",
      icon: Users,
      action: () => navigate("/organizations"),
      color: "bg-indigo-600 hover:bg-indigo-700",
      available: true
    }
  ].filter(action => action.available);

  return (
    <DashboardWidget
      id={id}
      title="Actions Rapides"
      icon={<Plus className="h-5 w-5 text-primary" />}
      isRemovable
      onRemove={onRemove}
    >
      <div className="grid grid-cols-2 gap-3">
        {quickActions.slice(0, 6).map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={`p-4 h-auto flex-col gap-2 hover:scale-[1.02] transition-all duration-200 ${action.color} text-white border-0`}
            onClick={action.action}
          >
            <action.icon className="h-5 w-5" />
            <div className="text-center">
              <div className="font-medium text-sm">{action.label}</div>
              <div className="text-xs opacity-80">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
      
      {quickActions.length > 6 && (
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" className="w-full text-sm" onClick={() => navigate("/preferences")}>
            Voir toutes les actions
          </Button>
        </div>
      )}
    </DashboardWidget>
  );
};
