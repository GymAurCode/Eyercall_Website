import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  sidebarOpen: boolean;
  mobileDrawerOpen: boolean;
  theme: "dark" | "light";
  toggleSidebar: () => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleTheme: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      mobileDrawerOpen: false,
      theme: "dark",
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      openMobileDrawer: () => set({ mobileDrawerOpen: true }),
      closeMobileDrawer: () => set({ mobileDrawerOpen: false }),
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        document.documentElement.classList.toggle("light", next === "light");
        set({ theme: next });
      },
    }),
    {
      name: "rems-ui",
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen, theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle("dark", state.theme === "dark");
          document.documentElement.classList.toggle("light", state.theme === "light");
        }
      },
    }
  )
);
