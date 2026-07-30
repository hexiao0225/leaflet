# Leaflet

An artistic, single-piece digital publication builder for writers. Pure
typography, Cargo-style. **One piece of writing → one dedicated URL.**

Built with Stripe Projects (Auth0 + Neon + Vercel) on Next.js.

- **Live:** https://leaflet-puce.vercel.app
- **Repo:** https://github.com/hexiao0225/leaflet
- **Demo login:** `hello@leaflet.press` / `LeafletDemo2026!`

Three pieces are already published, one per template:

- [Inventory of a Borrowed Room](https://leaflet-puce.vercel.app/p/inventory-of-a-borrowed-room) — poem, **verse**
- [The Cartographer's Daughter](https://leaflet-puce.vercel.app/p/the-cartographers-daughter) — fiction, **broadsheet**
- [On Rereading a Book You Have Already Underlined](https://leaflet-puce.vercel.app/p/on-rereading-a-book-you-have-already-underlined) — review, **reader**

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

Needs a `.env` — run `stripe projects env --pull` to fetch it. Without it the
app still boots: the landing page renders and tells you what is missing, which
is what let it go live on Vercel in the first half hour.

To open the editor without Auth0 (documented break-glass for the demo), set:

```bash
LEAFLET_DEMO_USER="Your Name"
```

Seed the demo pieces once the database URL is set:

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
stripe projects add neon/postgres     # NEON_POSTGRES_* env vars
stripe projects add vercel/project    # VERCEL_TOKEN + project
```

### Four things the CLI does not do for you

Provisioning the three services is not quite enough to make the app work. In
order:

**1. Auth0 v4 needs two vars Stripe does not write.** `AUTH0_SECRET` (session
encryption) and `APP_BASE_URL`. Store them as project variables so they land in
`.env` on every pull:

```bash
stripe projects variables set auth0-secret  --env-key AUTH0_SECRET  --value "$(openssl rand -hex 32)"
stripe projects variables set app-base-url  --env-key APP_BASE_URL  --value "https://leaflet-puce.vercel.app"
stripe projects env --pull
```

**2. The database URL is called something else.** Stripe writes
`NEON_POSTGRES_CONNECTION_STRING`, not `DATABASE_URL`. `lib/db.ts` accepts
either.

**3. Auth0 callback URLs are not registered.** Out of the box a deployed login
fails with **Callback URL mismatch**. Fix it through the CLI, not the dashboard:

```bash
stripe projects update auth0-client auth0/client --config '{
  "callbacks":          ["https://leaflet-puce.vercel.app/auth/callback", "http://localhost:3000/auth/callback"],
  "allowed_logout_urls":["https://leaflet-puce.vercel.app", "http://localhost:3000"],
  "web_origins":        ["https://leaflet-puce.vercel.app", "http://localhost:3000"]
}' -y
```

This does **not** rotate the client credentials, so no redeploy is needed for
the secret — only for the URLs.

**4. The provisioned Vercel project is empty.** It has no deployment, no
framework, and no git connection. Push the env vars to it, link it to the repo
so pushes redeploy, and deploy:

```bash
vercel deploy --prod --token "$VERCEL_TOKEN"
```

Providers available include Vercel, Auth0, Neon, Agentmail, BrowserBase,
ElevenLabs. For anything not listed, use its API directly and set env vars.

### Plumbing notes

**Auth0** — `@auth0/nextjs-auth0` v4. The SDK's `Auth0Client` is constructed
lazily in [`lib/auth0.ts`](./lib/auth0.ts) so the public half of the app boots
before the `AUTH0_*` vars exist. `middleware.ts` mounts `/auth/login`,
`/auth/logout` and `/auth/callback`; login and logout are plain links. Nothing
hand-rolled.

**Neon** — `@neondatabase/serverless` against the connection string. All reads and
writes live in server actions / server components ([`lib/db.ts`](./lib/db.ts)).

**Vercel** — the Stripe-provisioned Vercel project (`hexiao0225-stripe/leaflet`)
is connected to this GitHub repo, so every push to `main` redeploys. Deploys use
the `VERCEL_TOKEN` that Stripe Projects wrote.

---

## How this was built

Leaflet was built by an agent (Claude Code) driven by the prompt sequence below.
Each prompt is given verbatim or lightly condensed, with what it actually
produced. This is the honest record, including the parts that went sideways.

### 1 — Kick off

> `new hackathon project in a new git repo:` *(followed by the full runbook —
> scope decision, MVP, data model, template specs, time budget, CLI
> reference)*. Attached: three reference screenshots — madonnapopstar12,
> becoming.press, andrewculp.

Produced: blank git repo + first commit *before any code* (a rule requirement),
Next.js scaffold, the three templates, editor, publish action, public route.
Live on Vercel roughly 30 minutes in, before any credentials existed — the app
was written to boot without them and say what was missing.

The three screenshots mapped one-to-one onto the three templates, which is why
the templates read as a family rather than three unrelated designs.

### 2 — Orientation

> `which git repo and local folder you are on? and what are all the commands i
> need to run`

Worth doing early. The answer surfaced that the Stripe CLI on the machine was
v1.25 with **API keys expired 2025-06-27**, which is why
`stripe plugin install projects` was 401-ing. Every `stripe` subcommand
authenticates before doing anything, so `stripe login` had to come first.

### 3 — Relocate

> `actually I want to put the project under my code folder. can you do the
> moving?`

Moved `~/projects/leaflet` → `~/code/leaflet`. Verified git remote, Vercel
link, and a clean rebuild from the new path all survived.

### 4 — Provision

> *(pasted the `api_key_expired` error)* … then
> `i have installed all those needed stripe projects, lets continue building
> out the whole product`

This was the longest phase, and almost none of it was app code — see
[Four things the CLI does not do for you](#four-things-the-cli-does-not-do-for-you).
Provisioning three services is not the same as having a working app.

### 5 — Ship

> `this is great! please commit all the code and merge to main. We will then go
> into the refine phase`

Already done — work was merged to `main` continuously rather than accumulating
on a branch.

### 6 — Rebrand

> `for the actual site leaflet, i want a design rebrand. Let's use this style:
> [willhandley.net screenshot] for the landing page. you can replace the
> content from the computer screen with actual content`

The reference is a photograph of an LCD on a rack server. Rather than reuse
someone else's photo, the workstation is **drawn in CSS** — which turned out
better than a photo would have been, because the screen becomes a live region.
It renders a real published piece through the real template component. The
container-query sizing from the editor preview made this exact at any scale.

---

## Workflows

### Deploy

`main` is connected to the Stripe-provisioned Vercel project, so **every push
redeploys**. There is no separate deploy step.

```bash
git push origin main          # production deploy
vercel deploy --prod --token "$VERCEL_TOKEN"   # manual, same target
```

### Verification

Nothing here was reported working on the strength of a build passing. Each
claim was checked against the deployed app with a headless browser:

```bash
npx playwright install chromium
# drive real flows: sign up, fill the editor, publish, open the live URL
```

That loop is what caught the **Callback URL mismatch** (Auth0 rejecting the
Vercel callback) and a colophon colliding with body text on the landing-page
screen. Both look fine in a build log and are obvious the moment you render.

One false alarm worth recording: a logout assertion failed because the test
matched `"Sign in to write"` case-sensitively while CSS uppercases it. The test
was wrong, not the app — worth confirming which before chasing a fix.

### Database

No migration framework. `schema.sql` is applied directly over the connection
string, so the Neon web console is never needed:

```bash
node scripts/seed.mjs         # seeds the demo pieces, safe to re-run
```

### Editing

The agent worked in short-lived git worktrees merged into `main` as it went, so
the history stays linear and nothing half-finished ever sat in the checkout.
One trap: a worktree created before the scaffold was committed had no
`package.json`, so `npm install` silently resolved to the parent directory and
Next inferred the wrong workspace root. Worktrees need the dependency manifest
committed first.

---

## The original spec prompt

Given to the agent after Stripe Projects was configured, so it could read the
initialized services rather than ask for credentials.

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
  page.tsx                 landing — the workstation
  page.module.css          landing only
  shell.module.css         chrome shared by /write's gate and the 404
  write/                   editor (client) + publish server action
  published/[slug]/        congrats screen with the live URL
  p/[slug]/                the public piece — the product
  fonts.ts, globals.css    type stack + app chrome
components/
  Workstation.tsx          the CSS-drawn LCD; children render on the glass
  templates/
    Broadsheet.tsx  Reader.tsx  Verse.tsx   one CSS module each
    index.tsx                              picks a template, sets the container
lib/
  auth0.ts  db.ts  slug.ts  format.ts  types.ts
scripts/seed.mjs           seeds the demo pieces
schema.sql                 the one table
```
