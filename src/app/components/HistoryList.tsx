"use client";

import { useEffect, useState } from "react";

export default function HistoryList() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("randomPickerHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("randomPickerHistory");
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <section className="mt-8 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold" style={{ color: "#ffddba" }}>
          🕘 Pick History
        </h2>
        <button
          onClick={clearHistory}
          className="text-sm underline hover:text-[#d9ae8e]"
          style={{ color: "#ffddba" }}
        >
          Clear History
        </button>
      </div>
      <ul className="space-y-2">
        {history.map((item, index) => (
          <li
            key={index}
            className="p-2 rounded shadow"
            style={{ backgroundColor: "#4e4c4f", color: "#ffddba" }}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
