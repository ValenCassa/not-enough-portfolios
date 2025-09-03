"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  LegacyAnimationControls as AnimationControls,
} from "motion/react";

function InputOTP({
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      containerClassName={"flex items-center gap-3"}
      className="cursor-default"
      {...props}
    />
  );
}
function InputOTPGroup({ ...props }: React.ComponentProps<"div">) {
  return <div className={"flex items-center gap-2"} {...props} />;
}

interface InputOTPSlotProps extends React.ComponentProps<"div"> {
  state: State;
  index: number;
}

const stateClassNames = (state: State) => {
  if (state === "error") {
    return "ring-red-500";
  }
  if (state === "success") {
    return "ring-green-500";
  }
  return "ring-blue-500";
};

function InputOTPSlot({ state, index, ...props }: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, isActive } = inputOTPContext?.slots[index] ?? {};

  const ringClassName = stateClassNames(state);

  return (
    <div
      data-active={isActive}
      className={`outline-hidden relative h-11 w-10 bg-stone-100 rounded-[10px] inline-grid place-content-center font-medium text-stone-950 ${
        state === "loading" ? "animate-pulse" : ""
      }`}
      {...props}
    >
      {isActive ? (
        <motion.span
          layoutId="ring"
          layout="position"
          animate={{
            opacity: state === "loading" ? 0 : 1,
          }}
          className={`absolute pointer-events-none z-10 inset-0 rounded-[inherit] ring-2 transition-colors ${ringClassName}`}
        />
      ) : null}

      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char || "empty"}
          initial={{ y: "100%", rotateX: 90, scale: 0.98 }}
          animate={{
            y: "0%",
            rotateX: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 180,
              damping: 20,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          style={{
            transformOrigin: "center",
            transformStyle: "preserve-3d",
          }}
          className={char ? "" : "text-stone-400"}
        >
          {char || "0"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      className="w-2 h-0.5 bg-stone-500 rounded-full"
      {...props}
    />
  );
}

interface FormIconProps {
  isSuccess: boolean;
  controls: AnimationControls;
}

const FormIcon = ({ controls, isSuccess }: FormIconProps) => {
  return (
    <motion.span
      animate={controls}
      style={{
        transformOrigin: "bottom",
      }}
      className="size-11 bg-blue-50 rounded-full inline-grid place-content-center text-blue-500"
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            key="success"
            className="size-6"
          >
            <g fill="currentColor">
              <path
                d="m6.5,9v-2.5c0-1.933,1.567-3.5,3.5-3.5h0c1.933,0,3.5,1.567,3.5,3.5v2.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <line
                x1="10"
                y1="12.5"
                x2="10"
                y2="13.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></line>
              <rect
                x="4"
                y="9"
                width="12"
                height="8"
                rx="2"
                ry="2"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></rect>
            </g>
          </svg>
        ) : (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            exit={{
              transition: {
                delay: 0.15,
              },
            }}
            height="20"
            viewBox="0 0 20 20"
            className="size-6"
            key="default"
          >
            <g fill="currentColor">
              <path
                d="m3,7l6.504,3.716c.307.176.685.176.992,0l6.504-3.716"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <rect
                x="3"
                y="4"
                width="14"
                height="12"
                rx="3"
                ry="3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></rect>
            </g>
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.span>
  );
};

const ErrorMessage = () => {
  return (
    <motion.p
      initial={{
        opacity: 0,
        height: 0,
      }}
      animate={{
        opacity: 1,
        height: 36,
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="text-center text-sm text-red-500"
    >
      Incorrect validation code
    </motion.p>
  );
};

const code = "123456";

const checkValidCode = (value: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value === code);
    }, 1000);
  });
};

type State = "default" | "error" | "success" | "loading";

export function OTPVerification() {
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState<State>("default");
  const iconControls = useAnimationControls();

  // Workaround: Motion doesn't support more than 2 timeframes for spring animations
  const playSqueezeAnimation = async () => {
    iconControls.start({
      scaleY: 0.65,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 8,
      },
    });

    setTimeout(() => {
      iconControls.start({
        scaleY: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 12,
        },
      });
    }, 150);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const value = e.currentTarget.querySelector("input")!.value;

        setState("loading");
        const isValid = await checkValidCode(value);
        if (!isValid) {
          setState("error");
          setValue("");
          return;
        }

        setState("success");
        setValue("");
        playSqueezeAnimation();
      }}
      className="space-y-4 flex flex-col items-center"
    >
      <FormIcon isSuccess={state === "success"} controls={iconControls} />
      <div className="space-y-1 text-center">
        <p className="font-medium text-stone-950">
          We&apos;ve emailed you a verification code
        </p>
        <p className="text-sm text-stone-500">
          Please enter the code we sent you below.
        </p>
      </div>
      <motion.div
        animate={state === "error" ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <InputOTP
          maxLength={6}
          value={value}
          onChange={async (newVal) => {
            if (state === "loading") {
              return;
            }

            setValue(newVal);
            setState("default");

            const isComplete = newVal.length === code.length;
            if (isComplete) {
              document.querySelector("form")?.requestSubmit();
            }
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot state={state} index={0} />
            <InputOTPSlot state={state} index={1} />
            <InputOTPSlot state={state} index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot state={state} index={3} />
            <InputOTPSlot state={state} index={4} />
            <InputOTPSlot state={state} index={5} />
          </InputOTPGroup>
        </InputOTP>
      </motion.div>

      <div>
        <AnimatePresence>
          {state === "error" && <ErrorMessage />}
        </AnimatePresence>
        <p className="text-sm text-stone-500">
          Didn&apos;t receive a code?{" "}
          <span className="text-stone-950 font-medium">Resend</span>
        </p>
      </div>
    </form>
  );
}
