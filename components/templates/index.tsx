import type { PieceDraft, TemplateName } from "@/lib/types";
import Broadsheet from "./Broadsheet";
import Reader from "./Reader";
import Verse from "./Verse";
import styles from "./frame.module.css";

const TEMPLATE_COMPONENTS = {
  broadsheet: Broadsheet,
  reader: Reader,
  verse: Verse,
} satisfies Record<TemplateName, React.ComponentType<{ piece: PieceDraft }>>;

export default function PieceView({
  piece,
  variant = "page",
}: {
  piece: PieceDraft;
  variant?: "page" | "preview" | "screen";
}) {
  const Template = TEMPLATE_COMPONENTS[piece.template] ?? Broadsheet;
  return (
    <div className={`${styles.frame} ${styles[variant]}`}>
      <Template piece={piece} />
    </div>
  );
}
