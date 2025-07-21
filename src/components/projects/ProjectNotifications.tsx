
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "@/types/projects";

interface ProjectNotificationsProps {
  projects: Project[];
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  project: Project;
  timestamp: Date;
  read: boolean;
}

export const ProjectNotifications = ({ projects }: ProjectNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Générer des notifications basées sur l'état des projets
    const newNotifications: Notification[] = [];

    projects.forEach(project => {
      const now = new Date();
      const endDate = project.end_date ? new Date(project.end_date) : null;
      const daysUntilEnd = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

      // Projets en retard
      if (endDate && daysUntilEnd && daysUntilEnd < 0 && project.status === 'ongoing') {
        newNotifications.push({
          id: `late-${project.id}`,
          type: 'error',
          title: 'Projet en retard',
          message: `Le projet "${project.title}" a dépassé sa date de fin prévue de ${Math.abs(daysUntilEnd)} jours.`,
          project,
          timestamp: now,
          read: false
        });
      }

      // Projets proches de l'échéance
      if (endDate && daysUntilEnd && daysUntilEnd > 0 && daysUntilEnd <= 30 && project.status === 'ongoing') {
        newNotifications.push({
          id: `upcoming-${project.id}`,
          type: 'warning',
          title: 'Échéance approchante',
          message: `Le projet "${project.title}" se termine dans ${daysUntilEnd} jours.`,
          project,
          timestamp: now,
          read: false
        });
      }

      // Projets avec faible progression
      if (project.status === 'ongoing' && (project.completion_percentage || 0) < 20) {
        newNotifications.push({
          id: `low-progress-${project.id}`,
          type: 'warning',
          title: 'Progression faible',
          message: `Le projet "${project.title}" n'a que ${project.completion_percentage || 0}% de progression.`,
          project,
          timestamp: now,
          read: false
        });
      }

      // Projets terminés récemment
      if (project.status === 'completed') {
        newNotifications.push({
          id: `completed-${project.id}`,
          type: 'success',
          title: 'Projet terminé',
          message: `Le projet "${project.title}" a été terminé avec succès.`,
          project,
          timestamp: now,
          read: false
        });
      }
    });

    setNotifications(newNotifications);
  }, [projects]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications projets
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`border rounded-lg p-4 ${getNotificationColor(notification.type)} ${
                  notification.read ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.project.agencies?.acronym}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs"
                    >
                      Marquer comme lu
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
