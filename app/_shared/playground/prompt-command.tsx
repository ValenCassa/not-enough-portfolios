"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ComponentProps,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

// ==================== TYPES ====================

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface CommandBarContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messages: Message[];
  startAssistantSequence: (userMessage: string) => void;
  stopAssistantSequence: () => void;
}

// ==================== CONSTANTS ====================

const COMMAND_BAR_CONFIG = {
  CLOSED_WIDTH: 305,
  CLOSED_HEIGHT: 42,
  CLOSED_BORDER_RADIUS: 21,
  OPENED_WIDTH: 514,
  OPENED_HEIGHT: 150,
  OPENED_BORDER_RADIUS: 8,
  INPUT_HEIGHT: 102,
} as const;

const ASSISTANT_MESSAGES = [
  "is thinking...",
  "Analyzing your request...",
  "Designing your UI...",
  "Generating components...",
  "Finalizing layout...",
] as const;

const ANIMATION_TIMING = {
  SEQUENCE_DELAY: 2000,
  MESSAGE_INTERVAL: 2000,
  TRANSITION_DURATION: 0.2,
} as const;

// ==================== CONTEXT ====================

const CommandBarContext = createContext<CommandBarContextType | null>(null);

const useCommandBar = () => {
  const context = useContext(CommandBarContext);
  if (!context) {
    throw new Error("useCommandBar must be used within a CommandBarProvider");
  }
  return context;
};

const CommandBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const activeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAssistantSequence = (userMessage: string) => {
    // Clear any existing timeouts
    activeTimeoutsRef.current.forEach(clearTimeout);
    activeTimeoutsRef.current = [];

    // Show user message immediately
    setMessages([{ role: "user", content: userMessage }]);

    // Start assistant sequence after delay
    const initialTimeout = setTimeout(() => {
      ASSISTANT_MESSAGES.forEach((message, index) => {
        const messageTimeout = setTimeout(() => {
          setMessages([{ role: "assistant", content: message }]);
        }, index * ANIMATION_TIMING.MESSAGE_INTERVAL);
        activeTimeoutsRef.current.push(messageTimeout);
      });

      // Clear messages after sequence completes
      const clearTimeout = setTimeout(() => {
        setMessages([]);
      }, ASSISTANT_MESSAGES.length * ANIMATION_TIMING.MESSAGE_INTERVAL);
      activeTimeoutsRef.current.push(clearTimeout);
    }, ANIMATION_TIMING.SEQUENCE_DELAY);

    activeTimeoutsRef.current.push(initialTimeout);
  };

  const stopAssistantSequence = () => {
    activeTimeoutsRef.current.forEach(clearTimeout);
    activeTimeoutsRef.current = [];
    setMessages([]);
  };

  useEffect(() => {
    return () => {
      activeTimeoutsRef.current.forEach(clearTimeout);
      activeTimeoutsRef.current = [];
    };
  }, []);

  return (
    <CommandBarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        startAssistantSequence,
        stopAssistantSequence,
      }}
    >
      {children}
    </CommandBarContext.Provider>
  );
};

// ==================== UTILITY COMPONENTS ====================

const BorderBeam = () => {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className="absolute aspect-square bg-gradient-to-l from-sky-500 via-sky-400 to-transparent"
        style={{
          width: 50,
          offsetPath: `rect(0 auto auto 0 round 50px)`,
        }}
        initial={{ offsetDistance: "75%" }}
        animate={{
          offsetDistance: ["75%", "175%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 2,
        }}
      />
    </div>
  );
};

const V0Logo = () => {
  return (
    <svg
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <g clipPath="url(#clip0_1644_233)">
        <path
          d="M11.6958 0H16.4593C18.3908 0 19.9567 1.56582 19.9567 3.49738V8.04025H18.0002V3.49738C18.0002 3.45083 17.9983 3.40462 17.9948 3.35883L13.2313 8.0395C13.2473 8.04 13.2635 8.04025 13.2796 8.04025H18.0002V9.8881H13.2796C11.3481 9.8881 9.73926 8.30695 9.73926 6.3754V1.84461H11.6958V6.3754C11.6958 6.46265 11.7026 6.54885 11.7157 6.6334L16.584 1.84975C16.5429 1.84635 16.5014 1.84461 16.4593 1.84461H11.6958V0Z"
          fill="#79716B"
        />
        <path
          d="M6.8844 9.54776L0 1.84375H2.76967L6.81155 6.36681V1.84375H8.87675V8.78726C8.87675 9.83521 7.5827 10.3292 6.8844 9.54776Z"
          fill="#79716B"
        />
      </g>
      <defs>
        <clipPath id="clip0_1644_233">
          <rect width="20" height="10" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

// ==================== BUTTON COMPONENTS ====================

const ActionButton = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isOpen } = useCommandBar();
  return (
    <div
      data-open={isOpen || undefined}
      className={`size-7.5 rounded-full data-[open]:rounded-md hover:bg-stone-100 transition-colors inline-grid place-items-center ${className}`}
    >
      {children}
    </div>
  );
};

const CursorButton = () => {
  return (
    <ActionButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className="text-stone-500 size-4"
      >
        <g fill="currentColor">
          <path
            d="m5.0581,3.5724l10.6813,3.903c1.0363.3787,1.0063,1.8545-.0445,2.1908l-4.5677,1.4617-1.4616,4.5674c-.3363,1.0509-1.8123,1.0808-2.1908.0444L3.5728,5.0575c-.338-.9253.5601-1.8232,1.4853-1.4851Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </ActionButton>
  );
};

const UTurnButton = ({
  className = "",
  ...props
}: ComponentProps<"button">) => {
  const { isOpen } = useCommandBar();

  return (
    <button
      {...props}
      data-open={isOpen || undefined}
      className={`size-7.5 rounded-full data-[open]:rounded-md hover:bg-stone-100 transition-colors inline-grid place-items-center ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className="text-stone-400 size-4"
      >
        <g fill="currentColor">
          <path
            d="m10,16h3c2.209,0,4-1.791,4-4h0c0-2.209-1.791-4-4-4H3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <polyline
            points="7 4 3 8 7 12"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </button>
  );
};

const FileAttachButton = () => {
  return (
    <div className="size-6.5 rounded-md hover:bg-stone-100 transition-colors inline-grid place-items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className="text-stone-400 size-4"
      >
        <g fill="currentColor">
          <path
            d="m10.864,6.932l-2.78,2.78c-.768.768-.768,2.012,0,2.78h0c.768.768,2.012.768,2.78,0l2.78-2.78c1.535-1.535,1.535-4.025,0-5.56h0c-1.535-1.535-4.025-1.535-5.56,0l-2.78,2.78c-2.303,2.303-2.303,6.037,0,8.341h0c2.303,2.303,6.037,2.303,8.341,0l2.78-2.78"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
};

const SendButton = (props: ComponentProps<"button">) => {
  return (
    <button
      {...props}
      className="size-6.5 bg-stone-800 rounded-md hover:bg-stone-700 inline-grid place-items-center text-white disabled:opacity-50 transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className="text-white size-4"
      >
        <g fill="currentColor">
          <line
            x1="11.292"
            y1="8.708"
            x2="8.351"
            y2="11.649"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m16.942,4.442l-3.937,11.81c-.301.903-1.532,1.017-1.994.185l-2.66-4.788-4.788-2.66c-.832-.462-.718-1.693.185-1.994l11.81-3.937c.855-.285,1.669.529,1.384,1.384Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </button>
  );
};

const StopButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="h-7.5 w-9 hover:bg-stone-200 transition-colors inline-grid place-items-center border-l border-stone-950/6"
      onClick={onClick}
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.5 10.5C2.5 8.37827 3.34285 6.34344 4.84315 4.84315C6.34344 3.34285 8.37827 2.5 10.5 2.5C12.6217 2.5 14.6566 3.34285 16.1569 4.84315C17.6571 6.34344 18.5 8.37827 18.5 10.5C18.5 12.6217 17.6571 14.6566 16.1569 16.1569C14.6566 17.6571 12.6217 18.5 10.5 18.5C8.37827 18.5 6.34344 17.6571 4.84315 16.1569C3.34285 14.6566 2.5 12.6217 2.5 10.5ZM7.5 8.25C7.5 8.05109 7.57902 7.86032 7.71967 7.71967C7.86032 7.57902 8.05109 7.5 8.25 7.5H12.75C12.9489 7.5 13.1397 7.57902 13.2803 7.71967C13.421 7.86032 13.5 8.05109 13.5 8.25V12.75C13.5 12.9489 13.421 13.1397 13.2803 13.2803C13.1397 13.421 12.9489 13.5 12.75 13.5H8.25C8.05109 13.5 7.86032 13.421 7.71967 13.2803C7.57902 13.1397 7.5 12.9489 7.5 12.75V8.25Z"
          fill="#A6A09B"
        />
      </svg>
    </button>
  );
};

// ==================== CHAT COMPONENTS ====================

interface ChatProgressProps {
  displayType: "button" | "chat";
}

const ChatProgress = ({ displayType }: ChatProgressProps) => {
  const { messages } = useCommandBar();
  const currentMessage = messages[messages.length - 1];

  return (
    <AnimatePresence mode="wait" initial={false}>
      {(() => {
        if (!currentMessage) {
          return (
            <motion.p
              key={"default-text"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="whitespace-nowrap"
            >
              {displayType === "button" ? "Ask anything..." : "Chat"}
            </motion.p>
          );
        }

        return (
          <motion.div
            key={"message-display"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_TIMING.TRANSITION_DURATION }}
            className="flex items-center gap-2 text-neutral-500 whitespace-nowrap"
          >
            <AnimatePresence mode="wait">
              <motion.span
                initial={{ filter: "blur(6px)", x: -5, opacity: 0 }}
                animate={{ filter: "blur(0px)", x: 0, opacity: 1 }}
                exit={{ filter: "blur(6px)", x: 5, opacity: 0 }}
                transition={{ duration: ANIMATION_TIMING.TRANSITION_DURATION }}
                key={currentMessage.role}
              >
                {currentMessage.role === "assistant" ? (
                  <V0Logo />
                ) : (
                  <div className="rounded-sm bg-amber-500 size-4" />
                )}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage.content}
                initial={{ y: 10, filter: "blur(6px)", opacity: 0 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                exit={{ y: -10, filter: "blur(6px)", opacity: 0 }}
                transition={{ duration: ANIMATION_TIMING.TRANSITION_DURATION }}
                className="whitespace-nowrap"
              >
                {currentMessage.content}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
};

const CommandChatHeader = () => {
  const { messages } = useCommandBar();
  const hasActiveMessage = Boolean(messages.length);
  const currentMessage = messages[messages.length - 1];

  return (
    <motion.div
      initial={{
        opacity: 0,
        bottom: "90%",
        left: "50%",
        translateX: "-50%",
        scale: 0.65,
      }}
      animate={{
        opacity: 1,
        backgroundColor: currentMessage ? "var(--color-stone-100)" : "white",
        borderColor: currentMessage ? "transparent" : "var(--color-stone-200)",
        bottom: "99%",
        left: "50%",
        translateX: "-50%",
        scale: 1,
      }}
      exit={{
        opacity: 0,
        bottom: 0,
        left: "50%",
        scale: 0.65,
        translateX: "-50%",
      }}
      transition={{ duration: ANIMATION_TIMING.TRANSITION_DURATION }}
      className="absolute text-xs font-medium px-2 border-[1px_1px_0_1px] -z-10 w-[490px] h-[34px] flex items-center leading-none rounded-t-xl"
      style={{ overflow: "visible" }}
    >
      {hasActiveMessage ? <BorderBeam /> : null}
      <ChatProgress displayType="chat" />
    </motion.div>
  );
};

// ==================== COMMAND BAR SECTIONS ====================

const CommandBarActions = () => {
  return (
    <div className="flex items-center flex-1 gap-1.5">
      <CursorButton />
      <div role="separator" className="h-4 w-px bg-stone-200" />
      <div className="flex gap-1">
        <UTurnButton />
        <UTurnButton className="rotate-y-180" />
      </div>
    </div>
  );
};

const CommandBarStatus = () => {
  const { isOpen, setIsOpen, messages, stopAssistantSequence } =
    useCommandBar();
  const hasActiveMessages = Boolean(messages.length);

  return (
    <motion.div className="flex items-center relative">
      <AnimatePresence mode="sync" initial={false}>
        {!isOpen ? (
          <motion.div
            key="closed-status"
            initial={{
              opacity: 0,
              backgroundColor: "var(--color-stone-100)",
            }}
            animate={{
              opacity: 1,
              backgroundColor: "var(--color-stone-100)",
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              height: 20,
              backgroundColor: "transparent",
              transition: { duration: 0.15 },
            }}
            transition={{
              duration: ANIMATION_TIMING.TRANSITION_DURATION,
              ease: "easeInOut",
            }}
            className="absolute right-0 h-7.5 flex items-center text-sm text-stone-500 rounded-full overflow-hidden w-[180px]"
          >
            {hasActiveMessages && <BorderBeam />}
            <button
              data-has-message={hasActiveMessages || undefined}
              type="button"
              className="flex-1 px-3 text-left flex items-center hover:bg-stone-200 transition-colors h-full overflow-hidden relative data-[has-message]:[mask-image:_linear-gradient(to_right,_black_40%,_transparent_100%)]"
              onClick={() => setIsOpen(true)}
            >
              <ChatProgress displayType="button" />
            </button>
            {hasActiveMessages && (
              <StopButton onClick={stopAssistantSequence} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="opened-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: ANIMATION_TIMING.TRANSITION_DURATION,
              ease: "easeInOut",
            }}
            className="absolute right-0 flex items-center gap-1.5 pr-1"
          >
            <p className="text-xs">Close</p>
            <span className="text-sm text-stone-500 font-medium size-5 inline-grid place-content-center bg-stone-100 rounded-sm">
              ⌘
            </span>
            <span className="text-sm text-stone-500 font-medium size-5 inline-grid place-content-center bg-stone-100 rounded-sm">
              .
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CommandBarInput = () => {
  const { startAssistantSequence, messages } = useCommandBar();
  const [userInput, setUserInput] = useState("");
  const hasActiveMessages = Boolean(messages.length);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      startAssistantSequence(userInput.trim());
      setUserInput("");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: ANIMATION_TIMING.TRANSITION_DURATION }}
      className="w-full h-full relative mt-1.5 bg-stone-50 border border-stone-950/4 rounded-md overflow-hidden origin-top"
    >
      <div
        className="h-[102px] flex flex-col absolute left-1/2 -translate-x-1/2"
        style={{ width: COMMAND_BAR_CONFIG.OPENED_WIDTH - 12 }}
      >
        <textarea
          data-textarea
          className="bg-transparent w-full px-2 py-1.5 outline-none text-sm placeholder:text-stone-400 resize-none flex-1"
          placeholder="Ask anything..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="p-2 flex items-center justify-end gap-1.5">
          <FileAttachButton />
          <SendButton
            disabled={!userInput.trim() || hasActiveMessages}
            type="submit"
          />
        </div>
      </div>
    </motion.form>
  );
};

// ==================== MAIN COMMAND BAR ====================

const CommandBar = () => {
  const { isOpen, setIsOpen } = useCommandBar();

  useHotkeys(
    "meta+slash",
    (e) => {
      e.preventDefault();
      setIsOpen(true);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useHotkeys(
    "meta+period",
    (e) => {
      e.preventDefault();
      setIsOpen(false);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  const focusTextarea = () => {
    if (isOpen) {
      const textarea = document.querySelector("[data-textarea]");
      if (textarea) {
        (textarea as HTMLTextAreaElement).focus();
      }
    }
  };

  return (
    <div className="relative isolate w-full flex flex-col items-center justify-end">
      <AnimatePresence mode="wait">
        {isOpen && <CommandChatHeader key="chat-header" />}
      </AnimatePresence>

      <motion.div
        className="bg-white overflow-hidden flex flex-col p-1.5 shadow-[0px_2px_4px_rgba(28,_25,_23,_0.04),_0px_3px_2px_-2px_rgba(28,_25,_23,_0.16),_0px_0px_0px_1px_rgba(28,_25,_23,_0.08)]"
        initial={{
          borderRadius: COMMAND_BAR_CONFIG.CLOSED_BORDER_RADIUS,
          width: COMMAND_BAR_CONFIG.CLOSED_WIDTH,
          height: COMMAND_BAR_CONFIG.CLOSED_HEIGHT,
        }}
        animate={{
          borderRadius: isOpen
            ? COMMAND_BAR_CONFIG.OPENED_BORDER_RADIUS
            : COMMAND_BAR_CONFIG.CLOSED_BORDER_RADIUS,
          width: isOpen
            ? COMMAND_BAR_CONFIG.OPENED_WIDTH
            : COMMAND_BAR_CONFIG.CLOSED_WIDTH,
          height: isOpen
            ? COMMAND_BAR_CONFIG.OPENED_HEIGHT
            : COMMAND_BAR_CONFIG.CLOSED_HEIGHT,
          transition: { duration: ANIMATION_TIMING.TRANSITION_DURATION },
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        onAnimationComplete={focusTextarea}
      >
        <div className="flex items-center w-full gap-1.5">
          <CommandBarActions />
          <CommandBarStatus />
        </div>
        <AnimatePresence mode="wait">
          {isOpen && <CommandBarInput key="input-form" />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ==================== APP ====================

export function PromptCommand() {
  return (
    <CommandBarProvider>
      <CommandBar />
    </CommandBarProvider>
  );
}
