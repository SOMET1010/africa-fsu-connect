import { useEffect } from "react";

interface UsePresentationKeyboardProps {
  onNext: () => void;
  onPrevious: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  currentSection: number;
  totalSections: number;
}

export const usePresentationKeyboard = ({
  onNext,
  onPrevious,
  onToggleFullscreen,
  currentSection,
  totalSections
}: UsePresentationKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case "Space":
          if (currentSection < totalSections - 1) {
            e.preventDefault();
            onNext();
          }
          break;

        case "ArrowLeft":
        case "PageUp":
          if (currentSection > 0) {
            e.preventDefault();
            onPrevious();
          }
          break;

        case "f":
        case "F":
          e.preventDefault();
          onToggleFullscreen();
          break;

        case "Escape":
          if (document.fullscreenElement) {
            e.preventDefault();
            document.exitFullscreen();
          }
          break;

        case "Home":
          e.preventDefault();
          // Go to first section - handled in parent component
          break;

        case "End":
          e.preventDefault();
          // Go to last section - handled in parent component
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious, onToggleFullscreen, currentSection, totalSections]);
};
