
import { CheckCircle, XCircle, LogOut, Eye, LucideIcon } from 'lucide-react';

interface ActionIconProps {
  actionType: string;
  success?: boolean;
}

const ActionIcon = ({ actionType, success }: ActionIconProps) => {
  const getActionIcon = (): LucideIcon => {
    switch (actionType) {
      case 'login':
      case 'signin':
        return success !== false ? CheckCircle : XCircle;
      case 'logout':
      case 'signout':
        return LogOut;
      case 'login_failed':
        return XCircle;
      default:
        return Eye;
    }
  };

  const getActionColor = (): string => {
    switch (actionType) {
      case 'login':
      case 'signin':
        return success !== false ? 'text-green-500' : 'text-red-500';
      case 'logout':
      case 'signout':
        return 'text-blue-500';
      case 'login_failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const Icon = getActionIcon();
  
  return <Icon className={`h-4 w-4 ${getActionColor()}`} />;
};

export default ActionIcon;
