import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  ChevronRight,
  Clock,
  MapPin
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

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    bgClass: "bg-destructive/10 border-destructive/30",
    iconClass: "text-destructive",
    badgeClass: "bg-destructive text-destructive-foreground",
    label: "Critique",
    pulseClass: "animate-pulse",
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-warning/10 border-warning/30",
    iconClass: "text-warning",
    badgeClass: "bg-warning text-warning-foreground",
    label: "Attention",
    pulseClass: "",
  },
  info: {
    icon: Info,
    bgClass: "bg-info/10 border-info/30",
    iconClass: "text-info",
    badgeClass: "bg-info text-info-foreground",
    label: "Info",
    pulseClass: "",
  },
};

export const AlertsPanel = ({ alerts, maxHeight = "320px" }: AlertsPanelProps) => {
  const criticalCount = alerts.filter(a => a.level === 'critical').length;
  const warningCount = alerts.filter(a => a.level === 'warning').length;

  // Sort alerts by severity
  const sortedAlerts = [...alerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.level] - order[b.level];
  });

  if (alerts.length === 0) {
    return (
      <Card className="premium-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-success" />
            Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-success/10 mb-3">
              <AlertCircle className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium text-success">Aucune alerte</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tous les projets sont dans les délais
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
            <AlertTriangle className={cn(
              "h-5 w-5",
              criticalCount > 0 ? "text-destructive animate-pulse" : "text-warning"
            )} />
            Alertes prioritaires
          </CardTitle>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalCount} critique{criticalCount > 1 ? 's' : ''}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-warning text-warning-foreground text-xs">
                {warningCount} attention
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
                    "p-3 rounded-xl border transition-all",
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
