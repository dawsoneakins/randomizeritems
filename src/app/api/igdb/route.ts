import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query }: { query: string } = await req.json();

  const igdbRes = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!, // No NEXT_PUBLIC here
      Authorization: `Bearer ${process.env.IGDB_TOKEN!}`,
      "Content-Type": "text/plain",
    },
    body: `search "${query}"; fields id, name, cover.image_id, first_release_date; limit 10;`,
  });

  if (!igdbRes.ok) {
    console.error("IGDB fetch error", await igdbRes.text());
    return NextResponse.json(
      { error: "Failed to fetch from IGDB" },
      { status: 500 }
    );
  }

  const rawData = await igdbRes.json();

  const formatted = rawData.map((game: any) => ({
    id: game.id,
    name: game.name,
    image: game.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : null,
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
      : null,
  }));

  return NextResponse.json(formatted);
}
