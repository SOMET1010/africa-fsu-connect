
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface BaseFieldProps {
  label: string;
  description?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface ModernInputProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface ModernTextareaProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
}

interface ModernSelectProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
}

interface ModernSwitchProps extends BaseFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(({
  label,
  description,
  error,
  success,
  required,
  disabled,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  rightIcon,
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <Input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={cn(
            "transition-all duration-300 bg-background/50 backdrop-blur-sm",
            "border-border/50 hover:border-border focus:border-primary",
            "focus:ring-2 focus:ring-primary/20",
            icon && "pl-10",
            (rightIcon || type === "password") && "pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            success && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
            focused && "shadow-lg shadow-primary/10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          {...props}
        />
        
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {rightIcon && type !== "password" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle className="h-4 w-4" />
          </div>
        )}
        
        {success && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
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
});

export const ModernTextarea = forwardRef<HTMLTextAreaElement, ModernTextareaProps>(({
  label,
  description,
  error,
  success,
  required,
  disabled,
  placeholder,
  value,
  onChange,
  rows = 4,
  className,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        rows={rows}
        className={cn(
          "transition-all duration-300 bg-background/50 backdrop-blur-sm",
          "border-border/50 hover:border-border focus:border-primary",
          "focus:ring-2 focus:ring-primary/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          success && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
          focused && "shadow-lg shadow-primary/10",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        {...props}
      />
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
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
});

export const ModernSelect = ({
  label,
  description,
  error,
  success,
  required,
  disabled,
  placeholder,
  value,
  onChange,
  options,
  className
}: ModernSelectProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn(
          "transition-all duration-300 bg-background/50 backdrop-blur-sm",
          "border-border/50 hover:border-border focus:border-primary",
          "focus:ring-2 focus:ring-primary/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          success && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
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

ModernInput.displayName = "ModernInput";
ModernTextarea.displayName = "ModernTextarea";
