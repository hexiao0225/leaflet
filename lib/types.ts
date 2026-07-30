export const PIECE_TYPES = ["poem", "fiction", "review"] as const;
export type PieceType = (typeof PIECE_TYPES)[number];

export const TEMPLATES = ["broadsheet", "reader", "verse"] as const;
export type TemplateName = (typeof TEMPLATES)[number];

export type Piece = {
  id: string;
  user_id: string;
  title: string;
  type: PieceType;
  template: TemplateName;
  body: string;
  image_url: string | null;
  slug: string;
  created_at: string;
};

/** What the editor previews — a piece that may not exist in the database yet. */
export type PieceDraft = Pick<
  Piece,
  "title" | "type" | "template" | "body" | "image_url"
> & { created_at?: string };

export const TEMPLATE_BLURBS: Record<TemplateName, string> = {
  broadsheet: "Cream page, large serif set edge to edge. Best for fiction.",
  reader: "Near-black page, one narrow column. Best for reviews.",
  verse: "Poster energy, exact line breaks. Best for poetry.",
};

export function isPieceType(value: unknown): value is PieceType {
  return PIECE_TYPES.includes(value as PieceType);
}

export function isTemplate(value: unknown): value is TemplateName {
  return TEMPLATES.includes(value as TemplateName);
}
