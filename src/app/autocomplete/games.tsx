import { useState, useEffect, useRef } from "react";
import { Item } from "../types/Item";

export function GameSearchInput({
  input,
  setInput,
  onSelect,
  onAddCustom,
}: {
  input: string;
  setInput: (val: string) => void;
  onSelect: (item: Item) => void;
  onAddCustom: () => void;
}) {
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input.trim()) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      const games = await fetchIGDBGames(input);
      setResults(games);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onAddCustom();
  };

  return (
    <div className="relative w-full flex flex-col sm:flex-row gap-2">
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 rounded focus:outline-none"
        placeholder="Type or search for a game..."
        style={{
          backgroundColor: "#9f8d8d",
          color: "#232220",
          fontWeight: "500",
        }}
      />

      <button
        onClick={onAddCustom}
        className="px-5 py-2 text-lg rounded hover:opacity-90"
        style={{
          backgroundColor: "#d9ae8e",
          color: "#232220",
          fontWeight: "600",
        }}
      >
        Add
      </button>

      {loading && <p className="text-sm text-[#ffddba] mt-1">Searching...</p>}

      {results.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-full z-10 rounded bg-[#4e4c4f] max-h-60 overflow-y-auto shadow">
          {results.map((game, idx) => (
            <li
              key={`${game.name}-${idx}`}
              onClick={() => {
                onSelect(game);
                setInput("");
                setResults([]);
              }}
              className="px-4 py-2 text-[#ffddba] cursor-pointer hover:bg-[#d9ae8e] hover:text-[#232220]"
            >
              {game.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function fetchIGDBGames(query: string): Promise<Item[]> {
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

  const data: Item[] = await res.json(); // Already formatted from the server
  console.log("Fetched games:", data);
  return data;
}
