import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const store = readStore();

  const beat = store.beats.find((b) => b.id === id);
  if (!beat) {
    return NextResponse.json({ error: "Beat non trouvé" }, { status: 404 });
  }

  const newComment = {
    id: Date.now().toString(),
    author: body.author,
    text: body.text,
    rating: body.rating,
    date: body.date || "À l'instant"
  };

  if (!beat.comments) {
    beat.comments = [];
  }

  beat.comments.unshift(newComment);
  await writeStore(store);

  return NextResponse.json(newComment);
}