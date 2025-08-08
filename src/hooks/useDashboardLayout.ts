import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/utils/logger";

export interface DashboardWidget {
  id: string;
  type: 'stats' | 'regional-progress' | 'recent-activity' | 'quick-actions' | 'real-time-metrics' | 'custom-metrics';
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  lastModified: string;
}

const getDefaultLayout = (userRole: string | undefined): DashboardLayout => {
  const baseWidgets: DashboardWidget[] = [
    { id: 'stats', type: 'stats', enabled: true, order: 0 },
    { id: 'real-time-metrics', type: 'real-time-metrics', enabled: true, order: 1 },
    { id: 'recent-activity', type: 'recent-activity', enabled: true, order: 2 },
    { id: 'quick-actions', type: 'quick-actions', enabled: true, order: 3 }
  ];

  // Add regional progress for admins and editors
  if (userRole === 'super_admin' || userRole === 'admin_pays' || userRole === 'editeur') {
    baseWidgets.push({ 
      id: 'regional-progress', 
      type: 'regional-progress', 
      enabled: true, 
      order: 4 
    });
    baseWidgets.push({ 
      id: 'custom-metrics', 
      type: 'custom-metrics', 
      enabled: false, 
      order: 5 
    });
  }

  return {
    widgets: baseWidgets,
    lastModified: new Date().toISOString()
  };
};

export const useDashboardLayout = () => {
  const { profile } = useAuth();
  const [layout, setLayout] = useState<DashboardLayout>(() => 
    getDefaultLayout(profile?.role)
  );
  const [isLoading, setIsLoading] = useState(true);

  // Storage key based on user ID and role
  const storageKey = `dashboard-layout-${profile?.user_id || 'anonymous'}-${profile?.role || 'lecteur'}`;

  // Load layout from localStorage on mount
  useEffect(() => {
    if (!profile?.user_id) {
      setIsLoading(false);
      return;
    }

    try {
      const savedLayout = localStorage.getItem(storageKey);
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout) as DashboardLayout;
        setLayout(parsed);
      } else {
        // Save default layout
        const defaultLayout = getDefaultLayout(profile.role);
        setLayout(defaultLayout);
        localStorage.setItem(storageKey, JSON.stringify(defaultLayout));
      }
    } catch (error) {
      logger.error('Error loading dashboard layout:', error as any);
      const defaultLayout = getDefaultLayout(profile.role);
      setLayout(defaultLayout);
    }
    
    setIsLoading(false);
  }, [profile?.user_id, profile?.role, storageKey]);

  // Save layout to localStorage
  const saveLayout = (newLayout: DashboardLayout) => {
    const updatedLayout = {
      ...newLayout,
      lastModified: new Date().toISOString()
    };
    
    setLayout(updatedLayout);
    
    if (profile?.user_id) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedLayout));
      } catch (error) {
        logger.error('Error saving dashboard layout:', error as any);
      }
    }
  };

  // Toggle widget visibility
  const toggleWidget = (widgetId: string) => {
    const newLayout = {
      ...layout,
      widgets: layout.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    };
    saveLayout(newLayout);
  };

  // Remove widget (disable it)
  const removeWidget = (widgetId: string) => {
    toggleWidget(widgetId);
  };

  // Reorder widgets
  const reorderWidgets = (draggedId: string, droppedId: string) => {
    const draggedIndex = layout.widgets.findIndex(w => w.id === draggedId);
    const droppedIndex = layout.widgets.findIndex(w => w.id === droppedId);
    
    if (draggedIndex === -1 || droppedIndex === -1) return;

    const newWidgets = [...layout.widgets];
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(droppedIndex, 0, draggedWidget);

    // Update order values
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      order: index
    }));

    saveLayout({
      ...layout,
      widgets: updatedWidgets
    });
  };

  // Reset layout to default
  const resetLayout = () => {
    const defaultLayout = getDefaultLayout(profile?.role);
    saveLayout(defaultLayout);
  };

  // Get enabled widgets sorted by order
  const enabledWidgets = layout.widgets
    .filter(widget => widget.enabled)
    .sort((a, b) => a.order - b.order);

  return {
    layout,
    enabledWidgets,
    isLoading,
    toggleWidget,
    removeWidget,
    reorderWidgets,
    resetLayout,
    saveLayout
  };
};