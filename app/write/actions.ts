"use server";

import { redirect } from "next/navigation";
import { getAuthor } from "@/lib/auth0";
import { insertPiece } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { safeImageUrl } from "@/lib/format";
import { isPieceType, isTemplate } from "@/lib/types";

export type PublishState = { error: string | null };

export async function publishPiece(
  _prev: PublishState,
  formData: FormData
): Promise<PublishState> {
  const author = await getAuthor();
  if (!author) return { error: "Your session expired. Sign in and try again." };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const template = String(formData.get("template") ?? "");
  const imageRaw = String(formData.get("image_url") ?? "").trim();

  if (!title) return { error: "Give the piece a title." };
  if (!body) return { error: "The piece needs a body." };
  if (!isPieceType(type)) return { error: "Pick a type." };
  if (!isTemplate(template)) return { error: "Pick a template." };
  if (imageRaw && !safeImageUrl(imageRaw)) {
    return { error: "That image URL is not a valid http(s) URL." };
  }

  let slug: string;
  try {
    const piece = await insertPiece({
      user_id: author.sub,
      title,
      type,
      template,
      body,
      image_url: safeImageUrl(imageRaw),
      slug: slugify(title),
    });
    slug = piece.slug;
  } catch (error) {
    console.error("publish failed", error);
    return {
      error:
        error instanceof Error && error.message.includes("DATABASE_URL")
          ? "Neon is not connected yet. Run `stripe projects add neon/postgres`."
          : "Could not publish. Check that the `pieces` table exists in Neon.",
    };
  }

  redirect(`/published/${slug}`);
}
