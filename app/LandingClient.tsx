"use client";

import Link from "next/link";
import { useState } from "react";
import Workstation from "@/components/Workstation";
import PieceView from "@/components/templates";
import type { PieceDraft } from "@/lib/types";
import styles from "./page.module.css";

export type ScreenPiece = PieceDraft & { slug: string };

export default function LandingClient({
  authConfigured,
  authorName,
  pieces,
}: {
  authConfigured: boolean;
  authorName: string | null;
  pieces: ScreenPiece[];
}) {
  const [activeSlug, setActiveSlug] = useState(pieces[0]?.slug ?? null);
  const active = pieces.find((p) => p.slug === activeSlug) ?? pieces[0] ?? null;

  return (
    <main className={styles.page}>
      <div className={styles.rail}>
        <Link href="/" className={styles.wordmark}>
          Leaflet
        </Link>

        <nav className={styles.nav}>
          {authorName ? (
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

          {pieces.length > 0 && (
            <details className={styles.submenu} open>
              <summary className={styles.navItem}>Selected Work</summary>
              <div className={styles.submenuItems}>
                {pieces.map((piece) => (
                  <button
                    key={piece.slug}
                    type="button"
                    onClick={() => setActiveSlug(piece.slug)}
                    aria-current={piece.slug === active?.slug}
                    className={
                      piece.slug === active?.slug
                        ? styles.submenuItemActive
                        : styles.submenuItem
                    }
                  >
                    {piece.title}
                  </button>
                ))}
              </div>
            </details>
          )}

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
          , artist and product engineer based in San Francisco.
        </p>
      </div>

      <div className={styles.stage}>
        <Workstation>
          <div className={styles.screenChrome}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.dot} aria-hidden="true" />
            {active ? (
              <Link
                href={`/p/${active.slug}`}
                className={styles.urlBar}
                title={`Open ${active.title}`}
              >
                leaflet.app/p/{active.slug}
              </Link>
            ) : (
              <span className={styles.urlBar}>leaflet.app</span>
            )}
          </div>

          <div className={styles.screenBody}>
            {active ? (
              // Keyed so switching pieces remounts and scrolls back to the top.
              <PieceView key={active.slug} piece={active} variant="screen" />
            ) : (
              <p className={styles.blank}>Nothing published yet.</p>
            )}
          </div>
        </Workstation>
      </div>

      <div className={styles.railRight}>
        <p className={styles.pitch}>
          <strong>Publish a single piece.</strong>
          Paste a poem, a story, or a review. Choose how it is set. It goes live
          at its own URL — nothing else on the page.
        </p>
      </div>
    </main>
  );
}
