import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { ClientOnly } from "@/components/service-desk/ClientOnly";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/takip/")({
  component: TrackIndex,
});

function TrackIndex() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl border-border/60">
          <CardHeader className="text-center">
            <img src={logo} alt="FİXATECH" className="h-12 mx-auto mb-4" />
            <CardTitle className="font-display text-2xl">Servis Takip</CardTitle>
            <CardDescription>Kayıt numaranız ile canlı servis durumunu görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Örn. FIX-2026-0001"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <Button
              className="w-full rounded-full"
              onClick={() => code && navigate({ to: "/takip/$code", params: { code } })}
            >
              Sorgula
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <Link to="/app/giris" className="text-primary hover:underline">
                Panele giriş
              </Link>
              {" · "}
              <Link to="/teknik-servis" className="text-primary hover:underline">
                Yeni talep
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </ClientOnly>
  );
}
