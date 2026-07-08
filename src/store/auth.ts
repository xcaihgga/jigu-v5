import { create } from "zustand";
import type { User } from "@/lib/types";
import { auth as authService, ensureSeed } from "@/services";

interface AuthState {
  user: User | null;
  ready: boolean;
  init: () => void;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { email: string; password: string; name: string; role: "therapist" | "patient"; license?: string }) => Promise<User>;
  logout: () => void;
  enterVisitor: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  init: () => {
    ensureSeed();
    set({ user: authService.current(), ready: true });
  },
  login: async (email, password) => {
    const user = await authService.login(email, password);
    set({ user });
    return user;
  },
  register: async (input) => {
    const user = await authService.register(input);
    set({ user });
    return user;
  },
  logout: () => {
    authService.logout();
    set({ user: null });
  },
  enterVisitor: () => {
    set({
      user: {
        id: "visitor",
        email: "",
        password: "",
        role: "visitor",
        name: "访客",
        createdAt: Date.now(),
      },
    });
  },
}));
