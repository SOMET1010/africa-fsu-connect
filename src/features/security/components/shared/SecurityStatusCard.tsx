
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SecurityStatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'success' | 'warning' | 'info' | 'danger';
}

const variantStyles = {
  success: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  warning: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  danger: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
};

const SecurityStatusCard = ({ title, value, icon: Icon, variant }: SecurityStatusCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="font-semibold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityStatusCard;
