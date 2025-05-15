import { useState, useEffect, useRef } from "react";
import { Item } from "../types/Item";

export function SearchInput({
  input,
  setInput,
  onSelect,
  onAddCustom,
  fetchItems,
  placeholder = "Type or search...",
}: {
  input: string;
  setInput: (val: string) => void;
  onSelect: (item: Item) => void;
  onAddCustom: () => void;
  fetchItems: (query: string) => Promise<Item[]>;
  placeholder?: string;
}) {
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input.trim()) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      const items = await fetchItems(input);
      setResults(items);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [input, fetchItems]);

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
        placeholder={placeholder}
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
          {results.map((item, idx) => (
            <li
              key={`${item.name}-${idx}`}
              onClick={() => {
                onSelect(item);
                setInput("");
                setResults([]);
              }}
              className="px-4 py-2 text-[#ffddba] cursor-pointer hover:bg-[#d9ae8e] hover:text-[#232220]"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function fetchCombinedItems(query: string): Promise<Item[]> {
  const [games, movies] = await Promise.all([
    fetchItemsFromIGDB(query),
    fetchItemsFromTMDB(query),
  ]);

  return [...games, ...movies];
}

async function fetchItemsFromIGDB(query: string): Promise<Item[]> {
  const res = await fetch("/api/igdb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    console.error("IGDB search failed:", await res.text());
    return [];
  }

  const data: Item[] = await res.json();
  console.log("IGDB games:", data);
  return data;
}

async function fetchItemsFromTMDB(query: string): Promise<Item[]> {
  const res = await fetch("/api/tmdb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    console.error("TMDB search failed:", await res.text());
    return [];
  }

  const movies = await res.json();
  console.log("TMDB movies:", movies);

  return movies.map((movie: any) => ({
    name: movie.title,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined,
    releaseDate: movie.release_date,
  }));
}
