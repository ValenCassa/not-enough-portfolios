import { ComponentProps } from "react";

export const ExternalLinkIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      {...props}
    >
      <g fill="currentColor">
        <polyline
          points="12 12 12 8 8 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></polyline>
        <line
          x1="3"
          y1="17"
          x2="12"
          y2="8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></line>
        <path
          d="m7.95,17h5.05c1.657,0,3-1.343,3-3V6c0-1.657-1.343-3-3-3h-6c-1.657,0-3,1.343-3,3v5.05"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
      </g>
    </svg>
  );
};
