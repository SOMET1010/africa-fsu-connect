import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfigSection } from './ConfigSection';
import { Calendar, CheckCircle2, Clock, Circle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DeploymentMilestone } from '@/types/platformConfig';

interface MilestonesSectionProps {
  milestones: DeploymentMilestone[];
  onChange: (milestones: DeploymentMilestone[]) => void;
}

const STATUS_CONFIG = {
  pending: { icon: Circle, label: 'En attente', className: 'text-muted-foreground' },
  in_progress: { icon: Clock, label: 'En cours', className: 'text-amber-500' },
  completed: { icon: CheckCircle2, label: 'Terminé', className: 'text-green-500' },
};

export const MilestonesSection = ({ milestones, onChange }: MilestonesSectionProps) => {
  const handleChange = (id: string, field: keyof DeploymentMilestone, value: string) => {
    const updated = milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    onChange(updated);
  };

  const completedCount = milestones.filter(m => m.targetDate).length;
  const isComplete = completedCount === milestones.length;

  return (
    <ConfigSection
      title="Calendrier de déploiement"
      description={`${completedCount}/${milestones.length} jalons planifiés`}
      icon={<Calendar className="h-5 w-5" />}
      isComplete={isComplete}
    >
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const StatusIcon = STATUS_CONFIG[milestone.status].icon;
          
          return (
            <div 
              key={milestone.id} 
              className="flex items-center gap-4 p-3 border border-border/50 rounded-lg"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                {index + 1}
              </div>
              
              <div className="flex-1 grid gap-3 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium">{milestone.name}</Label>
                </div>
                
                <div>
                  <Input
                    type="date"
                    value={milestone.targetDate}
                    onChange={(e) => handleChange(milestone.id, 'targetDate', e.target.value)}
                    className="h-9"
                  />
                </div>
                
                <div>
                  <Select
                    value={milestone.status}
                    onValueChange={(value) => handleChange(milestone.id, 'status', value)}
                  >
                    <SelectTrigger className="h-9">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${STATUS_CONFIG[milestone.status].className}`} />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ConfigSection>
  );
};
