import { PilotingDashboard } from "@/components/dashboard/PilotingDashboard";
import { DemoOverlay } from "@/components/demo/DemoOverlay";
import { useDemoMode } from "@/contexts/DemoModeContext";

const Dashboard = () => {
  const { isDemoMode } = useDemoMode();

  return (
    <>
      <PilotingDashboard />
      {isDemoMode && <DemoOverlay />}
    </>
  );
};

export default Dashboard;
