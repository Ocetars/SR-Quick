import { create } from "zustand";

export type AppState = {
  title: string;
  count: number;
  loading: boolean;
  setTitle: (title: string) => void;
  increment: (delta?: number) => void;
  decrement: (delta?: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  title: "SR Quick",
  count: 0,
  loading: false,
  setTitle: (title) => set({ title }),
  increment: (delta = 1) => set({ count: get().count + delta }),
  decrement: (delta = 1) => set({ count: get().count - delta }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ title: "SR Quick", count: 0, loading: false }),
}));
