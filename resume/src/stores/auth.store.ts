import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiError, AuthUser, ResumeAccess, getSession, logoutSession } from '@/lib/authApi';

interface AuthState {
  user: AuthUser | null;
  access: ResumeAccess | null;
  isAuthenticated: boolean;
  // True once the backend has answered in this tab. The persisted copy only keeps
  // the header from flashing "Login" on reload; access decisions wait for this.
  ready: boolean;
  refresh: () => Promise<ResumeAccess | null>;
  logout: () => Promise<void>;
}

const signedOut = { user: null, access: null, isAuthenticated: false };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...signedOut,
      ready: false,

      refresh: async () => {
        try {
          const { user, access } = await getSession();
          set({ user, access, isAuthenticated: Boolean(user), ready: true });
          return access;
        } catch (error) {
          // An expired session is signed out. A network problem isn't, so the
          // saved state stands until the backend can answer.
          if (error instanceof ApiError && error.status === 401) set({ ...signedOut, ready: true });
          else set({ ready: true });
          return null;
        }
      },

      logout: async () => {
        await logoutSession().catch(() => undefined);
        set({ ...signedOut, ready: true });
      },
    }),
    {
      name: 'riseflake-resume-session',
      partialize: ({ user, access, isAuthenticated }) => ({ user, access, isAuthenticated }),
    }
  )
);
