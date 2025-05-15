import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
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
    console.error("TMDB fetch error:", await res.text());
    return NextResponse.json(
      { error: "Failed to fetch movies from TMDB" },
      { status: 500 }
    );
  }

  const data = await res.json();

  const formatted = data.results.map((movie: any) => ({
    id: movie.id,
    name: movie.title,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    releaseDate: movie.release_date || null,
  }));

  return NextResponse.json(formatted);
}
