import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "@/lib/service-desk/auth";
import { ThemeProvider } from "@/components/service-desk/ThemeProvider";
import { AppShell } from "@/components/service-desk/AppShell";
import { ClientOnly } from "@/components/service-desk/ClientOnly";
import { roleHome } from "@/lib/service-desk/utils";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppRoot,
});

function AppRoot() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientOnly
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <AppGate />
        </ClientOnly>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/app/giris";

  const redirected = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!user && !isLogin) {
      if (pathname !== "/app/giris") navigate({ to: "/app/giris", replace: true });
      return;
    }
    if (user && isLogin && !redirected.current) {
      redirected.current = true;
      navigate({ to: roleHome(user.role), replace: true });
    }
  }, [user, loading, isLogin, pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLogin) return <Outlet />;
  if (!user) return null;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
