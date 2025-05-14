"use client";

import { useEffect, useState } from "react";

import HistoryList from "../components/HistoryList";

export default function History() {
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

  return (
    <div className="pt-20 pb-24 px-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-[#ffddba]">
        🕘 Pick History
      </h1>
      <HistoryList />
    </div>
  );
}
