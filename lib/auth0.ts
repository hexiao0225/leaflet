import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Auth0 is created lazily so the public half of the app (the landing page and
 * every published piece) still boots before the AUTH0_* vars are written by
 * `stripe projects add auth0/client`.
 */
let client: Auth0Client | null = null;

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET
  );
}

export function getAuth0(): Auth0Client | null {
  if (!isAuthConfigured()) return null;
  if (!client) client = new Auth0Client();
  return client;
}

export type Author = { sub: string; name: string };

/** The signed-in author, or null when signed out / not yet configured. */
export async function getAuthor(): Promise<Author | null> {
  const auth0 = getAuth0();
  if (!auth0) {
    // Documented break-glass for the demo if Auth0 misbehaves on stage: set
    // LEAFLET_DEMO_USER to a name and the editor opens without a login.
    const demo = process.env.LEAFLET_DEMO_USER;
    return demo ? { sub: `demo|${demo}`, name: demo } : null;
  }

  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) return null;
    const { sub, name, nickname, email } = session.user;
    return { sub, name: name || nickname || email || "Anonymous" };
  } catch {
    return null;
  }
}
