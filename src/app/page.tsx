"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GameSearchInput from "./autocomplete/games";

type Item = {
  name: string;
  image?: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);

  const addItem = () => {
    const trimmed = input.trim();

    if (!trimmed) {
      setError("Please enter an item name.");
      return;
    }

    const isDuplicate = items.some(
      (item) => item.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      const confirmAdd = window.confirm(
        "This item already exists. Are you sure you want to add it again?"
      );
      if (!confirmAdd) {
        setInput("");
        setError(null);
        return;
      }
    }

    setItems((prev) => [...prev, { name: trimmed }]);
    setInput("");
    setError(null);
    setSelected(null);
  };

  const addToHistory = (item: string) => {
    const current = localStorage.getItem("randomPickerHistory");
    const updated = [item, ...(current ? JSON.parse(current) : [])];
    localStorage.setItem("randomPickerHistory", JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const pickRandom = () => {
    if (items.length === 0) return;
    setIsPicking(true);
    setCarouselIndex(0);
    setSelected(null);

    let currentIndex = 0;
    const totalSpins = 15 + Math.floor(Math.random() * 10);
    const interval = 100;

    const spinner = setInterval(() => {
      currentIndex++;
      setCarouselIndex(currentIndex % items.length);

      if (currentIndex >= totalSpins) {
        clearInterval(spinner);
        const picked = items[currentIndex % items.length];

        setSelected(picked.name);
        addToHistory(picked.name);
        setIsPicking(false);
      }
    }, interval);
  };

  const clearAllItems = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to remove all items?"
    );
    if (!confirmClear) return;

    setItems([]);
    setSelected(null);
    setCarouselIndex(null);
    setIsPicking(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#232220] px-4">
      <div className="w-full max-w-4xl pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#ffddba]">
          🎲 Random Item Picker
        </h1>

        <div className="flex gap-2 mb-6">
          <GameSearchInput
            onSelect={(item) => setItems((prev) => [...prev, item])}
          />

          <button
            onClick={addItem}
            className="px-5 py-3 text-lg rounded shrink-0 hover:opacity-90"
            style={{
              backgroundColor: "#d9ae8e",
              color: "#232220",
              fontWeight: "600",
            }}
          >
            Add
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mb-6">{error}</p>}

        {items.length > 0 && (
          <section className="flex flex-wrap gap-4 justify-center mb-10">
            {items.map(
              (item, index) => (
                console.log("item", item),
                (
                  <div
                    key={index}
                    className="flex flex-col justify-between p-4 rounded shadow w-[200px]"
                    style={{
                      backgroundColor: "#4e4c4f",
                      color: "#ffddba",
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="mb-2 rounded"
                        style={{ height: "160px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="h-[160px] mb-2 flex items-center justify-center rounded bg-[#9f8d8d] text-[#232220] text-sm">
                        No image
                      </div>
                    )}

                    <span className="text-lg font-semibold mb-2 text-center">
                      {item.name}
                    </span>

                    <button
                      onClick={() => removeItem(index)}
                      className="text-sm hover:underline self-end"
                      style={{ color: "#ffddba" }}
                    >
                      Remove
                    </button>
                  </div>
                )
              )
            )}
          </section>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={pickRandom}
            className="px-6 py-3 text-lg rounded w-full sm:w-auto hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: "#d9ae8e",
              color: "#232220",
              fontWeight: "600",
            }}
            disabled={items.length === 0}
          >
            Pick Random Item
          </button>

          <Link href="/history">
            <button
              className="px-6 py-3 text-lg rounded w-full sm:w-auto hover:opacity-90"
              style={{
                backgroundColor: "#4e4c4f",
                color: "#ffddba",
                fontWeight: "600",
              }}
            >
              🕘 View History
            </button>
          </Link>

          {items.length > 0 && (
            <button
              onClick={clearAllItems}
              className="px-6 py-3 text-lg rounded w-full sm:w-auto hover:opacity-90"
              style={{
                backgroundColor: "#4e4c4f",
                color: "#ffddba",
                fontWeight: "600",
              }}
            >
              ❌ Clear All Items
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        {isPicking && (
          <div
            className="text-3xl font-mono animate-pulse px-6 py-4 rounded border"
            style={{
              backgroundColor: "#4e4c4f",
              color: "#ffddba",
              borderColor: "#d9ae8e",
            }}
          >
            {items[carouselIndex ?? 0]?.name}
          </div>
        )}

        {!isPicking && selected && (
          <div className="mt-6 text-center flex flex-col items-center">
            <p className="text-lg text-[#ffddba]">🎉 Selected:</p>
            <p
              className="text-2xl font-bold mt-1 px-4 py-2 rounded"
              style={{
                backgroundColor: "#d9ae8e",
                color: "#232220",
              }}
            >
              {selected}
            </p>

            {/* 🔄 Try Again */}
            <button
              onClick={pickRandom}
              className="mt-4 px-4 py-2 rounded hover:opacity-90"
              style={{
                backgroundColor: "#d9ae8e",
                color: "#232220",
                fontWeight: "600",
              }}
            >
              🔄 Try Again
            </button>

            {/* ❌ Reset */}
            <button
              onClick={() => {
                setSelected(null);
                setCarouselIndex(null);
                setIsPicking(false);
              }}
              className="mt-2 px-4 py-2 rounded hover:opacity-90"
              style={{
                backgroundColor: "#4e4c4f",
                color: "#ffddba",
                fontWeight: "600",
              }}
            >
              ❌ Reset
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
