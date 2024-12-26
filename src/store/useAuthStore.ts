import { create } from "zustand";

export enum Role {
  User = "User",
  Editor = "Editor",
  CallCenter = "CallCenter",
  Admin = "Admin"
}

interface User {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  clearAuth: () => set({ ...initialState, isLoading: false }),
  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } });
    }
  },
}));

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useAuthActions = () => {
  const { setUser, setAuthenticated, clearAuth, setError } = useAuthStore();

  const login = (userData: User) => {
    setUser(userData);
    setAuthenticated(true);
  };

  const logout = () => {
    clearAuth();
  };

  const handleAuthError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    setError(errorMessage);
    clearAuth();
  };

  return { login, logout, handleAuthError, setUser, setAuthenticated };
};