import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppLocale = "uz" | "ru" | "en";

type AppState = {
  theme: "light" | "dark";
  lang: AppLocale;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setLang: (lang: AppLocale) => void;
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      lang: "uz",
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: "barakali-landing",
      version: 2,
    },
  ),
);
