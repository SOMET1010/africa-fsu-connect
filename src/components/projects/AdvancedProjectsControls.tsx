import React from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ProjectsMap } from './ProjectsMap';
import { ProjectAnalytics } from './ProjectAnalytics';
import { ProjectReports } from './ProjectReports';
import { ProjectNotifications } from './ProjectNotifications';
import { ProjectExport } from './ProjectExport';
import { ModernCard } from '@/components/ui/modern-card';
import { 
  Map,
  BarChart3,
  FileText,
  Bell,
  Filter,
  Download
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedProjectsControlsProps {
  projects: any[];
  filteredProjects: any[];
  viewMode: 'grid' | 'map' | 'analytics' | 'reports' | 'notifications';
  onViewModeChange: (mode: 'grid' | 'map' | 'analytics' | 'reports' | 'notifications') => void;
  selectedRegion: string;
  selectedStatus: string;
  onRegionChange: (region: string) => void;
  onStatusChange: (status: string) => void;
  regions: string[];
  statuses: string[];
}

export const AdvancedProjectsControls = ({
  projects,
  filteredProjects,
  viewMode,
  onViewModeChange,
  selectedRegion,
  selectedStatus,
  onRegionChange,
  onStatusChange,
  regions,
  statuses
}: AdvancedProjectsControlsProps) => {

  return (
    <div className="space-y-6">
      {/* Vue Mode Selector */}
      <ModernCard variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Vues Avancées</h3>
          <div className="flex border border-border/50 rounded-xl p-1 bg-muted/30">
            <ModernButton 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              Liste
            </ModernButton>
            <ModernButton 
              variant={viewMode === 'map' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onViewModeChange('map')}
            >
              <Map className="h-4 w-4 mr-1" />
              Carte
            </ModernButton>
            <ModernButton 
              variant={viewMode === 'analytics' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onViewModeChange('analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </ModernButton>
            <ModernButton 
              variant={viewMode === 'reports' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onViewModeChange('reports')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Rapports
            </ModernButton>
            <ModernButton 
              variant={viewMode === 'notifications' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onViewModeChange('notifications')}
            >
              <Bell className="h-4 w-4" />
            </ModernButton>
          </div>
        </div>

        {/* Filtres avancés */}
        {viewMode === 'grid' && (
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Filtres avancés</span>
          </div>
        )}
        
        {viewMode === 'grid' && (
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </ModernCard>

      {/* Export Tools */}
      {viewMode !== 'notifications' && (
        <ProjectExport projects={filteredProjects} />
      )}

      {/* View-specific content */}
      {viewMode === 'map' && <ProjectsMap projects={filteredProjects} />}
      {viewMode === 'analytics' && <ProjectAnalytics projects={filteredProjects} />}
      {viewMode === 'reports' && <ProjectReports projects={filteredProjects} />}
      {viewMode === 'notifications' && <ProjectNotifications projects={filteredProjects} />}
    </div>
  );
};