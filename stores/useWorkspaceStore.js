'use client';
import { create } from 'zustand';
export const useWorkspaceStore = create((set) => ({
    sidebarOpen: true,
    commandOpen: false,
    activeProjectId: 'p-1',
    mobileNavOpen: false,
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    setCommandOpen: (commandOpen) => set({ commandOpen }),
    setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
    setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
}));
