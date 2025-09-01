import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  role: 'manager' | 'worker';
  gender?: 'male' | 'female';
  keepShabbat?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (userId: string) => Promise<User | null>;
  logout: () => void;
  checkSession: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  login: async (userId: string) => {
    try {
      // For now, create a mock user based on ID
      const mockUser: User = {
        id: userId,
        name: userId === '0' ? 'Test Manager' : `User ${userId}`,
        role: userId === '0' ? 'manager' : 'worker',
      };
      
      set({ user: mockUser });
      localStorage.setItem('userId', userId);
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('userId');
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 5000)
      );
      
      const sessionCheck = async () => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          const user = await get().login(storedUserId);
          return user;
        }
        return null;
      };

      const user = await Promise.race([sessionCheck(), timeoutPromise]) as User | null;
      set({ isLoading: false });
      return user;
    } catch (error) {
      console.error('Session check error:', error);
      set({ isLoading: false });
      return null;
    }
  },
}));
