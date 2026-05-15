import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FİXATECH — Endüstriyel Teknik Servis | Otel & Restoran Bakım Onarım" },
      { name: "description", content: "Otel, restoran ve işletmeler için 7/24 endüstriyel teknik servis. Mutfak ekipmanları, elektrik, su tesisatı ve tadilat hizmetlerinde güvenilir çözüm ortağınız." },
      { name: "keywords", content: "endüstriyel mutfak tamiri, otel teknik servis, restoran bakım onarım, elektrik tesisat ustası, su tesisatı tamir, acil teknik servis" },
      { name: "author", content: "FİXATECH" },
      { property: "og:title", content: "FİXATECH — Endüstriyel Teknik Servis | Otel & Restoran Bakım Onarım" },
      { property: "og:description", content: "Otel, restoran ve işletmeler için 7/24 endüstriyel teknik servis. Mutfak ekipmanları, elektrik, su tesisatı ve tadilat hizmetlerinde güvenilir çözüm ortağınız." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "FİXATECH — Endüstriyel Teknik Servis | Otel & Restoran Bakım Onarım" },
      { name: "twitter:description", content: "Otel, restoran ve işletmeler için 7/24 endüstriyel teknik servis. Mutfak ekipmanları, elektrik, su tesisatı ve tadilat hizmetlerinde güvenilir çözüm ortağınız." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/88f3bdf4-db66-4eb7-bde3-122840072f36/id-preview-78933056--1e8218dc-4c87-4ecd-9914-4c3d3b2aa4e6.lovable.app-1778829939425.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/88f3bdf4-db66-4eb7-bde3-122840072f36/id-preview-78933056--1e8218dc-4c87-4ecd-9914-4c3d3b2aa4e6.lovable.app-1778829939425.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollReveal />
      <Header />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <Toaster />
    </QueryClientProvider>
  );
}
