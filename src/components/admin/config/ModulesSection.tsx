import { ConfigSection } from './ConfigSection';
import { LayoutGrid } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { ModuleConfig } from '@/types/platformConfig';

interface ModulesSectionProps {
  modules: ModuleConfig[];
  onChange: (modules: ModuleConfig[]) => void;
}

export const ModulesSection = ({ modules, onChange }: ModulesSectionProps) => {
  const handleToggle = (id: string, enabled: boolean) => {
    const updated = modules.map(m => 
      m.id === id ? { ...m, enabled } : m
    );
    onChange(updated);
  };

  const enabledCount = modules.filter(m => m.enabled).length;
  const isComplete = enabledCount >= 3;

  return (
    <ConfigSection
      title="Modules à activer"
      description={`${enabledCount} modules activés sur ${modules.length}`}
      icon={<LayoutGrid className="h-5 w-5" />}
      isComplete={isComplete}
    >
      <div className="space-y-4">
        {modules.map((module) => (
          <div 
            key={module.id} 
            className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <Label htmlFor={module.id} className="font-medium cursor-pointer">
                {module.name}
              </Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {module.description}
              </p>
            </div>
            <Switch
              id={module.id}
              checked={module.enabled}
              onCheckedChange={(checked) => handleToggle(module.id, checked)}
            />
          </div>
        ))}
      </div>
    </ConfigSection>
  );
};
