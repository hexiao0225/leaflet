import type { PieceDraft } from "@/lib/types";
import { formatDate, paragraphs, safeImageUrl } from "@/lib/format";
import styles from "./broadsheet.module.css";

export default function Broadsheet({ piece }: { piece: PieceDraft }) {
  const image = safeImageUrl(piece.image_url);
  const body = paragraphs(piece.body);

  return (
    <article className={styles.page}>
      <header className={styles.masthead}>
        <p className={styles.kicker}>{piece.type}</p>
        <h1 className={styles.title}>{piece.title || "Untitled"}</h1>
      </header>

      <hr className={styles.rule} />

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

      <footer className={styles.colophon}>
        <span>
          {piece.type} <span className={styles.colophonMark}>·</span> broadsheet{" "}
          <span className={styles.colophonMark}>·</span>{" "}
          {formatDate(piece.created_at)}
        </span>
        <span>Leaflet</span>
      </footer>
    </article>
  );
}
