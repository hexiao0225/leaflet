import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPieceBySlug } from "@/lib/db";
import styles from "./published.module.css";

export const dynamic = "force-dynamic";

async function baseUrl(): Promise<string> {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

export default async function PublishedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const piece = await getPieceBySlug(slug).catch(() => null);
  if (!piece) notFound();

  const liveUrl = `${await baseUrl()}/p/${piece.slug}`;

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <Link href="/" className="mono-label">
          Leaflet
        </Link>
        <span className="mono-label">Published</span>
      </div>

      <div className={styles.center}>
        <p className={styles.eyebrow}>It is live</p>
        <h1 className={styles.headline}>
          Your page <em>exists</em>
        </h1>
        <p className={styles.pieceTitle}>
          “{piece.title}” · {piece.type} · {piece.template}
        </p>

        <div className={styles.urlRow}>
          <a className={styles.url} href={liveUrl}>
            {liveUrl}
          </a>
        </div>

        <div className={styles.actions}>
          <a className={styles.cta} href={`/p/${piece.slug}`}>
            View your page
          </a>
          <Link className={styles.ghost} href="/write">
            Write another
          </Link>
        </div>
      </div>
    </main>
  );
}
