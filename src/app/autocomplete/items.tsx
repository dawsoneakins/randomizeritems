import { useState, useEffect, useRef } from "react";
import { Item } from "../types/Item";

import { IGDBApiResponse, TMDBApiResponse } from "../types/apis";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!input.trim()) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      const items = await fetchItems(input);
      console.log("Fetched items:", items);
      setResults(items);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [input, fetchItems]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Refetch when user refocuses input
  const handleFocus = async () => {
    if (input.trim() && results.length === 0) {
      setLoading(true);
      const items = await fetchItems(input);
      setResults(items);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onAddCustom();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col sm:flex-row gap-2"
    >
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
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
              className="flex items-center gap-3 px-4 py-2 text-[#ffddba] cursor-pointer hover:bg-[#d9ae8e] hover:text-[#232220]"
            >
              {item.image && (
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                {item.type && (
                  <span className="text-xs text-[#c8b9a6]">
                    {item.type.toUpperCase()}
                  </span>
                )}
              </div>
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

  const games = await res.json();
  console.log("IGDB games:", games);

  return games.map((game: IGDBApiResponse) => ({
    ...game,
    type: "game",
  }));
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

  return movies.map((movie: TMDBApiResponse) => ({
    id: movie.id,
    name: movie.name,
    image: movie.image
      ? `https://image.tmdb.org/t/p/w500${movie.image}`
      : undefined,
    releaseDate: movie.release_date,
    type: "movie",
  }));
}
