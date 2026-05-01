## Plan

### 1. IELTS Drive link on dashboard
In `src/routes/dashboard.tsx`, add a card mirroring the Spoken English one for `safeProfile.course === "IELTS"` linking to:
`https://drive.google.com/drive/folders/1etGYMJKp1Lr5-wBeXx_fJgi_Bo4wn8DH?usp=drive_link`

Place it directly above the existing "IELTS Mock Tests" card so approved IELTS students see both: a "IELTS — Course Materials" card (Drive folder) and the Mock Tests card.

### 2. Rename "Mock Test" → "Channel" with QR
- **Header (`src/components/AppHeader.tsx`)**: change the "Mock Test" nav button label to "Channel". Keep the `/mocktest` route for now (no route rename — just label change) to avoid breaking deep links and the existing dashboard CTA.
- **Mock test page (`src/routes/mocktest.tsx`)**:
  - Change page title/heading from "IELTS Mock Tests" to "Channel".
  - Update head meta title/description accordingly.
  - Add a prominent QR code section at the top using the existing `PaymentQR` component (with `imageSrc` prop for a channel QR image). 
  - Keep the existing mock-test list below for approved IELTS students (functionality unchanged).
- **Dashboard CTA**: update the "Take a test" button label inside the IELTS card to say "Open Channel" (still links to `/mocktest`).

**Asset needed**: a channel QR image. I'll add a placeholder file path `src/assets/channel-qr.png` — you'll need to drop the actual QR PNG there (same way `upi-qr.png` works). If you'd prefer, I can instead render a `QRCodeSVG` from a URL string you provide (e.g. WhatsApp/YouTube/Telegram channel link). I'll ask before implementing.

### 3. Hero contact info (location + phone numbers)
In `src/routes/index.tsx` hero block, directly under the "Speak fluently. / Score globally." headline (above the existing description paragraph), add a compact row of contact chips:
- **Location pin** → opens `https://maps.app.goo.gl/3bt7YHVy6F8CbFYTA` in new tab (MapPin icon).
- **Phone chip 1**: `+91 87542 45615` — click-to-copy with toast confirmation, plus `tel:` fallback on long-press/secondary action.
- **Phone chip 2**: `+91 90805 28278` — same behavior.

Use existing `useToast` (sonner) for "Copied!" feedback. Styling matches the existing glass/neon chip pattern already in the hero.

### Files to edit
- `src/routes/dashboard.tsx` — add IELTS Drive card; update Mock Test button label
- `src/components/AppHeader.tsx` — rename nav label to "Channel"
- `src/routes/mocktest.tsx` — rename heading + add QR section
- `src/routes/index.tsx` — add contact chips row in hero

### Question before building
For the Channel QR, do you want to:
1. Upload an image file (I'll wire `src/assets/channel-qr.png`), or
2. Provide a URL/link and I'll generate the QR dynamically with `QRCodeSVG`?

Let me know which, and I'll implement on approval.