"use client";

import HistoryList from "../components/HistoryList";

export default function History() {
  return (
    <main className="min-h-screen  text-[#ffddba] px-4">
      <div className="max-w-4xl mx-auto pt-28 pb-24">
        <h1 className="text-4xl font-bold mb-8 text-center">🕘 Pick History</h1>
        <HistoryList />
      </div>
    </main>
  );
}
