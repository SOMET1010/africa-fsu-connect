import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Handshake, 
  MessageCircle, 
  Sparkles, 
  ChevronRight,
  Clock,
  MapPin,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  project?: string;
  country?: string;
  timestamp?: string;
  action?: { label: string; href: string };
}

interface AlertsPanelProps {
  alerts: Alert[];
  maxHeight?: string;
}

// Collaborative tone configuration
const alertConfig = {
  critical: {
    icon: Handshake,
    bgClass: "bg-primary/10 border-primary/30",
    iconClass: "text-primary",
    badgeClass: "bg-primary text-primary-foreground",
    label: "Collaboration",
    pulseClass: "",
  },
  warning: {
    icon: MessageCircle,
    bgClass: "bg-info/10 border-info/30",
    iconClass: "text-info",
    badgeClass: "bg-info text-info-foreground",
    label: "Coordination",
    pulseClass: "",
  },
  info: {
    icon: Sparkles,
    bgClass: "bg-success/10 border-success/30",
    iconClass: "text-success",
    badgeClass: "bg-success text-success-foreground",
    label: "Bonne nouvelle",
    pulseClass: "",
  },
};

export const AlertsPanel = ({ alerts, maxHeight = "320px" }: AlertsPanelProps) => {
  const collaborationCount = alerts.filter(a => a.level === 'critical').length;
  const coordinationCount = alerts.filter(a => a.level === 'warning').length;
  const goodNewsCount = alerts.filter(a => a.level === 'info').length;

  // Sort alerts by type
  const sortedAlerts = [...alerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.level] - order[b.level];
  });

  if (alerts.length === 0) {
    return (
      <Card className="premium-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-success" />
            Coordination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-success/10 mb-3">
              <Sparkles className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium text-success">Réseau en harmonie</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tous les pays membres avancent au rythme prévu
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Coordination
          </CardTitle>
          <div className="flex gap-1.5 flex-wrap">
            {collaborationCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5">
                {collaborationCount} collab.
              </Badge>
            )}
            {coordinationCount > 0 && (
              <Badge className="bg-info text-info-foreground text-[10px] px-1.5">
                {coordinationCount} coord.
              </Badge>
            )}
            {goodNewsCount > 0 && (
              <Badge className="bg-success text-success-foreground text-[10px] px-1.5">
                {goodNewsCount} ✨
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-3 pr-2">
            {sortedAlerts.map((alert, index) => {
              const config = alertConfig[alert.level];
              const Icon = config.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-3 rounded-xl border transition-all hover:shadow-sm",
                    config.bgClass,
                    config.pulseClass
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("p-1.5 rounded-lg bg-background/50", config.iconClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn("text-[10px] px-1.5 py-0", config.badgeClass)}>
                          {config.label}
                        </Badge>
                        {alert.country && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {alert.country}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium leading-tight">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {alert.description}
                      </p>
                      {alert.project && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Projet : <span className="font-medium">{alert.project}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {alert.timestamp && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {alert.timestamp}
                          </span>
                        )}
                        {alert.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2 ml-auto"
                            asChild
                          >
                            <Link to={alert.action.href}>
                              {alert.action.label}
                              <ChevronRight className="h-3 w-3 ml-0.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
