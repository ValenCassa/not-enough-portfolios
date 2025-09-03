"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const images = [
  "https://i2.seadn.io/base/0xfe9117d6d0b973faae61d9a85a741ce41bd4bc80/e01891c370cd76c8a210c8c5fabac9/c1e01891c370cd76c8a210c8c5fabac9.png?w=350",
  "https://i2.seadn.io/base/0xfe9117d6d0b973faae61d9a85a741ce41bd4bc80/1a34c5a489b4f41c59230b56971920/d21a34c5a489b4f41c59230b56971920.png?w=350",
  "https://i2.seadn.io/base/0xfe9117d6d0b973faae61d9a85a741ce41bd4bc80/5b4fdf3880fbebea18d16310317205/b85b4fdf3880fbebea18d16310317205.png?w=350",
  "https://i2.seadn.io/base/0xfe9117d6d0b973faae61d9a85a741ce41bd4bc80/c3c02670fdf108c4b4b3505da2c83f/53c3c02670fdf108c4b4b3505da2c83f.png?w=350",
  "https://i2.seadn.io/base/0xfe9117d6d0b973faae61d9a85a741ce41bd4bc80/56921beefe018560601dacfce27172/2356921beefe018560601dacfce27172.png?w=350",
];

const MotionImage = motion("img");

const AnimatedImage = ({
  className,
  src,
  ...props
}: React.ComponentProps<typeof MotionImage>) => {
  return (
    <MotionImage
      layoutId={src as string}
      src={src}
      className={`size-16 border border-black/20 shadow-xs ${className}`}
      alt="Pudgy Penguin"
      animate={{
        borderRadius: "12px",
      }}
      {...props}
    />
  );
};

const TRANSLATE_Y = 16;
const ROTATE_X = 32;
const ROTATE_Y = 20;

const TRANSLATE_Y_HIGH_TILT = 40;
const ROTATE_HIGH_TILT = 10;

const ROTATE_Y_HOVER = 34;

const ClosedState = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <div className="space-y-4 grid">
      <motion.button
        className="relative group inline-grid place-content-center"
        whileHover="hover"
        initial="rest"
        animate="rest"
        whileTap={{
          scale: 0.96,
        }}
        onClick={() => onOpenChange(true)}
      >
        <AnimatedImage
          src={images[0]}
          className="z-10 relative"
          key={images[0]}
          variants={{
            rest: { x: 0, y: 0, rotate: 0 },
            hover: {
              x: 0,
              y: -5,
              rotate: 0,
            },
          }}
        />

        <AnimatedImage
          src={images[1]}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          variants={{
            rest: { x: 0, y: 0, rotate: -ROTATE_HIGH_TILT },
            hover: {
              x: 0,
              y: -TRANSLATE_Y_HIGH_TILT,
              rotate: 0,
            },
          }}
        />

        <AnimatedImage
          src={images[2]}
          className="absolute z-[2] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          variants={{
            rest: { x: 0, y: 0, rotate: -ROTATE_Y },
            hover: {
              x: -ROTATE_X,
              y: -TRANSLATE_Y,
              rotate: -ROTATE_Y_HOVER,
            },
          }}
        />

        <AnimatedImage
          src={images[3]}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          variants={{
            rest: { x: 0, y: 0, rotate: ROTATE_HIGH_TILT },
            hover: {
              x: 0,
              y: -TRANSLATE_Y_HIGH_TILT,
              rotate: 0,
            },
          }}
        />

        <AnimatedImage
          src={images[4]}
          className="absolute z-[2] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          variants={{
            rest: { x: 0, y: 0, rotate: ROTATE_Y },
            hover: {
              x: ROTATE_X,
              y: -TRANSLATE_Y,
              rotate: ROTATE_Y_HOVER,
            },
          }}
        />
      </motion.button>
      <div className="relative">
        <motion.div
          layoutId="contract-name"
          className="flex items-center gap-1"
        >
          <p className="text-sm font-medium">Certified Viral</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="text-blue-500 size-4"
          >
            <g fill="currentColor">
              <path
                d="m17.999,10c0-1.097-.567-2.113-1.465-2.707.215-1.054-.103-2.174-.878-2.95-.775-.776-1.896-1.094-2.95-.878-.593-.897-1.609-1.464-2.706-1.464s-2.113.567-2.706,1.464c-1.053-.216-2.174.102-2.95.878s-1.093,1.896-.878,2.949c-.897.593-1.465,1.61-1.465,2.707s.567,2.113,1.465,2.707c-.215,1.054.103,2.174.878,2.95s1.898,1.092,2.95.878c.593.897,1.609,1.464,2.706,1.464s2.113-.568,2.706-1.465c1.059.214,2.176-.103,2.95-.878.776-.776,1.094-1.896.878-2.95.897-.593,1.465-1.609,1.465-2.707Zm-4.218-1.875l-4,5c-.178.222-.442.358-.726.374-.019,0-.037.001-.056.001-.265,0-.52-.105-.707-.293l-2-2c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l1.21,1.21,3.302-4.127c.347-.43.975-.502,1.406-.156.431.345.501.974.156,1.405Z"
                strokeWidth="0"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </motion.div>
        <motion.p
          layout="position"
          layoutId="contract-items"
          className="text-xs text-neutral-500 text-left absolute left-1/2 -translate-x-1/2"
        >
          8 items
        </motion.p>
      </div>
    </div>
  );
};

const OpenState = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MotionImage
          src={images[0]}
          layoutId={images[0]}
          className="size-10"
          animate={{
            borderRadius: "100%",
          }}
        />
        <div>
          <motion.div
            layoutId="contract-name"
            className="flex items-center gap-1"
          >
            <p className="text-sm font-medium">Certified Viral</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="text-blue-500 size-4"
            >
              <g fill="currentColor">
                <path
                  d="m17.999,10c0-1.097-.567-2.113-1.465-2.707.215-1.054-.103-2.174-.878-2.95-.775-.776-1.896-1.094-2.95-.878-.593-.897-1.609-1.464-2.706-1.464s-2.113.567-2.706,1.464c-1.053-.216-2.174.102-2.95.878s-1.093,1.896-.878,2.949c-.897.593-1.465,1.61-1.465,2.707s.567,2.113,1.465,2.707c-.215,1.054.103,2.174.878,2.95s1.898,1.092,2.95.878c.593.897,1.609,1.464,2.706,1.464s2.113-.568,2.706-1.465c1.059.214,2.176-.103,2.95-.878.776-.776,1.094-1.896.878-2.95.897-.593,1.465-1.609,1.465-2.707Zm-4.218-1.875l-4,5c-.178.222-.442.358-.726.374-.019,0-.037.001-.056.001-.265,0-.52-.105-.707-.293l-2-2c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l1.21,1.21,3.302-4.127c.347-.43.975-.502,1.406-.156.431.345.501.974.156,1.405Z"
                  strokeWidth="0"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </motion.div>
          <motion.p
            layoutId="contract-items"
            className="text-xs text-neutral-500 text-left"
          >
            8 items
          </motion.p>
        </div>
      </div>
      <div className="flex gap-2">
        {images.map((image, idx) => {
          if (!idx) return null;
          return <AnimatedImage key={image} src={image} layoutId={image} />;
        })}
      </div>
      <motion.button
        key={"button"}
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.7,
        }}
        whileTap={{
          scale: 0.96,
        }}
        onClick={() => onOpenChange(false)}
        className="w-full hover:bg-neutral-200 transition-colors text-center text-sm font-medium bg-neutral-100 rounded-lg text-neutral-800 h-[28px]"
      >
        Close
      </motion.button>
    </div>
  );
};

export function NftContractPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid place-content-center">
      <AnimatePresence mode="popLayout">
        {open ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, filter: "blur(6px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)", scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <OpenState onOpenChange={setOpen} />
          </motion.div>
        ) : (
          <motion.div
            key="closed"
            initial={{ opacity: 0, filter: "blur(6px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)", scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ClosedState onOpenChange={setOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
