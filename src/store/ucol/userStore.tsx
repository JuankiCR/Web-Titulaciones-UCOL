import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  _id: string;
  email: string;
  name: string;
  lastName: string;
  role: 'ADMIN' | 'STUDENT' | 'TEACHER';
  faculty: string[];
  careers: string[];
}

interface UserState {
  user: User | null | undefined;
  seeYouName: string;
  setUser: (userData: User) => void;
  setSeeYouName: (name: string) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: undefined,
      seeYouName: 'Usuario',
      setUser: (userData) => set({ user: userData }),
      setSeeYouName: (name) => set({ seeYouName: name }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
