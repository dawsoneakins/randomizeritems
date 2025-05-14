"use client";

import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const isDuplicate = items.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      const confirmAdd = window.confirm(
        "This item already exists. Are you sure you want to add it again?"
      );
      if (!confirmAdd) {
        setInput("");
        return;
      }
    }

    setItems([...items, trimmed]);
    setInput("");
    setError(null);
    setSelected(null);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const pickRandom = () => {
    if (items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      setSelected(items[randomIndex]);
    }
  };

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

      {/* Selected result */}
      {selected && (
        <div
          className="text-xl font-semibold text-center"
          style={{ color: "#ffddba" }}
        >
          🎉 Selected: <span className="underline">{selected}</span>
        </div>
      )}
    </main>
  );
}
