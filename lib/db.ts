import { neon } from "@neondatabase/serverless";
import type { Piece } from "./types";

function connection() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Run `stripe projects add neon/postgres`."
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

export async function listPiecesByUser(userId: string): Promise<Piece[]> {
  const sql = connection();
  return (await sql`
    select * from pieces where user_id = ${userId} order by created_at desc
  `) as Piece[];
}
