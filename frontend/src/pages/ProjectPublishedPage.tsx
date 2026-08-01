import { Check, ChevronLeft, Sparkle } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { routes } from "../routes";
import { LinkButton } from "../components/ui";

const SPARKLES = [
  { size: 14, top: 24, left: -2 },
  { size: 10, top: 4, left: 130 },
  { size: 9, top: 58, left: -8 },
  { size: 13, top: 66, left: 142 },
  { size: 12, top: 120, left: 12 },
  { size: 17, top: 134, left: 98 },
  { size: 8, top: -14, left: 74 },
  { size: 11, top: 98, left: 150 },
  { size: 10, top: -6, left: 22 },
];

export default function ProjectPublishedPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to={routes.profile.root()} replace />;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-[1656px] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-9 flex size-40 items-center justify-center">
          <div className="flex size-28 items-center justify-center rounded-full border-[6px] border-brand-600 text-brand-600">
            <Check size={54} strokeWidth={5} />
          </div>
          {SPARKLES.map((s, i) => (
            <Sparkle
              key={i}
              size={s.size}
              fill="currentColor"
              strokeWidth={1}
              className="absolute text-brand-600"
              style={{ top: s.top, left: s.left }}
            />
          ))}
        </div>

        <h1 className="text-4xl font-bold text-ink sm:text-5xl">
          Project published successfully!
        </h1>

        <p className="mt-5 max-w-[793px] text-xl font-medium leading-relaxed text-ink">
          Your project is now live and visible to the creative community.
          <br className="hidden sm:block" />
          Start sharing your work, gaining feedback, and inspiring others around the world.
        </p>

        <div className="mt-14 flex w-full max-w-[816px] flex-col gap-3 sm:flex-row sm:justify-center sm:gap-2.5">
          <LinkButton
            to={routes.home()}
            variant="secondary"
            icon={<ChevronLeft size={24} strokeWidth={2} />}
            className="w-full sm:w-[393px]"
          >
            Back to Home
          </LinkButton>

          <LinkButton
            to={routes.projectDetail(id)}
            variant="primary"
            className="w-full sm:w-[393px]"
          >
            View Project
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
