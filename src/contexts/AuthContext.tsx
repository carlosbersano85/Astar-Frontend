import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiLogin, apiRegister, apiMe, setToken, clearToken, type ApiUser } from "@/lib/api";

export type UserRole = "admin" | "client" | null;
export type SubscriptionStatus = "active" | "inactive" | "cancelled" | null;

interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  subscriptionStatus: SubscriptionStatus;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  profileLoaded: boolean;
  login: (email: string, password: string) => Promise<
    | { success: true; role: "admin" | "client" }
    | { success: false; errorCode?: string; errorMessage?: string }
  >;
  logout: () => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
    birthPlace: string;
    birthTime: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function mapApiUser(u: ApiUser): User {
  return {
    uid: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
    subscriptionStatus: u.subscriptionStatus,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiMe()
      .then((apiUser) => {
        if (!cancelled && apiUser) setUser(mapApiUser(apiUser));
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) {
          setProfileLoaded(true);
          setAuthLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<
    | { success: true; role: "admin" | "client" }
    | { success: false; errorCode?: string; errorMessage?: string }
  > => {
    try {
      const { user: apiUser, access_token } = await apiLogin(email, password);
      setToken(access_token);
      setUser(mapApiUser(apiUser));
      return { success: true, role: apiUser.role };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, errorCode: "auth/invalid-credential", errorMessage: message };
    }
  };

  const logout = async (): Promise<void> => {
    clearToken();
    setUser(null);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
    birthPlace: string;
    birthTime: string;
  }): Promise<{ ok: true } | { ok: false; error: string }> => {
    try {
      const { user: apiUser, access_token } = await apiRegister(data);
      setToken(access_token);
      setUser(mapApiUser(apiUser));
      return { ok: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo crear la cuenta.";
      return { ok: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        profileLoaded,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        hasActiveSubscription: user?.subscriptionStatus === "active",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
