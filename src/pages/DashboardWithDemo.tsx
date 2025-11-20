import { PremiumDashboard } from "@/components/dashboard/PremiumDashboard";
import { DemoOverlay } from "@/components/demo/DemoOverlay";
import { useDemoMode } from "@/contexts/DemoModeContext";

const Dashboard = () => {
  const { isDemoMode } = useDemoMode();

  return (
    <>
      <PremiumDashboard />
      {isDemoMode && <DemoOverlay />}
    </>
  );
};

export default Dashboard;
