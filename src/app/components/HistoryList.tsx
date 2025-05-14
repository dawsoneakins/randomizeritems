"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Item } from "../types/Item";

export default function HistoryList() {
  const [history, setHistory] = useState<Item[]>([]);

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#ffddba]">
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

      <ul className="space-y-4">
        {history.map((item, index) => (
          <li
            key={index}
            className="flex gap-4 items-center p-3 rounded shadow bg-[#4e4c4f] text-[#ffddba]"
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={60}
                height={80}
                className="rounded object-cover"
              />
            ) : (
              <div className="w-[60px] h-[80px] flex items-center justify-center bg-[#9f8d8d] text-[#232220] text-sm rounded">
                No image
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-lg font-medium">{item.name}</span>
              {item.releaseDate && (
                <span className="text-sm">📅 {item.releaseDate}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
