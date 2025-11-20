import Organizations from "./Organizations";
import { DemoOverlay } from "@/components/demo/DemoOverlay";
import { useDemoMode } from "@/contexts/DemoModeContext";

const OrganizationsWithDemo = () => {
  const { isDemoMode } = useDemoMode();

  return (
    <>
      <Organizations />
      {isDemoMode && <DemoOverlay />}
    </>
  );
};

export default OrganizationsWithDemo;
