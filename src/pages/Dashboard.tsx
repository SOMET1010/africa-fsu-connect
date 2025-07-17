import { AdaptiveDashboard } from "@/components/dashboard/AdaptiveDashboard";
import { AnimatedPage } from "@/components/ui/animated-page";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useGlobalShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Plus, FileText, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  const fabActions = [
    {
      icon: FileText,
      label: "New Document",
      onClick: () => navigate("/submit")
    },
    {
      icon: Calendar,
      label: "Create Event", 
      onClick: () => navigate("/events")
    },
    {
      icon: Users,
      label: "Forum Post",
      onClick: () => navigate("/forum")
    }
  ];

  return (
    <AnimatedPage variant="fade" className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdaptiveDashboard />
      
      <FloatingActionButton
        actions={fabActions}
        primaryLabel="Quick Actions"
        position="bottom-right"
      />
    </AnimatedPage>
  );
}