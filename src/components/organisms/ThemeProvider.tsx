import { useEffect } from "react";
import { useUiStore } from "@/stores/uiStore";
import { applyTheme } from "@/lib/theme";

/** Syncs Zustand theme with the document `dark` class (incl. system preference on first load). */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("support-ui-theme")) {
        useUiStore.getState().setTheme(mq.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return <>{children}</>;
}
