import { ArrowLeft, Check } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { routes } from "../routes";

export default function ProjectPublishedPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to={routes.profile.projects()} replace />;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden font-['Inter',sans-serif]">
      <section className="mx-auto flex min-h-screen w-full max-w-[1656px] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-9 flex size-28 items-center justify-center rounded-full border-[6px] border-neutral-600 text-neutral-600">
          <Check size={54} strokeWidth={5} />
        </div>

        <h1 className="text-4xl font-bold text-neutral-600 sm:text-5xl">
          Project published successfully!
        </h1>

        <p className="mt-5 max-w-[793px] text-xl font-medium leading-relaxed text-neutral-600">
          Your project is now live and visible to the creative community.
          <br className="hidden sm:block" />
          Start sharing your work, gaining feedback, and inspiring others around the world.
        </p>

        <div className="mt-14 flex w-full max-w-[578px] flex-col-reverse gap-3 sm:flex-row sm:gap-2.5">
          <Link
            to={routes.home()}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2.5 border border-black px-2.5 text-base font-normal text-black transition-colors hover:bg-zinc-100"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Home
          </Link>

          <Link
            to={routes.projectDetail(id)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2.5 bg-zinc-400 px-2.5 text-base font-normal text-black transition-colors hover:bg-zinc-500"
          >
            View Project
          </Link>
        </div>
      </section>
    </div>
  );
}
