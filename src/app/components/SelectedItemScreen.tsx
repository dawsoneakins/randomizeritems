"use client";

import { useEffect, useRef, useState } from "react";
import { Item, List } from "../types/Item";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/autoplay";

// eslint-disable-next-line react-hooks/rules-of-hooks
SwiperCore.use([Autoplay]);

type Props = {
  isPicking: boolean;
  selected: Item | null;
  items: Item[];
  carouselIndex: number;
  onTryAgain: () => void;
  onReset: () => void;
};

export default function SelectedItemScreen({
  isPicking,
  selected,
  items,
  onTryAgain,
  onReset,
}: Props) {
  const swiperRef = useRef<SwiperCore | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState("");

  useEffect(() => {
    const swiper = swiperRef.current;

    if (!isPicking && selected && swiper) {
      const index = items.findIndex((i) => i.name === selected.name);
      if (index !== -1) {
        setTimeout(() => {
          swiper.slideToLoop(index, 600);
        }, 150);
      }
    }
  }, [isPicking, selected, items]);

  useEffect(() => {
    const saved = localStorage.getItem("pickerLists");
    if (saved) {
      try {
        const parsed: List[] = JSON.parse(saved);
        setLists(parsed);
      } catch (e) {
        console.error("Failed to parse lists from localStorage:", e);
      }
    }
  }, [selected]);

  const handleSaveToList = () => {
    if (!selected || !selectedListId) return;

    const saved = localStorage.getItem("pickerLists");
    if (!saved) return;

    try {
      const parsed: List[] = JSON.parse(saved);
      const updated = parsed.map((list) => {
        if (list.id === selectedListId) {
          const alreadyExists = list.items.some(
            (item) => item.name === selected.name
          );
          if (!alreadyExists) {
            return { ...list, items: [...list.items, selected] };
          }
        }
        return list;
      });

      localStorage.setItem("pickerLists", JSON.stringify(updated));
      alert(
        `✅ "${selected.name}" added to "${
          lists.find((l) => l.id === selectedListId)?.name
        }"`
      );
    } catch (e) {
      console.error("Error saving to list:", e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[100] px-4">
      <h2 className="text-3xl font-bold mb-8 text-[#ffddba] text-center">
        {isPicking ? "🎰 Spinning..." : "🎉 Selected Item"}
      </h2>

      <div className="w-[260px]">
        <Swiper
          loop={true}
          centeredSlides
          spaceBetween={30}
          slidesPerView={1}
          allowTouchMove={!isPicking}
          autoplay={
            isPicking ? { delay: 100, disableOnInteraction: true } : false
          }
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={`${item.name}-${idx}`}>
              <div className="w-[260px] h-[400px] bg-[#4e4c4f] rounded-xl flex flex-col items-center justify-center text-[#ffddba] shadow-lg">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={180}
                    height={260}
                    className="rounded mb-3 object-cover"
                  />
                )}
                <p className="text-lg font-semibold text-center px-2">
                  {item.name}
                </p>
                {item.releaseDate && (
                  <p className="text-sm mt-1">📅 {item.releaseDate}</p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {!isPicking && selected && (
        <div className="flex flex-col gap-4 mt-8 items-center w-full max-w-xs">
          <select
            value={selectedListId}
            onChange={(e) => setSelectedListId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#3c3a3d] text-[#ffddba]"
          >
            <option value="">📁 Choose a list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveToList}
            disabled={!selectedListId}
            className="w-full px-6 py-2 rounded text-sm bg-[#d9ae8e] text-[#232220] font-semibold hover:opacity-90 disabled:opacity-50"
          >
            ➕ Add to List
          </button>

          <button
            onClick={onTryAgain}
            className="w-full px-6 py-2 rounded text-sm bg-[#d9ae8e] text-[#232220] font-semibold hover:opacity-90"
          >
            🔄 Try Again
          </button>
          <button
            onClick={onReset}
            className="w-full px-6 py-2 rounded text-sm border text-[#ffddba] border-[#ffddba] hover:opacity-90"
          >
            ❌ Reset
          </button>
        </div>
      )}
    </div>
  );
}
