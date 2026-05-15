import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Wrench,
  PlusCircle,
  LogOut,
  Moon,
  Sun,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/lib/service-desk/auth";
import { useTheme } from "@/components/service-desk/ThemeProvider";
import { roleHome } from "@/lib/service-desk/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/service-desk/types";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV: Record<UserRole, NavItem[]> = {
  admin: [
    { to: "/app/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/admin/kayitlar", label: "Servis Kayıtları", icon: ClipboardList },
    { to: "/app/admin/musteriler", label: "Müşteriler", icon: Users },
    { to: "/app/admin/ekip", label: "Teknik Ekip", icon: Wrench },
  ],
  customer: [
    { to: "/app/musteri", label: "Panelim", icon: LayoutDashboard },
    { to: "/app/musteri/yeni", label: "Yeni Talep", icon: PlusCircle },
    { to: "/app/musteri/kayitlar", label: "Servislerim", icon: ClipboardList },
  ],
  technician: [
    { to: "/app/teknik", label: "Görevlerim", icon: LayoutDashboard },
    { to: "/app/teknik/gorevler", label: "Tüm Görevler", icon: ClipboardList },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!user) return null;

  const items = NAV[user.role];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn("flex gap-1", mobile ? "flex-col" : "flex-col px-3")}>
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl">
        <div className="p-5 border-b border-border/60">
          <Link to={roleHome(user.role)} className="flex items-center gap-2">
            <img src={logo} alt="FİXATECH" className="h-10 w-auto" />
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 font-semibold">
            Servis Kontrol Paneli
          </p>
        </div>
        <div className="flex-1 py-4">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-border/60 space-y-2">
          <div className="rounded-xl bg-muted/50 p-3 text-xs">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-muted-foreground capitalize">{user.role}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {theme === "dark" ? "Açık tema" : "Koyu tema"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive"
            onClick={() => {
              logout();
              navigate({ to: "/app/giris" });
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Çıkış
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="p-5 border-b">
                <img src={logo} alt="FİXATECH" className="h-9" />
              </div>
              <div className="py-4">
                <NavLinks mobile />
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Kayıt no veya firma ara..." className="pl-9 bg-muted/40 border-0" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="hidden md:block text-right text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}


