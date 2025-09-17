import { ExternalLinkIcon } from "@/components/icons/external-link-icon";
import { GitHubIcon } from "@/components/icons/github-icon";

export interface LiveProjectItemProps {
  title: string;
  description: string;
  image: string;
  repo?: string;
  website: string;
}

export const LiveProjectItem = ({
  title,
  description,
  image,
  repo,
  website,
}: LiveProjectItemProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-stone-800">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </div>
      <div className="relative w-full flex flex-col isolate">
        <div className="absolute right-1.5 top-1.5 flex gap-1.5 z-10">
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white inline-grid text-neutral-800 place-content-center hover:bg-neutral-50 transition-colors size-6 rounded shadow-[0px_2px_4px_rgba(28,_25,_23,_0.04),_0px_3px_2px_-2px_rgba(28,_25,_23,_0.14),_0px_0px_0px_1px_rgba(28,_25,_23,_0.06)]"
            >
              <GitHubIcon className="size-4" />
            </a>
          )}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white inline-grid text-neutral-500 hover:text-neutral-800 place-content-center hover:bg-neutral-50 transition-colors size-6 rounded shadow-[0px_2px_4px_rgba(28,_25,_23,_0.04),_0px_3px_2px_-2px_rgba(28,_25,_23,_0.14),_0px_0px_0px_1px_rgba(28,_25,_23,_0.06)]"
          >
            <ExternalLinkIcon className="size-4" />
          </a>
        </div>
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-black/[0.04] after:pointer-events-none after:content-[''] after:absolute after:inset-0 after:transition-colors hover:after:bg-black/10 after:rounded-md after:z-10"
        >
          <img alt={title} src={image} className="w-full object-cover" />
        </a>
      </div>
    </div>
  );
};
