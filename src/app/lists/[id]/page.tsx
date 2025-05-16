"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Item } from "../../types/Item";

type List = {
  id: string;
  name: string;
  items: Item[];
};

export default function ListDetailPage() {
  const { id } = useParams();
  const [list, setList] = useState<List | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pickerLists");
    if (saved) {
      const parsed: List[] = JSON.parse(saved);
      const found = parsed.find((l) => l.id === id);
      if (found) setList(found);
    }
  }, [id]);

  if (!list) {
    return <p className="p-6 text-[#ffddba]">List not found.</p>;
  }

  return (
    <div className="pt-[120px] sm:pt-24 pb-24 px-4 text-[#ffddba] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📄 {list.name}</h1>

      {list.items.length === 0 ? (
        <p className="text-[#ccc]">No items in this list yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#222222] rounded-lg p-4 shadow-md flex flex-col items-center text-center"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="rounded mb-4 object-cover"
                />
              ) : (
                <div className="w-full h-[160px] mb-4 flex items-center justify-center rounded bg-[#444] text-sm text-[#999]">
                  No image
                </div>
              )}
              <h2 className="text-lg font-semibold">{item.name}</h2>
              {item.releaseDate && (
                <p className="text-sm text-[#1DCD9F] mt-1">
                  📅 {item.releaseDate}
                </p>
              )}
              {item.type && (
                <p className="text-xs text-[#999] mt-1 uppercase">
                  {item.type}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
