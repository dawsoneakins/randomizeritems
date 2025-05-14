"use client";

import { Item } from "../types/Item";

type SelectedItemModalProps = {
  isPicking: boolean;
  selected: Item | null;
  spinningName: string;
  onTryAgain: () => void;
  onReset: () => void;
};

export default function SelectedItemModal({
  isPicking,
  selected,
  spinningName,
  onTryAgain,
  onReset,
}: SelectedItemModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-[#4e4c4f] text-[#ffddba] p-8 rounded-lg shadow-lg w-[320px] min-h-[220px] text-center">
        {isPicking ? (
          <>
            <h2 className="text-xl font-bold mb-4">Picking an item...</h2>
            <div className="text-2xl font-mono animate-pulse h-12 flex items-center justify-center">
              {spinningName}
            </div>
          </>
        ) : selected ? (
          <>
            <h2 className="text-xl font-bold mb-4">🎉 Selected Item</h2>

            {selected.image && (
              <img
                src={selected.image}
                alt={selected.name}
                className="rounded mb-3"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  margin: "0 auto",
                }}
              />
            )}

            <p
              className="text-2xl font-bold mb-2 px-4 py-2 rounded"
              style={{
                backgroundColor: "#d9ae8e",
                color: "#232220",
              }}
            >
              {selected.name}
            </p>

            {selected.releaseDate && (
              <p className="text-sm text-[#ffddba] mb-4">
                📅 Released: {selected.releaseDate}
              </p>
            )}

            <div className="flex flex-col gap-2 mt-2">
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
          </>
        ) : null}
      </div>
    </div>
  );
}
