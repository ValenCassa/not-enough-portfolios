"use client";

import { motion, AnimatePresence } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import type { ComponentProps } from "react";

const MotionImage = motion.create("img");

export const ExplorationItemImage = ({
  src,
  alt,
  ...props
}: ComponentProps<typeof MotionImage>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.div
          layoutId={`image-${src}`}
          className="cursor-zoom-in shrink-0 relative w-[180px] h-[128px] object-cover border border-black/[0.04] shadow-[inset_0px_-1px_0px_rgba(0,_0,_0,_0.07)] rounded-md overflow-hidden"
        >
          <MotionImage
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            {...props}
          />
        </motion.div>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 w-dvw h-dvh bg-black/40 z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                layoutId={`image-${src}`}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-md:w-[90%] z-50 outline-none overflow-hidden rounded-sm"
              >
                <Dialog.Title />
                <Dialog.Description />
                <MotionImage
                  src={src}
                  alt={alt}
                  className="w-full object-cover"
                  {...props}
                />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
