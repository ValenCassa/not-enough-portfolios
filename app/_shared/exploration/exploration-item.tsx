"use client";

import { ExplorationItemImage } from "./exploration-item-image";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useRef } from "react";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-stone-800">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </div>

      <div className="relative">
        <ScrollArea.Root
          className="w-full isolate overflow-hidden h-[140px] relative before:opacity-0 before:z-10 data-[left-fade]:before:opacity-100 before:absolute before:left-0 before:top-0 before:w-8 before:h-[128px] before:bg-gradient-to-r before:from-white before:to-transparent before:pointer-events-none before:transition-opacity before:duration-200 after:opacity-0 after:z-10 data-[right-fade]:after:opacity-100 after:absolute after:right-0 after:top-0 after:w-8 after:h-[128px] after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none after:transition-opacity after:duration-200"
          scrollHideDelay={100}
          ref={scrollAreaRef}
        >
          <ScrollArea.Viewport
            id="exploration-item-viewport"
            className="w-full relative h-[128px]"
            onScroll={(e) => {
              const element = e.currentTarget as HTMLDivElement;

              if (element.scrollLeft > 0) {
                scrollAreaRef.current!.setAttribute("data-left-fade", "true");
              } else {
                scrollAreaRef.current!.removeAttribute("data-left-fade");
              }

              if (
                element.scrollLeft <
                element.scrollWidth - element.clientWidth
              ) {
                scrollAreaRef.current!.setAttribute("data-right-fade", "true");
              } else {
                scrollAreaRef.current!.removeAttribute("data-right-fade");
              }
            }}
          >
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
      </div>
    </div>
  );
};
