"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dice5, Menu, X, ChevronDown } from "lucide-react";

type List = {
  id: string;
  name: string;
};

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [hoveringButton, setHoveringButton] = useState(false);
  const [hoveringDropdown, setHoveringDropdown] = useState(false);

  const fetchLists = () => {
    const saved = localStorage.getItem("pickerLists");
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validLists = parsed.filter((list) => list.id && list.name);
          setLists(validLists);
        }
      }
    } catch (err) {
      console.error("Failed to parse pickerLists:", err);
    }
  };

  useEffect(() => {
    const shouldOpen = hoveringButton || hoveringDropdown;
    const timeout = setTimeout(() => {
      setDropdownOpen(shouldOpen);
    }, 200);
    return () => clearTimeout(timeout);
  }, [hoveringButton, hoveringDropdown]);

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

        <div className="hidden sm:flex items-center gap-6 relative">
          <Link
            href="/history"
            className="text-[#ffddba] hover:text-[#d9ae8e] font-medium"
          >
            History
          </Link>

          <div
            className="relative"
            onMouseEnter={() => {
              setHoveringButton(true);
              fetchLists();
            }}
            onMouseLeave={() => setHoveringButton(false)}
          >
            <Link
              href="/lists"
              className="text-[#ffddba] hover:text-[#d9ae8e] font-medium flex items-center gap-1 px-2 py-1 transition"
              onClick={() => {
                setDropdownOpen(false);
                setHoveringButton(false);
                setHoveringDropdown(false);
              }}
            >
              Lists <ChevronDown size={16} />
            </Link>

            {dropdownOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#4e4c4f] text-[#ffddba] border border-[#9f8d8d] rounded-md shadow-lg z-50 min-w-[160px]"
                onMouseEnter={() => {
                  setHoveringDropdown(true);
                  fetchLists();
                }}
                onMouseLeave={() => setHoveringDropdown(false)}
              >
                {lists.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[#9f8d8d]">
                    No lists available
                  </div>
                ) : (
                  <ul className="py-2">
                    {lists.map((list) => (
                      <li key={list.id}>
                        <Link
                          href={`/lists/${list.id}`}
                          className="block px-4 py-2 text-sm text-[#ffddba] hover:bg-[#d9ae8e] hover:text-[#232220] transition"
                          onClick={() => {
                            setDropdownOpen(false);
                            setHoveringButton(false);
                            setHoveringDropdown(false);
                          }}
                        >
                          {list.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-[#4e4c4f] text-[#ffddba] z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#9f8d8d]">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} className="text-[#ffddba]" />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-4 pt-8">
          <Link
            href="/history"
            className="hover:text-[#d9ae8e]"
            onClick={() => setSidebarOpen(false)}
          >
            🕘 History
          </Link>

          <div>
            <button
              className="flex items-center gap-2 hover:text-[#d9ae8e]"
              onClick={() => {
                fetchLists();
                setMobileDropdownOpen(!mobileDropdownOpen);
              }}
            >
              📁 Lists <ChevronDown size={16} />
            </button>
            {mobileDropdownOpen && (
              <ul className="mt-2 ml-4 flex flex-col gap-2">
                {lists.length === 0 ? (
                  <li className="text-sm text-[#9f8d8d]">No lists</li>
                ) : (
                  lists.map((list) => (
                    <li key={list.id}>
                      <Link
                        href={`/lists/${list.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className="block text-sm text-[#ffddba] hover:text-[#d9ae8e]"
                      >
                        {list.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
