import { getAuthor, isAuthConfigured } from "@/lib/auth0";
import { listPiecesBySlugs } from "@/lib/db";
import type { PieceDraft } from "@/lib/types";
import LandingClient, { type ScreenPiece } from "./LandingClient";

export const dynamic = "force-dynamic";

/**
 * Curated, in menu order. The first one is on the screen when the page loads.
 * Titles are read from the database so the menu cannot drift, and anything
 * deleted simply drops out.
 */
const SELECTED_WORK = [
  "flying-kite-77vnv",
  "on-hamnet-creation-and-humanity-aq75f",
  "ray-ray-6dh94",
];

export default async function Landing() {
  const authConfigured = isAuthConfigured();
  const author = await getAuthor();
  const pieces = await listPiecesBySlugs(SELECTED_WORK).catch(() => []);

  // Only what the screen needs — no user_id or row id crosses to the client.
  const screenPieces: ScreenPiece[] = pieces.map((piece) => ({
    slug: piece.slug,
    title: piece.title,
    type: piece.type,
    template: piece.template,
    body: piece.body,
    image_url: piece.image_url,
    created_at: piece.created_at,
  } satisfies PieceDraft & { slug: string }));

  return (
    <LandingClient
      authConfigured={authConfigured}
      authorName={author?.name ?? null}
      pieces={screenPieces}
    />
  );
}
