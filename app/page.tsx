import Link from "next/link";
import Workstation from "@/components/Workstation";
import PieceView from "@/components/templates";
import { getAuthor, isAuthConfigured } from "@/lib/auth0";
import { getFeaturedPiece, getPieceBySlug, listPiecesBySlugs } from "@/lib/db";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

/** Shown on the monitor. Falls back to a light-template piece if it's gone. */
const FEATURED_SLUG = "flying-kite-77vnv";

/** Curated, in menu order. Titles are read from the database. */
const SELECTED_WORK = [
  "early-summer-kjwf4",
  "ray-ray-6dh94",
  "the-cartographers-daughter",
];

export default async function Landing() {
  const authConfigured = isAuthConfigured();
  const author = await getAuthor();

  // The screen shows a real published piece, rendered by the real template.
  const featured =
    (await getPieceBySlug(FEATURED_SLUG).catch(() => null)) ??
    (await getFeaturedPiece().catch(() => null));
  const selected = await listPiecesBySlugs(SELECTED_WORK).catch(() => []);

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
          {selected.length > 0 && (
            <details className={styles.submenu} open>
              <summary className={styles.navItem}>Selected Work</summary>
              <div className={styles.submenuItems}>
                {selected.map((piece) => (
                  <Link
                    key={piece.slug}
                    href={`/p/${piece.slug}`}
                    className={styles.submenuItem}
                  >
                    {piece.title}
                  </Link>
                ))}
              </div>
            </details>
          )}
          <span className={styles.navTemplates}>Broadsheet · Reader · Verse</span>
        </nav>

        <p className={styles.railNote}>
          One piece of writing, one dedicated URL.
        </p>

        <p className={styles.credit}>
          Made by{" "}
          <a
            className={styles.creditLink}
            href="https://www.xiaohe.studio/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xiao He
          </a>
          , artist based in San Francisco.
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
