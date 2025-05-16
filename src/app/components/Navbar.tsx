"use client";

import { useState } from "react";
import Link from "next/link";
import { Dice5, Menu, X } from "lucide-react";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
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

        <div className="sm:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="text-[#ffddba]" size={28} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/history"
            className="text-[#ffddba] hover:text-[#d9ae8e] font-medium"
          >
            History
          </Link>
          <Link
            href="/lists"
            className="text-[#ffddba] hover:text-[#d9ae8e] font-medium"
          >
            Lists
          </Link>
        </div>
      </nav>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-[#4e4c4f] text-[#ffddba] z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#ffddba]">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} className="text-[#ffddba]" />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-4 pt-16">
          <Link
            href="/history"
            className="hover:text-[#d9ae8e]"
            onClick={() => setSidebarOpen(false)}
          >
            🕘 History
          </Link>
          <Link
            href="/lists"
            className="hover:text-[#d9ae8e]"
            onClick={() => setSidebarOpen(false)}
          >
            📁 Lists
          </Link>
        </div>
      </aside>
    </>
  );
}
