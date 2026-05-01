import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { ScanLine, Loader2 } from "lucide-react";
import { PaymentQR } from "@/components/PaymentQR";

export const Route = createFileRoute("/mocktest")({
  head: () => ({
    meta: [
      { title: "Channel — D Square English Hub" },
      { name: "description", content: "Join the D Square English Hub channel by scanning the QR code." },
    ],
  }),
  component: ChannelPage,
});

function ChannelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.navigate({ to: "/login" });
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-hero mb-4 shadow-glow">
            <ScanLine className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Channel</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Scan the QR code below to join our channel.
          </p>
        </div>

        <div className="flex justify-center">
          <PaymentQR
            value="https://d-square-english-hub.lovable.app"
            size={240}
            caption="Scan to join the D Square English Hub channel"
            badge="Channel"
          />
        </div>
      </main>
    </div>
  );
}
