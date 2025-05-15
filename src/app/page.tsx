"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./autocomplete/games";
import SelectedItemModal from "./components/SelectedItemModal";
import { Item } from "./types/Item";
import { fetchCombinedItems } from "./autocomplete/games";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return setError("Please enter an item name.");

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

  const addToHistory = (item: Item) => {
    const current = localStorage.getItem("randomPickerHistory");
    const parsed: Item[] = current ? JSON.parse(current) : [];
    const updated = [item, ...parsed];
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
    const spins = 25 + Math.floor(Math.random() * 10);
    const delays = Array.from({ length: spins }, (_, i) => 50 + i * 10);

    const spin = () => {
      if (currentIndex < delays.length) {
        setCarouselIndex(currentIndex % items.length);
        setTimeout(spin, delays[currentIndex]);
        currentIndex++;
      } else {
        const picked = items[currentIndex % items.length];
        setSelected(picked);
        addToHistory(picked);
        setIsPicking(false);
      }
    };

    spin();
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
        <h1 className="text-4xl font-bold mb-8 text-center text-[#ffddba]">
          🎲 Random Item Picker
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-2xl mx-auto">
          <SearchInput
            input={input}
            setInput={setInput}
            onSelect={(item: Item) => setItems((prev) => [...prev, item])}
            onAddCustom={addItem}
            fetchItems={fetchCombinedItems}
            placeholder="Search for a game or movie..."
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-6 text-center">{error}</p>
        )}

        {items.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mb-10">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-4 rounded shadow bg-[#4e4c4f] text-[#ffddba]"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="rounded mb-3 w-full object-cover"
                  />
                ) : (
                  <div className="h-[160px] mb-3 flex items-center justify-center rounded bg-[#9f8d8d] text-[#232220] text-sm">
                    No image
                  </div>
                )}

                <span className="text-lg font-semibold mb-1 text-center">
                  {item.name}
                </span>

                {item.releaseDate && (
                  <p className="text-sm text-center mb-2">
                    📅 {item.releaseDate}
                  </p>
                )}

                <button
                  onClick={() => removeItem(index)}
                  className="text-sm hover:underline self-end"
                  style={{ color: "#ffddba" }}
                >
                  Remove
                </button>
              </div>
            ))}
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

      {(isPicking || selected) && (
        <SelectedItemModal
          isPicking={isPicking}
          selected={selected}
          items={items}
          carouselIndex={carouselIndex ?? 0}
          onTryAgain={pickRandom}
          onReset={() => {
            setSelected(null);
            setCarouselIndex(null);
            setIsPicking(false);
          }}
        />
      )}
    </main>
  );
}
