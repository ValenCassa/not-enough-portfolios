"use client";

import { ExplorationItemImage } from "./exploration-item-image";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useState, useCallback } from "react";

interface ExplorationItemProps {
  title: string;
  description: string;
  images: string[];
}
export const ExplorationItem = ({
  title,
  description,
  images,
}: ExplorationItemProps) => {
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollState = useCallback((element: HTMLDivElement) => {
    const { scrollLeft, scrollWidth, clientWidth } = element;
    setScrollState({
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft < scrollWidth - clientWidth,
    });
  }, []);

  const viewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const handleScroll = () => updateScrollState(node);

        // Initial check
        updateScrollState(node);

        // Add scroll listener
        node.addEventListener("scroll", handleScroll);

        // Cleanup function
        return () => node.removeEventListener("scroll", handleScroll);
      }
    },
    [updateScrollState]
  );
  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-stone-800">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </div>

      <div className="relative">
        <ScrollArea.Root
          className="w-full overflow-hidden h-[140px]"
          scrollHideDelay={100}
        >
          <ScrollArea.Viewport ref={viewportRef} className="w-full h-[128px]">
            <div className="flex gap-3">
              {images.map((img) => {
                return <ExplorationItemImage key={img} src={img} alt={title} />;
              })}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100 transition-opacity duration-200 ease-out touch-none p-0.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="horizontal"
            forceMount
          >
            <ScrollArea.Thumb className="flex-1 bg-stone-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* Left fade */}
        <div
          className={`absolute left-0 top-0 w-8 h-[128px] bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity duration-200 ${
            scrollState.canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right fade */}
        <div
          className={`absolute right-0 top-0 w-8 h-[128px] bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity duration-200 ${
            scrollState.canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
};
