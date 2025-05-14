// components/SelectedItemModal.tsx
"use client";

import { Item } from "../types/Item";

type Props = {
  isPicking: boolean;
  selected: Item | null;
  items: Item[];
  carouselIndex: number;
  onTryAgain: () => void;
  onReset: () => void;
};

export default function SelectedItemModal({
  isPicking,
  selected,
  items,
  carouselIndex,
  onTryAgain,
  onReset,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-[#4e4c4f] text-[#ffddba] p-6 rounded-lg shadow-lg w-[320px] min-h-[380px] text-center">
        <h2 className="text-xl font-bold mb-4">
          {isPicking ? "🎰 Spinning..." : "🎉 Selected Item"}
        </h2>

        <div className="overflow-hidden h-[150px] relative mb-6">
          <div
            className={`${
              !isPicking ? "transition-transform duration-300 ease-out" : ""
            }`}
            style={{
              transform: `translateY(-${carouselIndex * 150}px)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex flex-col items-center justify-center h-[150px]"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[120px] object-contain mb-2 rounded"
                  />
                )}
                <p className="text-base font-medium text-[#ffddba]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {!isPicking && selected && (
          <div className="flex flex-col gap-2">
            {selected.releaseDate && (
              <p className="text-sm text-[#ffddba]">
                📅 Released: {selected.releaseDate}
              </p>
            )}

            <button
              onClick={onTryAgain}
              className="px-4 py-2 rounded hover:opacity-90"
              style={{
                backgroundColor: "#d9ae8e",
                color: "#232220",
                fontWeight: "600",
              }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 rounded hover:opacity-90"
              style={{
                backgroundColor: "#4e4c4f",
                color: "#ffddba",
                fontWeight: "600",
                border: "1px solid #ffddba",
              }}
            >
              ❌ Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
