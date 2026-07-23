import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateMe } from "../api/user.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui";
import { routes } from "../routes";

const MAX_INTERESTS = 3;

const INTERESTS = [
  "Graphic Design","Typography","Web Design","Photography","Concept Art",
  "Product Design","Advertising","Branding & Identity","Illustration","App Design",
  "Fine Arts","Digital Art","Interior Design","Icon Design","Poster Design",
  "UI/UX Design","Motion Graphics","Game Design","Architecture","Fashion Design",
  "Animation","3D Modeling & Rendering","Packaging Design","Art Direction",
  "Character Design","Calligraphy & Lettering","Landscape Design","Exhibition Design",
  "Street Art","Data Visualization","Storyboarding","Textile Design",
] as const;

export default function InterestsPage() {
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const selectedCount = selected.length;

  const saveMutation = useMutation({
    mutationFn: (skills: string[]) => updateMe({ skills }),
    onSuccess: () => {
      refreshUser();
      navigate(routes.home());
    },
    onError: (err: Error) => {
      setMessage(err.message || "Could not save your interests. Please try again.");
    },
  });

  // Auth loading (ProtectedRoute already guarantees a token exists)
  if (loading) {
    return (
      <main className="h-svh w-[min(100vw,1920px)] mx-auto relative overflow-hidden bg-white text-[#525252] font-['Inter',system-ui,sans-serif] text-center">
        <Spinner />
      </main>
    );
  }

  // Already has skills set — nothing to do here
  if (user?.skills?.length) {
    return <Navigate to={routes.profile.root()} replace />;
  }

  const toggleInterest = (interest: string) => {
    setMessage("");
    setSelected((current) => {
      if (current.includes(interest)) return current.filter((item) => item !== interest);
      if (current.length >= MAX_INTERESTS) { setMessage("Select up to 3 topics."); return current; }
      return [...current, interest];
    });
  };

  const persistAndLeave = (skills: string[]) => {
    setMessage("");
    if (skills.length > 0) {
      saveMutation.mutate(skills);
    } else {
      navigate(routes.home());
    }
  };

  const skip = () => navigate(routes.home());

  return (
    <main className="h-svh w-[min(100vw,1920px)] mx-auto flex flex-col overflow-hidden bg-white text-[#525252] font-['Inter',system-ui,sans-serif] text-center">
      <header className="absolute inset-x-0 top-0 z-[2] pointer-events-none
                         max-[1160px]:static max-[1160px]:flex max-[1160px]:items-center max-[1160px]:justify-between max-[1160px]:gap-6 max-[1160px]:px-10 max-[1160px]:pt-8 max-[1160px]:box-border max-[1160px]:pointer-events-auto">
        <Link
          to={routes.home()}
          className="absolute top-[50px] left-[50px] inline-flex items-center gap-[7px] text-[#575656] text-[32px] font-bold leading-[1.2] no-underline pointer-events-auto
                     max-[1160px]:static max-[640px]:text-2xl focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
        >
          <span className="w-8 h-8 border-4 border-[#575656] rounded-full box-border max-[640px]:w-7 max-[640px]:h-7" aria-hidden="true" />
          <span>LOGO</span>
        </Link>

        <button
          className="absolute top-[158px] right-[50px] w-[142px] h-[45px] border border-[#575656] rounded-none bg-white text-[#575656] text-base font-medium leading-[1.2] cursor-pointer pointer-events-auto hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]
                     max-[1160px]:static max-[640px]:w-24"
          type="button"
          onClick={skip}
        >
          Skip
        </button>
      </header>

      <section
        className="flex-1 min-h-0 w-[min(1210px,calc(100%-80px))] mx-auto flex flex-col items-center pt-[137px] pb-6 box-border overflow-hidden
                   max-[1160px]:pt-[82px]
                   max-[640px]:w-[min(calc(100%-40px),1210px)] max-[640px]:pt-[58px]"
        aria-labelledby="interests-title"
      >
        <h1
          id="interests-title"
          className="m-0 text-[#525252] text-[50px] font-bold leading-[1.2] max-[1160px]:text-[clamp(34px,6vw,50px)] max-[640px]:text-[34px]"
        >
          Help us to personalize your experience
          <br className="max-[640px]:hidden" />
          better on our service!
        </h1>

        <p className="mt-[70px] text-[#575656] text-xl font-medium leading-[1.2] max-[1160px]:mt-[42px] max-[640px]:mt-7 max-[640px]:text-[17px]">
          Select up to 3 topics that interest you
        </p>

        <div
          className="w-full flex-1 min-h-0 overflow-y-auto flex flex-wrap justify-center content-start gap-x-[10px] gap-y-[13px] mt-[42px]
                     max-[640px]:justify-start max-[640px]:gap-[10px]"
          aria-label="Available interests"
        >
          {INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleInterest(interest)}
                className={[
                  "min-h-[59px] px-5 py-[18px] border rounded-none text-white text-base font-semibold leading-[1.2] cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
                  "max-[640px]:min-h-[48px] max-[640px]:px-4 max-[640px]:py-[14px] max-[640px]:text-sm",
                  isSelected ? "bg-[#575656] border-[#575656]" : "bg-[#bdbdbd] border-transparent",
                ].join(" ")}
              >
                {interest}
              </button>
            );
          })}
        </div>

        <div className="shrink-0 mt-auto w-full grid justify-items-end gap-[14px] pt-4
                     max-[640px]:px-5">
          <p className="min-h-[18px] m-0 text-[#575656] text-sm font-medium leading-[1.2]" aria-live="polite">
            {message || (selectedCount > 0 ? `${selectedCount}/${MAX_INTERESTS} selected` : "")}
          </p>
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => persistAndLeave(selected)}
            className="w-[295px] h-[45px] border-0 rounded-none bg-[#b3b3b3] text-black text-base font-medium leading-[1.2] cursor-pointer disabled:cursor-wait disabled:opacity-70 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]
                       max-[640px]:w-full"
          >
            {saveMutation.isPending ? "Saving..." : "Continue"}
          </button>
        </div>
      </section>
    </main>
  );
}
