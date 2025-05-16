// components/SelectedItemScreen.tsx
"use client";

import { useEffect, useRef } from "react";
import { Item } from "../types/Item";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/autoplay";

type Props = {
  isPicking: boolean;
  selected: Item | null;
  items: Item[];
  carouselIndex: number;
  onTryAgain: () => void;
  onReset: () => void;
};

// eslint-disable-next-line react-hooks/rules-of-hooks
SwiperCore.use([Autoplay]);

export default function SelectedItemScreen({
  isPicking,
  selected,
  items,
  onTryAgain,
  onReset,
}: Props) {
  const swiperRef = useRef<SwiperCore | null>(null);

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
        <div className="flex flex-col gap-4 mt-10 items-center">
          <button
            onClick={onTryAgain}
            className="px-6 py-3 rounded text-lg hover:opacity-90"
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
            className="px-6 py-3 rounded text-lg hover:opacity-90 border"
            style={{
              backgroundColor: "#4e4c4f",
              color: "#ffddba",
              fontWeight: "600",
              borderColor: "#ffddba",
            }}
          >
            ❌ Reset
          </button>
        </div>
      )}
    </div>
  );
}
