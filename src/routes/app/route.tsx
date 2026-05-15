import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/service-desk/auth";
import { ThemeProvider } from "@/components/service-desk/ThemeProvider";
import { AppShell } from "@/components/service-desk/AppShell";
import { ClientOnly } from "@/components/service-desk/ClientOnly";
import { roleHome } from "@/lib/service-desk/utils";
import { Loader2 } from "lucide-react";
import { buildNoIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/app")({
  head: () => buildNoIndexHead("Kontrol Paneli"),
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

  useEffect(() => {
    if (loading) return;

    if (!user && !isLogin) {
      navigate({ to: "/app/giris", replace: true });
      return;
    }

    if (user && isLogin) {
      navigate({ to: roleHome(user.role), replace: true });
    }
  }, [user, loading, isLogin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLogin) return <Outlet />;
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground">Oturum açık ama profil yüklenemedi.</p>
        <button
          type="button"
          className="text-primary underline text-sm"
          onClick={() => navigate({ to: "/app/giris", replace: true })}
        >
          Tekrar giriş yap
        </button>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
