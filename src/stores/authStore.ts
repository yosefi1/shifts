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
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        const user = await get().login(storedUserId);
        set({ isLoading: false });
        return user;
      }
      set({ isLoading: false });
      return null;
    } catch (error) {
      console.error('Session check error:', error);
      set({ isLoading: false });
      return null;
    }
  },
}));
