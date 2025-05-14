"use client";

import { useEffect, useState } from "react";
import HistoryList from "./components/HistoryList";

export default function Home() {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const addItem = () => {
    const trimmed = input.trim();

    // Validation: empty input
    if (!trimmed) {
      setError("Please enter an item name.");
      return;
    }

    const isDuplicate = items.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
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

    setItems([...items, trimmed]);
    setInput("");
    setError(null);
    setSelected(null);
  };

  const addToHistory = (item: string) => {
    setHistory((prev) => {
      const updated = [item, ...prev];
      localStorage.setItem("randomPickerHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const pickRandom = () => {
    if (items.length === 0) return;
    setIsPicking(true);
    setCarouselIndex(0);

    let currentIndex = 0;
    const totalSpins = 15 + Math.floor(Math.random() * 10);
    const interval = 100;

    const spinner = setInterval(() => {
      currentIndex++;
      setCarouselIndex(currentIndex % items.length);

      if (currentIndex >= totalSpins) {
        clearInterval(spinner);
        const picked = items[currentIndex % items.length];

        setSelected(picked);
        addToHistory(picked);
      }
    }, interval);
  };

  useEffect(() => {
    const stored = localStorage.getItem("randomPickerHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  return (
    <main
      className="min-h-screen p-6 flex flex-col items-center"
      style={{ backgroundColor: "#232220" }}
    >
      <h1
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "#ffddba" }}
      >
        🎲 Random Item Picker
      </h1>

      <div className="flex gap-2 mb-6 w-full max-w-2xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-5 py-3 text-lg rounded w-full border-none focus:outline-none"
          style={{
            backgroundColor: "#9f8d8d",
            color: "#232220",
            fontWeight: "500",
          }}
          placeholder="Enter item name"
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

      {error && (
        <p className="text-sm text-red-400 -mt-4 mb-6 text-left w-full max-w-2xl">
          {error}
        </p>
      )}

      <section className="flex flex-wrap gap-4 justify-center w-full max-w-6xl py-4 px-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-4 rounded shadow w-[200px]"
            style={{
              backgroundColor: "#4e4c4f",
              color: "#ffddba",
            }}
          >
            <span className="text-lg mb-2">{item}</span>
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

      <button
        onClick={pickRandom}
        className="px-6 py-2 rounded hover:opacity-90 disabled:opacity-50 mb-4"
        style={{
          backgroundColor: "#d9ae8e",
          color: "#232220",
          fontWeight: "600",
        }}
        disabled={items.length === 0}
      >
        Pick Random Item
      </button>
      <HistoryList history={history} onClear={() => setHistory([])} />

      {isPicking && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-[#4e4c4f] text-[#ffddba] p-8 rounded-lg shadow-lg text-center w-[300px] min-h-[180px]">
            <h2 className="text-xl font-bold mb-4">Picking an item...</h2>
            <div className="text-2xl font-mono animate-pulse h-12 flex items-center justify-center">
              {items[carouselIndex ?? 0]}
            </div>
            {selected && (
              <div className="mt-6">
                <p className="text-lg">🎉 Selected:</p>
                <p className="text-2xl font-bold mt-1">{selected}</p>
                <button
                  onClick={() => {
                    setIsPicking(false);
                    setSelected(null);
                    setCarouselIndex(null);
                  }}
                  className="mt-4 px-4 py-2 rounded"
                  style={{
                    backgroundColor: "#d9ae8e",
                    color: "#232220",
                    fontWeight: "600",
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
