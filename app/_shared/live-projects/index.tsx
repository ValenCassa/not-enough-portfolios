import { LiveProjectItem, LiveProjectItemProps } from "./live-project-item";

const projects: LiveProjectItemProps[] = [
  {
    title: "Feedhub",
    description:
      "An issue tracker tool I made to showcase the capabilities of TanStack Start. It's using everyone's favorite tools, like Tailwind, Drizzle, Supabase, better-auth, and Base UI for the primitive components.",
    image: "/feedhub.webp",
    repo: "https://github.com/ValenCassa/tanstack-template",
    website: "https://tanstack-demo.valencassa.dev/",
  },
  {
    title: "Invoice Generator",
    description:
      "I was looking for a way to generate invoices easily back when I was freelancing. I found that most of the tools were either too expensive or too complicated to use. So I made my own.",
    image: "/invoice-generator.webp",
    repo: "https://github.com/ValenCassa/invoice-generator",
    website: "https://invoice-generator.xyz",
  },
  {
    title: "SupaExams",
    description:
      "Wanted to challenge myself to build a product from scratch in just one week. SupaExams is the result of that. It includes database handling, custom design system, authentication, payments, background jobs, OCR, emails and AI-related features with the AI SDK.",
    image: "/supaexams.webp",
    website: "https://supaexams.com",
  },
];

export const LiveProjects = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-sm font-medium text-stone-700">~/ live projects</h2>
      {projects.map((project) => (
        <LiveProjectItem key={project.title} {...project} />
      ))}
    </section>
  );
};
