import { useState, useEffect, useRef } from "react";
import { IGDBGame } from "../types/IGDBGame";

export type GameItem = {
  name: string;
  image: string | undefined;
  releaseDate: string | undefined;
};

export default function GameSearchInput({
  onSelect,
}: {
  onSelect: (item: GameItem) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) return;
    const delay = setTimeout(async () => {
      setIsLoading(true);
      const games = await fetchIGDBGames(query);
      setResults(games);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mb-4">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded border-none focus:outline-none"
        placeholder="Search for a game..."
        style={{
          backgroundColor: "#9f8d8d",
          color: "#232220",
          fontWeight: "500",
        }}
      />

      {isLoading && <p className="text-sm text-[#ffddba] mt-1">Searching...</p>}

      {results.length > 0 && (
        <ul className="absolute z-10 bg-[#4e4c4f] w-full rounded mt-1 max-h-60 overflow-y-auto shadow">
          {results.map((game, idx) => {
            return (
              <li
                key={game.name + idx}
                onClick={() => {
                  onSelect({
                    name: game.name,
                    image: game.image,
                    releaseDate: game.releaseDate,
                  });
                  setQuery("");
                  setResults([]);
                  inputRef.current?.blur();
                }}
                className="px-4 py-2 text-[#ffddba] cursor-pointer hover:bg-[#d9ae8e] hover:text-[#232220] transition-colors duration-150"
              >
                {game.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export async function fetchIGDBGames(query: string): Promise<GameItem[]> {
  const res = await fetch("/api/igdb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    console.error("IGDB search failed:", await res.text());
    return [];
  }

  const data: GameItem[] = await res.json(); // Already formatted from the server
  console.log("Fetched games:", data);
  return data;
}
