import Link from "next/link";
import Workstation from "@/components/Workstation";
import PieceView from "@/components/templates";
import { getAuthor, isAuthConfigured } from "@/lib/auth0";
import { getFeaturedPiece } from "@/lib/db";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Landing() {
  const authConfigured = isAuthConfigured();
  const author = await getAuthor();

  // The screen shows a real published piece, rendered by the real template.
  const featured = await getFeaturedPiece().catch(() => null);

  return (
    <main className={styles.page}>
      <div className={styles.rail}>
        <Link href="/" className={styles.wordmark}>
          Leaflet
        </Link>

        <nav className={styles.nav}>
          {author ? (
            <>
              <Link href="/write" className={styles.navActive}>
                Write a Piece
              </Link>
              <a href="/auth/logout" className={styles.navItem}>
                Sign Out
              </a>
            </>
          ) : authConfigured ? (
            <a href="/auth/login?returnTo=/write" className={styles.navActive}>
              Sign In to Write
            </a>
          ) : (
            <Link href="/write" className={styles.navActive}>
              Sign In to Write
            </Link>
          )}
          {featured && (
            <Link href={`/p/${featured.slug}`} className={styles.navItem}>
              Selected Work
            </Link>
          )}
          <span className={styles.navTemplates}>Broadsheet · Reader · Verse</span>
        </nav>

        <p className={styles.railNote}>
          One piece of writing, one dedicated URL.
        </p>
      </div>

      <div className={styles.stage}>
        <Workstation>
          <div className={styles.screenChrome}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.urlBar}>
              {featured ? `leaflet.app/p/${featured.slug}` : "leaflet.app"}
            </span>
          </div>

          <div className={styles.screenBody}>
            {featured ? (
              <PieceView piece={featured} variant="preview" />
            ) : (
              <p className={styles.blank}>Nothing published yet.</p>
            )}
          </div>
        </Workstation>
      </div>

      <div className={styles.railRight}>
        <span className={styles.meta}>
          {author ? author.name : "Publication Builder"}
        </span>
        <span className={styles.meta}>Auth0 · Neon · Vercel</span>
      </div>
    </main>
  );
}
