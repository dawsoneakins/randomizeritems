import { TMDBTV } from "@/app/types/apis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

  const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("TMDB TV fetch error:", await res.text());
    return NextResponse.json(
      { error: "Failed to fetch TV shows from TMDB" },
      { status: 500 }
    );
  }

  const data = await res.json();

  const formatted = data.results.map((show: TMDBTV) => ({
    id: show.id,
    name: show.name,
    image: show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : undefined,
    releaseDate: show.first_air_date || undefined,
    type: "tv",
  }));

  return NextResponse.json(formatted);
}
