import Link from "next/link";
import { getAuthor, isAuthConfigured } from "@/lib/auth0";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Landing() {
  const authConfigured = isAuthConfigured();
  const author = await getAuthor();

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <span className="mono-label">Leaflet</span>
        <span className="mono-label">Publication Builder</span>
      </div>

      <div className={styles.center}>
        <h1 className={styles.wordmark}>
          Leaf<em>let</em>
        </h1>

        <p className={styles.pitch}>
          One piece of writing, one dedicated URL. Pure typography — no themes,
          no chrome, no feed.
        </p>

        <div className={styles.actions}>
          {author ? (
            <>
              <Link href="/write" className={styles.cta}>
                Write a piece
              </Link>
              <a href="/auth/logout" className={styles.ghost}>
                Sign out
              </a>
              <span className="mono-label">Signed in as {author.name}</span>
            </>
          ) : authConfigured ? (
            <a href="/auth/login?returnTo=/write" className={styles.cta}>
              Sign in to write
            </a>
          ) : (
            <Link href="/write" className={styles.cta}>
              Sign in to write
            </Link>
          )}
        </div>

        {!authConfigured && (
          <p className={styles.notice}>
            Auth0 is not configured yet. Run{" "}
            <strong>stripe projects add auth0/client</strong> to write the
            AUTH0_* vars, then redeploy.
          </p>
        )}
      </div>

      <div className={styles.bottom}>
        <span className="mono-label">Broadsheet · Reader · Verse</span>
        <span className="mono-label">Auth0 · Neon · Vercel</span>
      </div>
    </main>
  );
}
