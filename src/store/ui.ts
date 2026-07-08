import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface UIState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
    }, 3000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export const toast = {
  success: (message: string) => useUIStore.getState().push({ type: "success", message }),
  error: (message: string) => useUIStore.getState().push({ type: "error", message }),
  info: (message: string) => useUIStore.getState().push({ type: "info", message }),
};
