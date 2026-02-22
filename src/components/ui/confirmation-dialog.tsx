import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { logger } from '@/utils/logger';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  loading = false
}: ConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const getVariantConfig = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: XCircle,
          iconColor: "text-destructive",
          title: title || "Delete item?",
          description: description || "This action cannot be undone.",
          confirmVariant: "destructive" as const
        };
      case "warning":
        return {
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
          title: title || "Warning",
          description: description || "Are you sure you want to continue?",
          confirmVariant: "secondary" as const
        };
      case "info":
        return {
          icon: Info,
          iconColor: "text-info",
          title: title || "Information",
          description: description || "Please confirm your action.",
          confirmVariant: "default" as const
        };
      default:
        return {
          icon: CheckCircle,
          iconColor: "text-primary",
          title: title || "Confirm action",
          description: description || "Are you sure you want to continue?",
          confirmVariant: "default" as const
        };
    }
  };

  const config = getVariantConfig();
  const Icon = config.icon;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      logger.error("Confirmation action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="animate-scale-in">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
            <AlertDialogTitle>{config.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isProcessing || loading}
            className="transition-all duration-200"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isProcessing || loading}
            className={`transition-all duration-200 ${
              config.confirmVariant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""
            }`}
          >
            {isProcessing || loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}