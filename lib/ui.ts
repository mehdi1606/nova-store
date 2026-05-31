"use client";

import { create } from "zustand";

type UIState = {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  darkHero: boolean;
  setDarkHero: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  darkHero: false,
  setDarkHero: (darkHero) => set({ darkHero }),
}));
