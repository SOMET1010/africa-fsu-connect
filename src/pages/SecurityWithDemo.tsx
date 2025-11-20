import Security from "./Security";
import { DemoOverlay } from "@/components/demo/DemoOverlay";
import { useDemoMode } from "@/contexts/DemoModeContext";

const SecurityWithDemo = () => {
  const { isDemoMode } = useDemoMode();

  return (
    <>
      <Security />
      {isDemoMode && <DemoOverlay />}
    </>
  );
};

export default SecurityWithDemo;
