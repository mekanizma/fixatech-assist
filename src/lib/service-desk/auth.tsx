import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { SESSION_KEY } from "./constants";
import { findUserByEmail, getUser } from "./store";
import type { Session, User, UserRole } from "./types";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isRole: (...roles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (s.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

function writeSession(userId: string, role: UserRole) {
  const session: Session = {
    userId,
    role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = readSession();
    if (s) setUser(getUser(s.userId) ?? null);
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const found = findUserByEmail(email);
    if (!found || found.password !== password) return false;
    writeSession(found.id, found.role);
    setUser(found);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const isRole = useCallback(
    (...roles: UserRole[]) => (user ? roles.includes(user.role) : false),
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
