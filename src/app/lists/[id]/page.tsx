// app/lists/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
    <div className="p-6 text-[#ffddba]">
      <h1 className="text-3xl font-bold mb-4">📄 {list.name}</h1>
      {list.items.length === 0 ? (
        <p>No items in this list yet.</p>
      ) : (
        <ul className="space-y-2">
          {list.items.map((item, idx) => (
            <li key={idx} className="bg-[#4e4c4f] p-3 rounded">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
