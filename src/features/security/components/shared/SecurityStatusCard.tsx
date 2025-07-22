
import { LucideIcon } from 'lucide-react';
import { SectionCard } from '@/components/layout/SectionCard';
import { StatusIndicator } from '@/components/ui/status-indicator';

interface SecurityStatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'success' | 'warning' | 'info' | 'error';
}

const SecurityStatusCard = ({ title, value, icon: Icon, variant }: SecurityStatusCardProps) => {
  return (
    <SectionCard className="hover-lift animate-fade-in" padding="md">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center">
            <p className="font-semibold text-lg">{value}</p>
            <StatusIndicator 
              status={variant === 'error' ? 'error' : variant} 
              size="sm" 
              className="ml-2" 
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default SecurityStatusCard;
