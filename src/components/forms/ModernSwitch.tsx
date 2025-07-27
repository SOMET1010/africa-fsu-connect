import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { BaseFieldProps } from './types';

interface ModernSwitchProps extends BaseFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const ModernSwitch = ({
  label,
  description,
  error,
  success,
  required,
  disabled,
  checked,
  onChange,
  className
}: ModernSwitchProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        
        <Switch
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {success && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {success}
        </p>
      )}
    </div>
  );
};