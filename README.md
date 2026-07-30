# Leaflet

An artistic, single-piece digital publication builder for writers. Pure
typography, Cargo-style. **One piece of writing → one dedicated URL.**

Built with Stripe Projects (Auth0 + Neon + Vercel) on Next.js.

- **Live:** https://leaflet-six-sooty.vercel.app
- **Repo:** https://github.com/hexiao0225/leaflet

---

## The demo, in 60 seconds

1. Land on `/` → **Sign in to write** (Auth0).
2. `/write` — paste a poem, pick **Verse**, watch the live preview redraw.
3. **Publish** → congrats screen with the live URL.
4. Open `/p/<slug>` — the piece, full screen, nothing else on the page.

## What it is

One Next.js app on Vercel. Every published piece gets its own public URL via
the dynamic route `/p/[slug]`. Each piece is still its own "site" — own URL,
own template, nothing else on the page.

**In the MVP:** Auth0 login, Neon Postgres, an editor with a live preview,
three typographic templates, publish → live URL.

**Deliberately cut (the "next steps" slide):** a separate Vercel deploy per
piece, image file upload (URL field only), colour/font customisation,
AI-generated templates.

---

## The three templates

The differentiator. This is a typography project — the templates are the demo.
Each is a distinct point in one coherent indie-press / art-book space: pure
colour and type, one idea per page, a serif-display voice contrasted with a
monospace-metadata voice.

| Template | Look | Best for |
|---|---|---|
| **broadsheet** | Cream page, Instrument Serif set edge-to-edge (~34px / 1.35), huge title, mono colophon row pinned bottom reading `TYPE · TEMPLATE · DATE`. Accent oxblood `#b3311f`. | fiction, review |
| **reader** | Near-black `#0a0a0a`, a bordered sheet floating on the void, one 46ch column of Inter at ~19px in warm off-white, italic serif title, continuous setting with indented first lines, two tiny Space Mono footnotes flush-right. Accent muted gold `#b99a5b`. | review, essay |
| **verse** | Poster energy on near-white. Oversized Instrument Serif title, roman first half + italic second half. Body centred with `white-space: pre-wrap` so line breaks survive exactly. Accent electric blue `#1c39ff`. | poetry |

References: madonnapopstar12 and sam-evers (broadsheet), andrewculp (reader),
sachakalfon and becoming.press (verse).

The editor, with the live preview showing each template in turn:

| verse | broadsheet | reader |
|---|---|---|
| ![verse](docs/template-verse.png) | ![broadsheet](docs/template-broadsheet.png) | ![reader](docs/template-reader.png) |

**Type stack**, all via `next/font/google`: Instrument Serif (display),
Inter (grotesk), Space Mono (metadata).

### One detail worth pointing at

The templates size themselves in **container-query units (`cqw`)**, not
viewport units. The same CSS therefore drives both the full-screen published
page and the editor's live-preview panel, and the preview is a true
proportional miniature rather than a squashed approximation. No duplicated
stylesheet, no transform hacks.

---

## Data model

One table. Create it by pasting [`schema.sql`](./schema.sql) into the Neon web
console SQL editor — no migration framework.

```sql
create table pieces (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,          -- Auth0 sub
  title text not null,
  type text not null,             -- 'poem' | 'fiction' | 'review'
  template text not null,         -- 'broadsheet' | 'reader' | 'verse'
  body text not null,
  image_url text,                 -- optional, one image max
  slug text unique not null,
  created_at timestamptz default now()
);
```

> The original runbook sketched the templates as
> `'manuscript' | 'brutalist' | 'verse'` in the SQL while describing them as
> broadsheet / reader / verse in the design section. The design names won —
> they are what the code and the CHECK constraint use.

## Routes

| Route | Auth | What |
|---|---|---|
| `/` | public | Landing. One line about the product, sign-in. |
| `/write` | gated | Editor: title, type, template, body, optional image URL + live preview. |
| `/published/[slug]` | public | Congrats screen with the live URL. |
| `/p/[slug]` | **public** | The piece, full screen, in its template. This page is the product. |
| `/auth/login`, `/auth/logout`, `/auth/callback` | — | Mounted by the Auth0 SDK middleware. |

## Local development

```bash
npm install
npm run dev
```

Needs a `.env` with `DATABASE_URL` and the `AUTH0_*` vars (both written by the
Stripe Projects CLI — see below). Without them the app still boots: the landing
page renders and tells you what is missing, which is what let it go live on
Vercel in the first half hour.

To open the editor without Auth0 (documented break-glass for the demo), set:

```bash
LEAFLET_DEMO_USER="Your Name"
```

Seed the demo pieces once `DATABASE_URL` is set:

```bash
node scripts/seed.mjs
```

---

## Stripe Projects CLI reference

```bash
# Install Stripe CLI
brew install stripe/cli

# Install + init the Projects plugin
stripe plugin install projects
stripe plugin init
stripe projects init          # writes .env, .gitignore, settings, cloud skills

# Add services (writes credentials into .env)
stripe projects add auth0/client      # AUTH0_* env vars
stripe projects add neon/postgres     # DATABASE_URL
stripe projects add vercel/results    # Vercel deploy target
```

Providers available include Vercel, Auth0, Neon, Agentmail, BrowserBase,
ElevenLabs. For anything not listed, use its API directly and set env vars.

### Plumbing notes

**Auth0** — `@auth0/nextjs-auth0` v4. The SDK's `Auth0Client` is constructed
lazily in [`lib/auth0.ts`](./lib/auth0.ts) so the public half of the app boots
before the `AUTH0_*` vars exist. `middleware.ts` mounts `/auth/login`,
`/auth/logout` and `/auth/callback`; login and logout are plain links. Nothing
hand-rolled.

**Neon** — `@neondatabase/serverless` against `DATABASE_URL`. All reads and
writes live in server actions / server components ([`lib/db.ts`](./lib/db.ts)).

**Vercel** — the Vercel project is connected to this GitHub repo, so every push
to `main` redeploys. "Export to Vercel" was solved in the first half hour.

---

## Agent prompt used to build the app

<details>
<summary>Expand</summary>

```
Build a Next.js (App Router, TypeScript) app called "Leaflet" — an artistic
site builder for writers to publish a single piece of writing, each at its own
dedicated URL, with a pure-typography aesthetic (think Cargo: color, type, and
whitespace only).

Use the already-initialized Stripe Projects services — read the credentials
from .env, do not ask me for them:
- Auth0 (@auth0/nextjs-auth0) for login. Gate the editor behind auth.
- Neon Postgres (DATABASE_URL) via @neondatabase/serverless for storage.
- Deploy target is Vercel (the app is already linked).

Data model — one table `pieces`:
  id uuid pk, user_id text (Auth0 sub), title text, type text
  ('poem'|'fiction'|'review'), template text
  ('broadsheet'|'reader'|'verse'), body text, image_url text nullable,
  slug text unique, created_at timestamptz default now().

Pages/flow:
1. Landing page: one line about the product + "Sign in to write" (Auth0 login).
2. /write (auth-gated): a form — title input, type select, template select
   (3 options), a large textarea for the body, and an optional image URL field.
   Live preview beside the form rendered in the selected template.
3. Publish = a server action that inserts the row, generates a unique slug from
   the title plus a short random suffix, and redirects to a congrats screen
   showing the live URL (/p/<slug>) with a "View your page" button.
4. /p/[slug] (public, no auth): fetches the piece and renders it full-screen in
   its chosen template. This page is the product — make the typography
   exceptional.

Aesthetic target: indie-press / art-book typography (Cargo-like) — pure color
and type, one idea per page, heavy restraint, a serif-display voice contrasted
with a monospace-metadata voice.

Fonts via next/font/google: Instrument Serif (display serif), Inter (grotesk),
Space Mono (mono). Load all three.

Three templates as React components, each a distinct typographic system, one
accent color each, generous whitespace:
- broadsheet: cream page, large Instrument Serif body edge-to-edge (~34px,
  line-height 1.35), huge title, and a monospace colophon row pinned at the
  bottom reading "TYPE · TEMPLATE · DATE". Best for fiction/review.
- reader: near-black page (#0a0a0a), single narrow centered column (~46ch) of
  Inter (~19px) in warm off-white, italic serif title, a couple of tiny
  Space Mono footnote lines flush-right near the bottom. Best for essays.
- verse: poster energy — oversized Instrument Serif title mixing roman + italic,
  one accent color (electric blue or a single warm red), body centered with
  white-space: pre-wrap so line breaks are preserved exactly, generous leading.
  Best for poetry.

Keep it minimal and shippable. Don't build image upload (URL field only),
customization, per-piece Vercel deploys, or the AI template. No CSS framework
beyond what's needed; hand-write the type styles — the design is the whole point.
```

</details>

---

## Project layout

```
app/
  page.tsx                 landing
  write/                   editor (client) + publish server action
  published/[slug]/        congrats screen with the live URL
  p/[slug]/                the public piece — the product
  fonts.ts, globals.css    type stack + app chrome
components/templates/
  Broadsheet.tsx  Reader.tsx  Verse.tsx   one CSS module each
  index.tsx                              picks a template, sets the container
lib/
  auth0.ts  db.ts  slug.ts  format.ts  types.ts
scripts/seed.mjs           seeds the demo pieces
schema.sql                 paste into the Neon console
```
