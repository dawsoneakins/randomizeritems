"use client";

import Link from "next/link";
import { Dice5 } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      className="w-full px-6 py-4 flex items-center justify-between fixed top-0 left-0 z-50"
      style={{ backgroundColor: "#4e4c4f" }}
    >
      <Link href="/" className="flex items-center gap-2">
        <Dice5 className="text-[#ffddba]" size={24} />
        <span className="text-[#ffddba] font-bold text-lg">
          Random Item Picker
        </span>
      </Link>

      <div className="flex gap-6">
        <Link
          href="/lists"
          className="text-[#ffddba] hover:text-[#d9ae8e] font-medium"
        >
          Lists
        </Link>
        <Link
          href="/history"
          className="text-[#ffddba] hover:text-[#d9ae8e] font-medium"
        >
          History
        </Link>
      </div>
    </nav>
  );
}
