import { ComponentProps } from "react";

type ContactLinkProps = ComponentProps<"a">;
const ContactLink = ({ href, children, ...props }: ContactLinkProps) => {
  return (
    <a
      href={href}
      className="underline group text-sm text-stone-400 h-8 hover:text-stone-800 transition-colors flex items-center gap-1 relative overflow-hidden"
      {...props}
    >
      {children}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-all duration-200 group-hover:-translate-y-6 group-hover:translate-x-4"
      >
        <path d="M7 7h10v10"></path>
        <path d="M7 17 17 7"></path>
      </svg>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-0 top-1/2 h-4 w-4 -translate-x-[18px] translate-y-6 transition-all duration-150 group-hover:-translate-x-[2px] group-hover:-translate-y-1/2"
      >
        <path d="M7 7h10v10"></path>
        <path d="M7 17 17 7"></path>
      </svg>
    </a>
  );
};

export const SayHi = () => {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-stone-700">~/ say hi</h2>
      <div className="flex items-center gap-4">
        <ContactLink
          href="https://x.com/_cassarino"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </ContactLink>
        <ContactLink href="mailto:valencassa@gmail.com">Mail</ContactLink>
        <ContactLink
          href="https://github.com/ValenCassa"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </ContactLink>
      </div>
    </section>
  );
};
