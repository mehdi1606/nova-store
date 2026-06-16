"use client";

import { create } from "zustand";

type FitState = {
  fit?: string;
  setFit: (fit?: string) => void;
};

/**
 * The currently selected product fit (Femme / Homme), shared between the buy
 * box and the gallery so the photos swap when the customer toggles the fit.
 */
export const useFit = create<FitState>((set) => ({
  fit: undefined,
  setFit: (fit) => set({ fit }),
}));
