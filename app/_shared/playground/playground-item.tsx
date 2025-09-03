"use client";

import { ExternalLinkIcon } from "@/components/icons/external-link-icon";
import { ComponentProps } from "react";

export const PlaygroundItem = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-stone-800">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </div>
      {children}
    </div>
  );
};

interface PlaygroundItemContainerProps extends ComponentProps<"div"> {
  codesandbox?: string;
}
export const PlaygroundItemContainer = ({
  children,
  className,
  codesandbox,
  ...props
}: PlaygroundItemContainerProps) => {
  return (
    <div
      className={`bg-stone-50 rounded-md border border-stone-950/[0.04] flex items-center justify-center p-8 w-full relative overflow-hidden ${className}`}
      {...props}
    >
      {codesandbox && (
        <a
          href={codesandbox}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white inline-grid place-content-center hover:bg-neutral-50 transition-colors size-6 rounded shadow-[0px_2px_4px_rgba(28,_25,_23,_0.04),_0px_3px_2px_-2px_rgba(28,_25,_23,_0.14),_0px_0px_0px_1px_rgba(28,_25,_23,_0.06)] absolute top-1 right-1"
        >
          <ExternalLinkIcon className="size-4 text-neutral-500 hover:text-neutral-800 transition-colors" />
        </a>
      )}
      {children}
    </div>
  );
};
