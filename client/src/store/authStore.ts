import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } else {
      localStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
}));