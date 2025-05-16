"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Item } from "../types/Item";

type List = {
  id: string;
  name: string;
  items: Item[];
};

export default function ListManagerPage() {
  const [lists, setLists] = useState<List[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("pickerLists");
    if (saved) setLists(JSON.parse(saved));
  }, []);

  const createList = () => {
    const name = prompt("Enter new list name:");
    if (!name) return;
    const newList: List = { id: crypto.randomUUID(), name, items: [] };
    const updated = [...lists, newList];
    setLists(updated);
    localStorage.setItem("pickerLists", JSON.stringify(updated));
  };

  const deleteList = (id: string) => {
    if (!confirm("Delete this list?")) return;
    const updated = lists.filter((l) => l.id !== id);
    setLists(updated);
    localStorage.setItem("pickerLists", JSON.stringify(updated));
  };

  return (
    <div className="pt-24 pb-6 px-6 text-[#ffddba]">
      <h1 className="text-3xl font-bold mb-6">Your Lists</h1>
      <button
        onClick={createList}
        className="mb-4 px-4 py-2 bg-[#d9ae8e] text-[#232220] rounded"
      >
        ➕ Create New List
      </button>

      <ul className="space-y-4">
        {lists.map((list) => (
          <li
            key={list.id}
            className="p-4 bg-[#4e4c4f] rounded flex justify-between items-center"
          >
            <span
              className="cursor-pointer font-medium"
              onClick={() => router.push(`/lists/${list.id}`)}
            >
              📄 {list.name}
            </span>
            <button
              onClick={() => deleteList(list.id)}
              className="text-red-400 hover:text-red-300"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
