import { QRCodeSVG } from "qrcode.react";

export function PaymentQR({
  value = "upi://pay?pa=replace-me@upi&pn=D%20Square%20English%20Hub&am=0&cu=INR",
  size = 200,
  caption = "Scan with any UPI app",
  imageSrc,
  badge,
}: {
  value?: string;
  size?: number;
  caption?: string;
  imageSrc?: string;
  badge?: string;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="rounded-lg bg-white p-3">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={caption}
            width={size}
            height={size}
            style={{ width: size, height: size }}
            className="object-contain"
          />
        ) : (
          <QRCodeSVG value={value} size={size} level="M" />
        )}
      </div>
      <p className="text-xs text-muted-foreground max-w-[220px] text-center">{caption}</p>
      {badge && (
        <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">
          {badge}
        </p>
      )}
    </div>
  );
}
