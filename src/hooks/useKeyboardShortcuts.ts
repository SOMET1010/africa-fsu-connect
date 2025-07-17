import { useEffect, useCallback } from "react";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
  enabled?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === "true"
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      if (shortcut.enabled === false) continue;

      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrl === (event.ctrlKey || event.metaKey);
      const shiftMatch = !!shortcut.shift === event.shiftKey;
      const altMatch = !!shortcut.alt === event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts: shortcuts.filter(s => s.enabled !== false) };
}

export function useGlobalShortcuts() {
  const shortcuts: ShortcutConfig[] = [
    {
      key: "/",
      action: () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      },
      description: "Focus search"
    },
    {
      key: "Escape",
      action: () => {
        // Close any open modals, dropdowns, etc.
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      },
      description: "Close modals/dropdowns"
    },
    {
      key: "n",
      ctrl: true,
      action: () => {
        // This can be customized per page
        console.log("New item shortcut");
      },
      description: "Create new item"
    }
  ];

  return useKeyboardShortcuts(shortcuts);
}