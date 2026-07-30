import { neon } from "@neondatabase/serverless";
import type { Piece } from "./types";

function connection() {
  // Stripe Projects writes NEON_POSTGRES_CONNECTION_STRING; DATABASE_URL is
  // accepted too so the app runs against any plain Postgres URL.
  const url =
    process.env.DATABASE_URL || process.env.NEON_POSTGRES_CONNECTION_STRING;
  if (!url) {
    throw new Error(
      "No database URL set. Run `stripe projects add neon/postgres`."
    );
  }
  return neon(url);
}

export async function insertPiece(
  piece: Omit<Piece, "id" | "created_at">
): Promise<Piece> {
  const sql = connection();
  const rows = (await sql`
    insert into pieces (user_id, title, type, template, body, image_url, slug)
    values (${piece.user_id}, ${piece.title}, ${piece.type}, ${piece.template},
            ${piece.body}, ${piece.image_url}, ${piece.slug})
    returning *
  `) as Piece[];
  return rows[0];
}

export async function getPieceBySlug(slug: string): Promise<Piece | null> {
  const sql = connection();
  const rows = (await sql`
    select * from pieces where slug = ${slug} limit 1
  `) as Piece[];
  return rows[0] ?? null;
}

export async function listRecentPieces(limit = 6): Promise<Piece[]> {
  const sql = connection();
  return (await sql`
    select * from pieces order by created_at desc limit ${limit}
  `) as Piece[];
}

/**
 * Curated pieces for the landing page's Selected Work menu, returned in the
 * order the slugs are given. Titles come from the database so the menu can't
 * drift; anything deleted simply drops out.
 */
export async function listPiecesBySlugs(slugs: string[]): Promise<Piece[]> {
  if (slugs.length === 0) return [];
  const sql = connection();
  const rows = (await sql`
    select * from pieces where slug = any(${slugs})
  `) as Piece[];
  return slugs
    .map((slug) => rows.find((row) => row.slug === slug))
    .filter((row): row is Piece => Boolean(row));
}

/**
 * The piece shown on the landing page's screen. Prefers a light template —
 * a dark page behind the glass loses the lit-monitor effect.
 */
export async function getFeaturedPiece(): Promise<Piece | null> {
  const sql = connection();
  const rows = (await sql`
    select * from pieces
    order by (template in ('verse', 'broadsheet')) desc, created_at desc
    limit 1
  `) as Piece[];
  return rows[0] ?? null;
}

export async function listPiecesByUser(userId: string): Promise<Piece[]> {
  const sql = connection();
  return (await sql`
    select * from pieces where user_id = ${userId} order by created_at desc
  `) as Piece[];
}
