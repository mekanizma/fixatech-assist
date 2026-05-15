import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { ensureProfileForAuthUser } from "./api";
import type { User, UserRole } from "./types";

export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  isRole: (...roles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid_credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (m.includes("email not confirmed")) {
    return "E-posta henüz onaylanmamış. Supabase → Authentication → Email → Confirm email kapalı olsun.";
  }
  if (m.includes("email logins are disabled")) {
    return "E-posta ile giriş kapalı. Supabase → Authentication → Providers → Email açın.";
  }
  if (m.includes("invalid api key") || m.includes("api key")) {
    return "Supabase API anahtarı geçersiz (.env anon JWT).";
  }
  return message;
}

async function loadUserFromSession(session: Session | null): Promise<User | null> {
  if (!session?.user) return null;
  return ensureProfileForAuthUser({
    id: session.user.id,
    email: session.user.email,
    user_metadata: session.user.user_metadata as Record<string, unknown>,
  });
}

/** Yenilemede gereksiz SIGNED_OUT / çift tetiklemeyi yoksay. */
function shouldHandleAuthEvent(event: AuthChangeEvent): boolean {
  return event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const sb = getSupabase();
    let mounted = true;

    const bootstrap = async (session: Session | null) => {
      if (!session?.user) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      const profile = await loadUserFromSession(session);
      if (mounted) {
        setUser(profile);
        setLoading(false);
      }
    };

    void sb.auth.getSession().then(({ data }) => {
      void bootstrap(data.session);
    });

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((event, session) => {
      if (!mounted || !shouldHandleAuthEvent(event)) return;

      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      void bootstrap(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    if (!isSupabaseConfigured()) {
      return { ok: false, message: ".env dosyasında VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlayın." };
    }
    setLoading(true);
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      return { ok: false, message: mapAuthError(error.message) };
    }
    if (!data.user) {
      setLoading(false);
      return { ok: false, message: "Giriş yanıtı alınamadı." };
    }

    const profile = await ensureProfileForAuthUser({
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata as Record<string, unknown>,
    });

    if (!profile) {
      setLoading(false);
      return {
        ok: false,
        message:
          "Profil yüklenemedi. seed_demo_users.sql çalıştırın veya 003_ensure_profile.sql uygulayın.",
      };
    }

    setUser(profile);
    setLoading(false);
    return { ok: true, user: profile };
  }, []);

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    await getSupabase().auth.signOut();
    setUser(null);
    setLoading(false);
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
