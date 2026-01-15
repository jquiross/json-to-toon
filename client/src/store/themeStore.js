import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    set => ({
      theme: 'retro-green',
      soundEnabled: true,
      glitchEffect: false,
      crtEffect: true,

      setTheme: theme => set({ theme }),
      toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),
      toggleGlitch: () => set(state => ({ glitchEffect: !state.glitchEffect })),
      toggleCRT: () => set(state => ({ crtEffect: !state.crtEffect })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
