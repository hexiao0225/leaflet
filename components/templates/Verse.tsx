import type { PieceDraft } from "@/lib/types";
import { formatDate, safeImageUrl } from "@/lib/format";
import styles from "./verse.module.css";

/**
 * Sets the first half of the title roman and the second half italic, so every
 * title gets the mixed-voice display treatment without any authoring effort.
 */
function MixedTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return <>{title}</>;

  const pivot = Math.ceil(words.length / 2);
  return (
    <>
      {words.slice(0, pivot).join(" ")}{" "}
      <em className={styles.italic}>{words.slice(pivot).join(" ")}</em>
    </>
  );
}

export default function Verse({ piece }: { piece: PieceDraft }) {
  const image = safeImageUrl(piece.image_url);
  const title = piece.title || "Untitled";

  return (
    <article className={styles.page}>
      <p className={styles.stamp}>
        {piece.type} — {formatDate(piece.created_at)}
      </p>

      <h1 className={styles.title}>
        <MixedTitle title={title} />
      </h1>

      <hr className={styles.dash} />

      {image && (
        <figure className={styles.figure}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" />
        </figure>
      )}

      <div className={styles.body}>{piece.body}</div>

      <p className={styles.colophon}>Verse · Leaflet</p>
    </article>
  );
}
