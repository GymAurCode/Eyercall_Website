# Eyercall Website

Marketing site for Eyercall — a software development company and IT training institute. It
introduces the company, its four products (EyerREMS, EyerFlow, EyerStock and EyerType), six IT
courses and five service areas, with a contact form wired to server-side delivery.

Built with TanStack Start, React, TypeScript, Tailwind CSS, and Vite.

## Pages

| Route             | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `/`               | Company homepage: positioning, divisions, services, contact    |
| `/about`          | Company profile: story, mission, vision, values                |
| `/software`       | Product catalogue with links to each product                   |
| `/software/$slug` | Product detail pages (eyerrems, eyerflow, eyerstock, eyertype) |
| `/courses`        | Course catalogue                                               |
| `/courses/$slug`  | Course detail pages (six courses)                              |
| `/services`       | The five service offerings, with anchor links                  |
| `/contact`        | Contact details and validated enquiry form                     |
| `/privacy`        | Privacy policy                                                 |

Legacy `/products` and `/products/:slug` URLs redirect to their `/software` equivalents.

## Development

You need Node.js 20+ and npm.

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:8080.

## Scripts

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start the development server           |
| `npm run build`     | Create a production build in `.output` |
| `npm run preview`   | Build and serve a local Node preview   |
| `npm run lint`      | Run ESLint and Prettier checks         |
| `npm run typecheck` | Run the TypeScript compiler            |
| `npm test`          | Run the Vitest suite                   |
| `npm run format`    | Format the project with Prettier       |

## Configuration

All public details are environment-driven and embedded at build time, so rebuild after changing
them. Missing values are hidden rather than replaced with placeholders.

### Contact details

```env
VITE_CONTACT_EMAIL=
VITE_CONTACT_PHONE=
VITE_CONTACT_WHATSAPP=
VITE_CONTACT_ADDRESS=
```

The footer, contact page and homepage render only the channels that are set.

### Social profiles

```env
VITE_SOCIAL_FACEBOOK=
VITE_SOCIAL_INSTAGRAM=
VITE_SOCIAL_LINKEDIN=
VITE_SOCIAL_YOUTUBE=
```

Each value must be a complete `https://` URL to a real Eyercall account. Unset or invalid values are
ignored, so no social link is rendered for a profile that is not configured.

## Contact form delivery

The contact form validates submissions on the server. To actually receive messages, configure one
of the delivery options below (for example in `.env` locally or in your hosting provider's
environment variables):

### Option 1: webhook

```env
CONTACT_WEBHOOK_URL=https://example.com/contact
CONTACT_WEBHOOK_TOKEN=optional-bearer-token
```

The form POSTs a JSON body with `name`, `email`, `phone`, `inquiryType`, `message`, `submittedAt`,
and `source`.

### Option 2: Resend

```env
RESEND_API_KEY=re_...
CONTACT_EMAIL_TO=hello@example.com
CONTACT_EMAIL_FROM=Eyercall Website <website@example.com>
```

`CONTACT_EMAIL_FROM` must be an address on a domain verified in Resend. Multiple recipients can be
comma-separated in `CONTACT_EMAIL_TO`.

Until one of these is configured, the form reports honestly that online submissions are not
connected and does not claim the message was sent.

See `.env.example` for all supported variables.

## Deployment

`npm run build` produces a Cloudflare Worker build in `.output` (via Nitro). Deploy it with your
Cloudflare/Nitro workflow. The contact form environment variables above must be set in the
deployment environment.
