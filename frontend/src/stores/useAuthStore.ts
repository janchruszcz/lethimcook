import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, signup, logout, getCurrentUser } from '../api/auth';

interface User {
  id: number;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const user = await login(email, password);
          
          // Set auth state
          set({ 
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error.response?.data?.error || 'Login failed'
          });
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const user = await signup(email, password);
          
          set({ 
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error.response?.data?.error || 'Registration failed'
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear auth state regardless of logout API success
          set({ 
            user: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user) => set({ 
        user,
        isAuthenticated: !!user
      }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }), // only persist these fields
    }
  )
);

// Optional: Create a hook for checking auth status
export const useAuthCheck = () => {
  const { isAuthenticated, setUser } = useAuthStore();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        setUser(null);
      }
    };

    if (isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, setUser]);

  return isAuthenticated;
};
