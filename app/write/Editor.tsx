"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import PieceView from "@/components/templates";
import {
  PIECE_TYPES,
  TEMPLATES,
  TEMPLATE_BLURBS,
  type PieceType,
  type TemplateName,
} from "@/lib/types";
import { publishPiece, type PublishState } from "./actions";
import styles from "./editor.module.css";

const PLACEHOLDER_BODY = `Start typing, or paste a piece here.

Blank lines separate paragraphs. In the verse template every line break is kept exactly as you wrote it.`;

function PublishButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.publish} disabled={pending}>
      {pending ? "Publishing…" : "Publish"}
    </button>
  );
}

export default function Editor({ authorName }: { authorName: string }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<PieceType>("poem");
  const [template, setTemplate] = useState<TemplateName>("verse");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [state, formAction] = useActionState<PublishState, FormData>(
    publishPiece,
    { error: null }
  );

  const draft = {
    title,
    type,
    template,
    body: body || PLACEHOLDER_BODY,
    image_url: imageUrl || null,
  };

  return (
    <div className={styles.shell}>
      <form action={formAction} className={styles.form}>
        <div className={styles.head}>
          <Link href="/" className={styles.homeLink}>
            Leaflet
          </Link>
          <span className="mono-label">{authorName}</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            autoComplete="off"
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value as PieceType)}
            >
              {PIECE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="image_url">
              Image URL
            </label>
            <input
              id="image_url"
              name="image_url"
              className={styles.input}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="optional"
              inputMode="url"
              autoComplete="off"
            />
          </div>
        </div>

        <fieldset className={styles.templates}>
          <legend className={styles.label}>Template</legend>
          {TEMPLATES.map((name) => (
            <label
              key={name}
              className={
                template === name ? styles.templateChecked : styles.templateOption
              }
            >
              <input
                type="radio"
                name="template"
                value={name}
                checked={template === name}
                onChange={() => setTemplate(name)}
              />
              <span>
                <span className={styles.templateName}>{name}</span>
                <span className={styles.templateBlurb}>
                  {TEMPLATE_BLURBS[name]}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="body">
            The piece
          </label>
          <textarea
            id="body"
            name="body"
            className={styles.textarea}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste your writing here."
            required
          />
        </div>

        {state.error && <p className={styles.error}>{state.error}</p>}

        <PublishButton />
      </form>

      <aside className={styles.previewPane}>
        <div className={styles.previewHead}>
          <span className="mono-label">Live preview</span>
          <span className="mono-label">{template}</span>
        </div>
        <div className={styles.previewWindow}>
          <PieceView piece={draft} variant="preview" />
        </div>
      </aside>
    </div>
  );
}
