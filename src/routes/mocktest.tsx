import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { PaymentQR } from "@/components/PaymentQR";
import { Card, CardContent } from "@/components/ui/card";
import { ScanLine, Youtube } from "lucide-react";
import channelQr from "@/assets/channel-qr.png";

export const Route = createFileRoute("/mocktest")({
  head: () => ({
    meta: [
      { title: "Mock Test — D Square English Hub" },
      { name: "description", content: "Join the D Square mock test channel to practise IELTS and English communication." },
    ],
  }),
  component: MockTestPage,
});

function MockTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-hero mb-4">
            <ScanLine className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Mock Test Channel</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Scan the QR below to join our private mock test channel. New tests, answer keys and feedback are posted weekly.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-8 md:p-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <PaymentQR
                imageSrc={channelQr}
                caption="Join our mock test channel"
                size={220}
              />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">What's inside?</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  "Weekly IELTS reading & listening sets",
                  "Speaking practice prompts with rubrics",
                  "Writing tasks reviewed by mentors",
                  "Group corrections every Sunday",
                ].map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gold">◆</span>
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Youtube className="h-4 w-4" />
                Channel link will be updated by admin soon.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
