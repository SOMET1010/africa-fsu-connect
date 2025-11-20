import Projects from "./Projects";
import { DemoOverlay } from "@/components/demo/DemoOverlay";
import { useDemoMode } from "@/contexts/DemoModeContext";

const ProjectsWithDemo = () => {
  const { isDemoMode } = useDemoMode();

  return (
    <>
      <Projects />
      {isDemoMode && <DemoOverlay />}
    </>
  );
};

export default ProjectsWithDemo;
