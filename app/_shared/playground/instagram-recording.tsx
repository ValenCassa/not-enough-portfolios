"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  AnimatePresence,
  motion,
  useVelocity,
  useMotionValueEvent,
  useMotionValue,
} from "motion/react";
import type { PropsWithChildren } from "react";
import useMeasure from "react-use-measure";

// Constants
const RECORDING_CONFIG = {
  DELAY_MS: 400, // Delay before recording starts
  WAVEFORM_INTERVAL_MS: 250, // How often to generate new waveform bars
  DURATION_INTERVAL_MS: 1000, // How often to update recording duration
  MIN_BAR_HEIGHT: 4, // Minimum waveform bar height in pixels
  MAX_BAR_HEIGHT: 24, // Maximum waveform bar height in pixels
} as const;

const SWIPE_CONFIG = {
  CANCEL_DISTANCE_PX: -60, // Minimum leftward distance to trigger cancel state
  CANCEL_VELOCITY_PX_S: -2000, // Minimum leftward velocity to trigger cancel state (desktop)
  CANCEL_VELOCITY_PX_S_MOBILE: -1000, // Minimum leftward velocity to trigger cancel state (mobile - half of desktop)
  RESET_DISTANCE_PX: -50, // Distance threshold to reset cancel state when swiping right
  AUTO_RESET_DELAY_MS: 500, // Time before cancel state automatically resets
} as const;

const PROXIMITY_CONFIG = {
  TRASH_THRESHOLD_PX: 64, // Distance threshold for trash icon proximity detection
} as const;

const ANIMATION_CONFIG = {
  RECORDING_SCALE_ORIGIN: 0.6, // Initial scale of recording bar
  RECORDING_WIDTH_ORIGIN: 40, // Initial width of recording bar in pixels
  RECORDING_WIDTH_EXPANDED: 369, // Expanded width of recording bar in pixels
  EXIT_DURATION_S: 0.15, // Duration of exit animation
  DELETE_DURATION_S: 1.5, // Duration of delete animation sequence
  CURSOR_SCALE_MIN: 1, // Minimum cursor scale (32px)
  CURSOR_SCALE_MAX: 1.25, // Maximum cursor scale (40px)
} as const;

// Types
type Position = { x: number; y: number };
type TrashIconRef = React.RefObject<HTMLElement | null>;

interface RecordingState {
  recordingDuration: number | null;
  bars: number[];
  mousePosition: Position;
  isNearTrash: boolean;
  isSwipeCancel: boolean;
  isTouchDevice: boolean;
  cursorScale: number;
}

interface RecordingContextType {
  recordingDuration: number | null;
  bars: number[];
  mousePosition: Position;
  isRecording: boolean;
  isNearTrash: boolean;
  isSwipeCancel: boolean;
  isCancel: boolean;
  cursorScale: number;
  trashIconRef: TrashIconRef | null;
  containerRef(element: HTMLOrSVGElement | null): void;
  containerWidth: number;
  startRecording: (
    event?:
      | MouseEvent
      | PointerEvent
      | TouchEvent
      | React.PointerEvent
      | React.TouchEvent
  ) => void;
  stopRecording: () => void;
}

const RecordingContext = createContext<RecordingContextType | null>(null);

const useRecordingContext = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error(
      "useRecordingContext must be used within a RecordingProvider"
    );
  }
  return context;
};

const RecordingProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<RecordingState>({
    recordingDuration: null,
    bars: [],
    mousePosition: { x: 0, y: 0 },
    isNearTrash: false,
    isSwipeCancel: false,
    isTouchDevice: false,
    cursorScale: ANIMATION_CONFIG.CURSOR_SCALE_MIN,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const barIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const swipeCancelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trashIconRef = useRef<HTMLElement>(null);
  const startPositionRef = useRef<number>(0);

  const [containerRef, { width }] = useMeasure({
    debounce: 200,
  });

  // Motion values for velocity tracking
  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);

  const {
    recordingDuration,
    bars,
    mousePosition,
    isNearTrash,
    isSwipeCancel,
    isTouchDevice,
    cursorScale,
  } = state;

  const isCancel = useMemo(
    () => isNearTrash || isSwipeCancel,
    [isNearTrash, isSwipeCancel]
  );

  const checkProximity = useCallback((mouseX: number, mouseY: number) => {
    if (!trashIconRef.current) return;

    const trashRect = trashIconRef.current.getBoundingClientRect();
    const trashCenterX = trashRect.left + trashRect.width / 2;
    const trashCenterY = trashRect.top + trashRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mouseX + 8 - trashCenterX, 2) +
        Math.pow(mouseY + 8 - trashCenterY, 2)
    );

    setState((prev) => ({
      ...prev,
      isNearTrash: distance <= PROXIMITY_CONFIG.TRASH_THRESHOLD_PX,
    }));
  }, []);

  // Listen for velocity changes to detect swipe-to-cancel
  useMotionValueEvent(xVelocity, "change", (velocity) => {
    // Only check for swipe cancel if recording
    if (recordingDuration !== null) {
      const currentX = x.get();
      const distance = currentX - startPositionRef.current;

      // Reset scale to minimum if velocity is low (not actively swiping)
      if (Math.abs(velocity) < 100) {
        setState((prev) => ({
          ...prev,
          cursorScale: ANIMATION_CONFIG.CURSOR_SCALE_MIN,
        }));
      } else {
        // Calculate scale based on swipe progress only when actively swiping
        const distanceProgress = Math.max(
          0,
          Math.min(
            1,
            Math.abs(distance) / Math.abs(SWIPE_CONFIG.CANCEL_DISTANCE_PX)
          )
        );
        const velocityThreshold = isTouchDevice
          ? SWIPE_CONFIG.CANCEL_VELOCITY_PX_S_MOBILE
          : SWIPE_CONFIG.CANCEL_VELOCITY_PX_S;
        const velocityProgress = Math.max(
          0,
          Math.min(1, Math.abs(velocity) / Math.abs(velocityThreshold))
        );
        const swipeProgress = Math.max(distanceProgress, velocityProgress);

        const newScale =
          ANIMATION_CONFIG.CURSOR_SCALE_MIN +
          (ANIMATION_CONFIG.CURSOR_SCALE_MAX -
            ANIMATION_CONFIG.CURSOR_SCALE_MIN) *
            swipeProgress;
        setState((prev) => ({ ...prev, cursorScale: newScale }));
      }

      // Check if we should show cancel state based on distance and velocity
      const velocityThreshold = isTouchDevice
        ? SWIPE_CONFIG.CANCEL_VELOCITY_PX_S_MOBILE
        : SWIPE_CONFIG.CANCEL_VELOCITY_PX_S;
      if (
        distance < SWIPE_CONFIG.CANCEL_DISTANCE_PX &&
        velocity < velocityThreshold
      ) {
        setState((prev) => ({ ...prev, isSwipeCancel: true }));

        if (swipeCancelTimeoutRef.current) {
          clearTimeout(swipeCancelTimeoutRef.current);
        }

        // Set timeout to automatically revert cancel state after 500ms
        swipeCancelTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, isSwipeCancel: false }));
          swipeCancelTimeoutRef.current = null;
        }, SWIPE_CONFIG.AUTO_RESET_DELAY_MS);
      } else if (distance > SWIPE_CONFIG.RESET_DISTANCE_PX) {
        // If they swipe back to the right, remove cancel state immediately
        if (swipeCancelTimeoutRef.current) {
          clearTimeout(swipeCancelTimeoutRef.current);
          swipeCancelTimeoutRef.current = null;
        }
        setState((prev) => ({ ...prev, isSwipeCancel: false }));
      }
    }
  });

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;

      if ("touches" in e && e.touches.length > 0) {
        // Touch event - prevent default to avoid scrolling
        e.preventDefault();
        setState((prev) => ({ ...prev, isTouchDevice: true }));
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        // Mouse event
        setState((prev) => ({ ...prev, isTouchDevice: false }));
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const newPosition = { x: clientX - 8, y: clientY - 8 };
      setState((prev) => ({ ...prev, mousePosition: newPosition }));

      // Update motion value for velocity tracking
      x.set(clientX);

      if (recordingDuration !== null) {
        checkProximity(clientX, clientY);
      }
    },
    [checkProximity, recordingDuration, x]
  );

  useEffect(() => {
    if (recordingDuration !== null) {
      // Duration counter (every 1 second)
      intervalRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingDuration: (prev.recordingDuration ?? 0) + 1,
        }));
      }, RECORDING_CONFIG.DURATION_INTERVAL_MS);

      // Bar counter (every 0.25 seconds)
      barIntervalRef.current = setInterval(() => {
        setState((prev) => {
          const newHeight =
            Math.random() *
              (RECORDING_CONFIG.MAX_BAR_HEIGHT -
                RECORDING_CONFIG.MIN_BAR_HEIGHT) +
            RECORDING_CONFIG.MIN_BAR_HEIGHT;
          return { ...prev, bars: [...prev.bars, newHeight] };
        });
      }, RECORDING_CONFIG.WAVEFORM_INTERVAL_MS);

      // Track mouse and touch position
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.body.style.cursor = "grab";
    } else {
      setState((prev) => ({ ...prev, isNearTrash: false }));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (barIntervalRef.current) {
        clearInterval(barIntervalRef.current);
        barIntervalRef.current = null;
      }
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.body.style.cursor = "";
    };
  }, [recordingDuration, x, checkProximity, handleMove]);

  const startRecording = useCallback(
    (
      event?:
        | MouseEvent
        | PointerEvent
        | TouchEvent
        | React.PointerEvent
        | React.TouchEvent
    ) => {
      document.body.setAttribute("data-recording", "true");
      if (event) {
        let clientX: number, clientY: number;

        if ("touches" in event && event.touches.length > 0) {
          // Touch event
          setState((prev) => ({ ...prev, isTouchDevice: true }));
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else if ("clientX" in event && "clientY" in event) {
          // Mouse/Pointer event
          setState((prev) => ({ ...prev, isTouchDevice: false }));
          clientX = event.clientX;
          clientY = event.clientY;
        } else {
          return;
        }

        const newPosition = { x: clientX - 8, y: clientY - 8 };
        setState((prev) => ({ ...prev, mousePosition: newPosition }));
        // Initialize motion value and store starting position
        x.set(clientX);
        startPositionRef.current = clientX;
        checkProximity(clientX, clientY);
      }

      timeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, recordingDuration: 0 }));
      }, RECORDING_CONFIG.DELAY_MS);
    },
    [x, checkProximity]
  );

  const stopRecording = useCallback(() => {
    document.body.removeAttribute("data-recording");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (swipeCancelTimeoutRef.current) {
      clearTimeout(swipeCancelTimeoutRef.current);
      swipeCancelTimeoutRef.current = null;
    }

    setState({
      recordingDuration: null,
      bars: [],
      mousePosition: { x: 0, y: 0 },
      isNearTrash: false,
      isSwipeCancel: false,
      isTouchDevice: false,
      cursorScale: ANIMATION_CONFIG.CURSOR_SCALE_MIN,
    });
  }, []);

  const value: RecordingContextType = useMemo(
    () => ({
      recordingDuration,
      bars,
      mousePosition,
      isRecording: recordingDuration !== null,
      isNearTrash,
      isSwipeCancel,
      isCancel,
      cursorScale,
      trashIconRef,
      startRecording,
      stopRecording,
      containerRef,
      containerWidth: width,
    }),
    [
      recordingDuration,
      bars,
      mousePosition,
      isNearTrash,
      isSwipeCancel,
      isCancel,
      cursorScale,
      startRecording,
      stopRecording,
      containerRef,
      width,
    ]
  );

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const Recording = memo(() => {
  const {
    recordingDuration,
    bars,
    isCancel,
    trashIconRef,
    isRecording,
    containerWidth,
  } = useRecordingContext();

  return (
    <>
      <AnimatePresence>
        {isRecording ? (
          <motion.div
            key={"recording"}
            initial={{
              scale: ANIMATION_CONFIG.RECORDING_SCALE_ORIGIN,
              width: ANIMATION_CONFIG.RECORDING_WIDTH_ORIGIN,
            }}
            animate={{
              scale: 1,
              width: containerWidth,
            }}
            exit={{
              scale: ANIMATION_CONFIG.RECORDING_SCALE_ORIGIN,
              width: ANIMATION_CONFIG.RECORDING_WIDTH_ORIGIN,
              opacity: 0,
              transition: {
                duration: ANIMATION_CONFIG.EXIT_DURATION_S,
                opacity: {
                  delay: ANIMATION_CONFIG.EXIT_DURATION_S,
                },
              },
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            style={{
              transformOrigin: "20px center",
            }}
            className="absolute z-10 pointer-events-auto overflow-hidden top-1/2 -translate-y-1/2 left-0 h-10 pl-1.5 pr-4 bg-indigo-500 rounded-full flex items-center gap-2"
          >
            <span ref={trashIconRef} data-trash-icon className="size-7 block" />

            <div className="flex-1 flex items-center gap-0.5 h-6">
              {bars.map((height, i) => (
                <motion.div
                  key={i}
                  initial={{
                    scale: 0,
                    height: RECORDING_CONFIG.MIN_BAR_HEIGHT,
                  }}
                  animate={{ scale: 1, height }}
                  transition={{ duration: 0.2 }}
                  className="w-0.5 bg-white rounded-full"
                  style={{ minHeight: RECORDING_CONFIG.MIN_BAR_HEIGHT }}
                />
              ))}
            </div>

            <p className="text-xs text-white tabular-nums">
              {formatTime(recordingDuration ?? 0)}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {isRecording ? (
          <motion.span
            key={"trash-icon"}
            initial={{
              background: "var(--color-white)",
              color: "var(--color-stone-400)",
              rotate: 0,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              color: isCancel
                ? "var(--color-red-500)"
                : "var(--color-stone-400)",
              transition: {
                delay: 0.1,
                type: "spring",
                stiffness: 600,
                damping: 20,
              },
            }}
            exit={
              isCancel
                ? {
                    background: "var(--color-red-500)",
                    color: "var(--color-white)",
                    scale: [1, 1.3, 1.3, 0],
                    rotate: [0, -15, -15, -15],
                    opacity: [1, 1, 1, 0],
                    transition: {
                      duration: ANIMATION_CONFIG.DELETE_DURATION_S,
                      times: [0, 0.2, 0.8, 1],
                      ease: "backOut",
                    },
                  }
                : {
                    opacity: 0,
                    scale: 0.8,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            className={
              "size-7 rounded-full inline-grid place-content-center absolute top-1/2 -translate-y-1/2 left-1.5 z-10 "
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="size-4"
              overflow="visible"
            >
              <g fill="currentColor">
                <motion.rect
                  x="8"
                  y="3"
                  width="4"
                  height="2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  fill="currentColor"
                  animate={{
                    rotate: isCancel ? -15 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  style={{
                    transformOrigin: "6px 4px", // Rotate around the left edge
                  }}
                />
                <path
                  d="m4.299,8l.358,7.149c.079,1.599,1.396,2.851,2.996,2.851h4.695c1.601,0,2.917-1.252,2.996-2.851l.358-7.149H4.299Z"
                  strokeWidth="0"
                  fill="currentColor"
                />
                <motion.line
                  x1="17"
                  y1="5"
                  x2="3"
                  y2="5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  animate={{
                    rotate: isCancel ? -15 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  style={{
                    transformOrigin: "3px 5px", // Rotate around the left end
                  }}
                />
              </g>
            </svg>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </>
  );
});

Recording.displayName = "Recording";

const RecordingCursor = memo(() => {
  const { isCancel, mousePosition, isRecording, trashIconRef, cursorScale } =
    useRecordingContext();

  const trashIconElement = trashIconRef?.current;
  const trashCenter = useMemo(() => {
    if (!trashIconElement) return { x: 0, y: 0 };
    const rect = trashIconElement.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, [trashIconElement]);

  return (
    <AnimatePresence>
      {isRecording ? (
        <motion.button
          key={"recording-grab"}
          data-recording-grab
          type="button"
          className={`fixed pointer-events-none z-50 rounded-full size-8 inline-grid place-content-center transition-colors ${
            isCancel ? "text-white bg-red-500" : "text-stone-400 bg-stone-200"
          }`}
          style={{
            left: mousePosition.x - 16,
            top: mousePosition.y - 16,
          }}
          animate={{
            scale: isCancel ? ANIMATION_CONFIG.CURSOR_SCALE_MAX : cursorScale,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          exit={
            isCancel
              ? {
                  left: trashCenter.x - 16, // Center minus half width
                  top: trashCenter.y - 16, // Center minus half height
                  scale: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                    ease: "easeInOut",
                  },
                }
              : {
                  scale: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                  },
                }
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4.5"
            viewBox="0 0 20 20"
          >
            <g fill="currentColor">
              <path
                d="m17,8c0,3.866-3.134,7-7,7s-7-3.134-7-7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <line
                x1="10"
                y1="15"
                x2="10"
                y2="17"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></line>
              <rect
                x="7"
                y="3"
                width="6"
                height="8"
                rx="3"
                ry="3"
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></rect>
            </g>
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
});

RecordingCursor.displayName = "RecordingCursor";

const CameraButton = memo(() => (
  <button
    type="button"
    className="size-7 rounded-full bg-indigo-500 text-white inline-grid place-content-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className="size-4"
    >
      <g fill="currentColor">
        <path
          d="m14,4h-.4419l-.3818-.8335c-.3247-.7085-1.0386-1.1665-1.8179-1.1665h-2.7168c-.7793,0-1.4932.458-1.8184,1.167l-.3813.833h-.4419c-2.2056,0-4,1.7944-4,4v5c0,2.2056,1.7944,4,4,4h8c2.2056,0,4-1.7944,4-4v-5c0-2.2056-1.7944-4-4-4Zm-4,10c-1.933,0-3.5-1.567-3.5-3.5s1.567-3.5,3.5-3.5,3.5,1.567,3.5,3.5-1.567,3.5-3.5,3.5Z"
          strokeWidth="0"
          fill="currentColor"
        />
      </g>
    </svg>
  </button>
));

CameraButton.displayName = "CameraButton";

const ImageButton = memo(() => (
  <button
    type="button"
    className="bg-stone-200 text-stone-400 rounded-full size-7 inline-grid place-content-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className="size-4"
    >
      <g fill="currentColor">
        <path
          d="m10,17c3.1226,0,5.7656-2.0457,6.6674-4.8693l-2.7531-2.7531c-.781-.781-2.0474-.781-2.8284,0l-5.7928,5.7928c1.2438,1.133,2.892,1.8297,4.707,1.8297Z"
          fill="currentColor"
          strokeWidth="0"
        />
        <circle cx="7.5" cy="8.5" r="1.5" fill="currentColor" strokeWidth="0" />
        <circle
          cx="10"
          cy="10"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  </button>
));

ImageButton.displayName = "ImageButton";

const PlusButton = memo(() => (
  <button
    type="button"
    className="bg-stone-200 text-stone-400 rounded-full size-7 inline-grid place-content-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className="size-4"
    >
      <g fill="currentColor">
        <path
          d="m10,2C5.589,2,2,5.589,2,10s3.589,8,8,8,8-3.589,8-8S14.411,2,10,2Zm3.5,9h-2.5v2.5c0,.552-.448,1-1,1s-1-.448-1-1v-2.5h-2.5c-.552,0-1-.448-1-1s.448-1,1-1h2.5v-2.5c0,.552.448-1,1-1s1,.448,1,1v2.5h2.5c.552,0,1,.448,1,1s-.448,1-1,1Z"
          strokeWidth="0"
          fill="currentColor"
        />
      </g>
    </svg>
  </button>
));

PlusButton.displayName = "PlusButton";

const HelpMessage = memo(() => {
  const { isRecording, isCancel } = useRecordingContext();

  if (isCancel) {
    return (
      <p className="text-sm font-medium text-stone-400 text-center w-full block">
        Release to cancel
      </p>
    );
  }

  if (isRecording) {
    return (
      <p className="text-sm font-medium text-stone-400 text-center w-full block">
        Swipe left to cancel
      </p>
    );
  }
  return (
    <p className="text-sm font-medium text-stone-400 text-center w-full block">
      Press and hold to record
    </p>
  );
});

HelpMessage.displayName = "HelpMessage";

const MessageInput = memo(() => {
  const { startRecording, stopRecording, containerRef } = useRecordingContext();

  return (
    <>
      <HelpMessage />

      <RecordingCursor />

      <div
        ref={containerRef}
        className="h-16 w-full flex items-center relative max-w-[400px]"
      >
        <Recording />

        <div className="h-10 px-1.5 bg-white shadow-[0px_2px_4px_rgba(28,_25,_23,_0.04),_0px_3px_2px_-2px_rgba(28,_25,_23,_0.14),_0px_0px_0px_1px_rgba(28,_25,_23,_0.06)] rounded-full flex items-center gap-2 w-full">
          <CameraButton />
          <input
            type="text"
            placeholder="Message..."
            className="text-sm font-[580] text-stone-800 w-full h-full flex-1 outline-none bg-transparent placeholder:text-stone-400"
          />

          <div className="gap-1.5 flex items-center">
            <ImageButton />

            <PlusButton />

            <motion.button
              type="button"
              className="bg-stone-800 cursor-pointer text-white rounded-full size-7 inline-grid place-content-center hover:bg-stone-700 transition-colors"
              onTapStart={startRecording}
              onTap={stopRecording}
              onTapCancel={stopRecording}
              whileTap={{
                scale: 0.95,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                viewBox="0 0 20 20"
              >
                <g fill="currentColor">
                  <path
                    d="m17,8c0,3.866-3.134,7-7,7s-7-3.134-7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                  <line
                    x1="10"
                    y1="15"
                    x2="10"
                    y2="17"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></line>
                  <rect
                    x="7"
                    y="3"
                    width="6"
                    height="8"
                    rx="3"
                    ry="3"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></rect>
                </g>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
});

MessageInput.displayName = "MessageInput";

function App() {
  return (
    <RecordingProvider>
      <MessageInput />
    </RecordingProvider>
  );
}

export default App;
