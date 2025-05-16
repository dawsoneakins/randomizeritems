"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SearchInput } from "./autocomplete/items";
import SelectedItemScreen from "./components/SelectedItemScreen";
import { Item } from "./types/Item";
import { fetchCombinedItems } from "./autocomplete/items";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);

  const spinRepetitions = 5;
  const spinningItems = Array(spinRepetitions).fill(items).flat();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setDragStartScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = dragStartScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

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

    const totalSpins = 30;
    const spinInterval = 80;

    let currentIndex = 0;

    const spin = () => {
      if (currentIndex < totalSpins) {
        setCarouselIndex(currentIndex);
        currentIndex++;
        setTimeout(spin, spinInterval);
      } else {
        const picked = items[Math.floor(Math.random() * items.length)];
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
            placeholder="Search for a game, movie, or TV show..."
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-6 text-center">{error}</p>
        )}

        {items.length > 0 && (
          <div className="relative w-full mb-10">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#4e4c4f] text-[#ffddba] rounded-full shadow hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>

            <section
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 px-10 no-scrollbar cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className="min-w-[250px] flex-shrink-0 p-4 rounded shadow bg-[#4e4c4f] text-[#ffddba]"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={250}
                      height={250}
                      className="rounded mb-3 w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-[160px] mb-3 flex items-center justify-center rounded bg-[#9f8d8d] text-[#232220] text-sm">
                      No image
                    </div>
                  )}
                  <span className="text-lg font-semibold mb-1 text-center block">
                    {item.name}
                  </span>
                  {item.releaseDate && (
                    <p className="text-sm text-center mb-2">
                      📅 {item.releaseDate}
                    </p>
                  )}
                  <button
                    onClick={() => removeItem(index)}
                    className="text-sm hover:underline block text-right"
                    style={{ color: "#ffddba" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#4e4c4f] text-[#ffddba] rounded-full shadow hover:scale-105 active:scale-95"
            >
              <ChevronRight size={24} />
            </button>
          </div>
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
        <SelectedItemScreen
          isPicking={isPicking}
          selected={selected}
          items={spinningItems}
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
