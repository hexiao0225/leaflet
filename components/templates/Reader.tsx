import type { PieceDraft } from "@/lib/types";
import { formatDate, paragraphs, safeImageUrl } from "@/lib/format";
import styles from "./reader.module.css";

export default function Reader({ piece }: { piece: PieceDraft }) {
  const image = safeImageUrl(piece.image_url);
  const body = paragraphs(piece.body);

  return (
    <div className={styles.page}>
      <article className={styles.sheet}>
        <header className={styles.head}>
          <span className={styles.folio}>1</span>
          <span>{piece.type}</span>
        </header>

        <div className={styles.column}>
          <h1 className={styles.title}>{piece.title || "Untitled"}</h1>
          <p className={styles.meta}>
            {formatDate(piece.created_at)} · Leaflet Editions
          </p>

          {image && (
            <figure className={styles.figure}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" />
            </figure>
          )}

          <div className={styles.body}>
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className={styles.spacer} />

        <footer className={styles.footnotes}>
          <p>
            <span>1.</span>Set in Inter and Space Mono.
          </p>
          <p>
            <span>15.</span>Ibid.
          </p>
        </footer>
      </article>
    </div>
  );
}
