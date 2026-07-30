import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PieceView from "@/components/templates";
import { getPieceBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const piece = await getPieceBySlug(slug);
    if (!piece) return { title: "Not found — Leaflet" };
    return {
      title: piece.title,
      description: piece.body.slice(0, 160),
      openGraph: { title: piece.title, type: "article" },
    };
  } catch {
    return { title: "Leaflet" };
  }
}

export default async function PiecePage({ params }: Params) {
  const { slug } = await params;

  const piece = await getPieceBySlug(slug).catch(() => null);
  if (!piece) notFound();

  return <PieceView piece={piece} />;
}
