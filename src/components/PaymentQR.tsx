import { QRCodeSVG } from "qrcode.react";

export function PaymentQR({
  value = "upi://pay?pa=replace-me@upi&pn=D%20Square%20English%20Hub&am=0&cu=INR",
  size = 200,
  caption = "Scan with any UPI app",
}: {
  value?: string;
  size?: number;
  caption?: string;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="rounded-lg bg-white p-3">
        <QRCodeSVG value={value} size={size} level="M" />
      </div>
      <p className="text-xs text-muted-foreground max-w-[220px] text-center">{caption}</p>
      <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">
        Sample QR — replace later
      </p>
    </div>
  );
}
