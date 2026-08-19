# המרכז להפצת אור — spreadthelight.co.il

אתר Next.js (App Router) עבור המרכז להפצת אור, מחובר ל-Vision OS כמערכת ניהול תוכן.

The site of the Spread the Light center (Lilach Hershkovitz), built with Next.js
App Router and driven by Vision OS as a headless CMS.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, React 19, TypeScript strict) |
| Package manager | pnpm |
| CMS | Vision OS (`https://morevision.co.il/api`) |
| Mail | Project SMTP via nodemailer, with a Vision OS fallback |
| Language / direction | Hebrew, RTL |

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the real values
pnpm dev
```

Build and run the production server:

```bash
pnpm build
pnpm start
```

Type checking only: `pnpm typecheck`.

## Environment

Server-side only — never expose these to the browser and never prefix with `NEXT_PUBLIC_`.

| Variable | Purpose |
|---|---|
| `VISION_OS_API_URL` | API base, `https://morevision.co.il/api` |
| `VISION_OS_API_KEY` | Project API key (`vos_…`) |
| `VISION_OS_PROJECT_ID` | Vision OS project id |
| `SMTP_HOST` | Mail host. **Empty disables direct sending** and the site uses the Vision OS mailer instead |
| `SMTP_PORT` | 587 for STARTTLS, 465 for implicit TLS |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials |
| `SMTP_FROM` | From header, e.g. `Name <smtp@example.com>` |
| `SMTP_SECURE` | `true`/`false`; omit and the port decides |
| `ADMIN_NOTIFY_EMAIL` | Where form submissions are emailed |
| `CONTACT_EMAIL` | Also notified; duplicates are collapsed |

No recipient address is hard-coded in this repository — if neither
`ADMIN_NOTIFY_EMAIL` nor `CONTACT_EMAIL` is set, sending is treated as a
misconfiguration and logged rather than routed to a default inbox.

Remote Vision OS builds do **not** read `.env.local` from git. Production values
live in Vision OS → project → deploy settings (`buildConfig.env`).

## Content model

All of these are editable in Vision OS and appear on the site within ~60 seconds
(ISR revalidation), with no code change or redeploy.

| Collection | Drives |
|---|---|
| `services` | Service cards on the homepage, `/services`, and each `/services/[slug]` |
| `courses` | The top announcement ticker, homepage list, `/courses`, `/courses/[slug]` |
| `reviews` | Homepage testimonials (`is_featured`) and `/testimonials` |
| `products` | `/products` |
| `leads` | Every form submission on the site |

Notes on fields:

- `sort_order` controls display order; `is_active` hides an item without deleting it.
- `show_in_ticker` picks which courses appear in the rotating bar. The rotation
  timing is derived from how many are flagged, so any count stays evenly spaced.
- `image` fields hold a media-library UUID, resolved server-side to a public URL.
- Rich text (`description`, `full_description`, review `body`) is HTML and is
  styled by the `.prose` rules in `app/additions.css`.

## Forms

`components/LeadForm.tsx` posts to `app/api/leads/route.ts`, which:

1. validates the input and rejects bots via a honeypot field,
2. rate-limits to 5 submissions per IP per 10 minutes,
3. creates and publishes a record in the `leads` collection,
4. emails a notification via `lib/mailer.ts`.

Mail takes the project SMTP first (`SMTP_*`). If that send fails — bad
credentials, host down, network blip — it automatically retries through the
Vision OS project mailer, so a notification is not lost to a single broken
channel. The JSON response reports which channel was used as `via`.

If every mail channel fails the lead is still stored and the visitor still sees
success — the submission is never silently lost. If the CMS write itself fails,
the visitor is told to phone instead rather than shown a false confirmation.

## Styling

- `app/globals.css` — the approved design, extracted verbatim from the original
  single-page mockup. Avoid editing; it is the visual source of truth.
- `app/additions.css` — everything the multi-page site needed on top: mobile
  navigation, interior page headers, card layouts, rich-text styles, form states.

The mockup hid navigation below 900px because it was one page with anchor links.
`components/MobileNav.tsx` adds a drawer at that breakpoint so the multi-page
site stays navigable on phones.

## Deployment

Pushing to `main` triggers a Vision OS build. To deploy manually:

```http
POST /projects/{projectId}/website-builds
{ "deploy": true }
```

`deploy: true` matters — a build without it compiles but does not go live.
