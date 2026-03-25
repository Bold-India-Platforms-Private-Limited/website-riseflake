import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number | string;
  full_name: string;
  first_name: string;
  email: string;
  mobile_no?: string | null;
  avatar_url: string;
  role?: number;
  is_active?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      setUser: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);
