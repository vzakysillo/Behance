import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateMe } from "../api/user.api";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../routes";
import { Button, Logo, ToggleButton, Spinner, BackLarge } from "../components/ui";

const MAX_INTERESTS = 3;

const DESIGN_LEFT = 221;
const DESIGN_TOP = 397;
const DESIGN_WIDTH = 1490;
const DESIGN_HEIGHT = 400;

interface InterestLayout {
  label: string;
  left: number;
  top: number;
}

const INTEREST_LAYOUT: InterestLayout[] = [
  { label: "Calligraphy & Lettering", left: 303, top: 397 },
  { label: "Digital Art", left: 586, top: 397 },
  { label: "Landscape Design", left: 750, top: 397 },
  { label: "Exhibition Design", left: 994, top: 397 },
  { label: "Street Art", left: 1226, top: 397 },
  { label: "Data Visualisation", left: 1388, top: 397 },

  { label: "Typography", left: 289, top: 481 },
  { label: "Photography", left: 469, top: 481 },
  { label: "Character Design", left: 659, top: 481 },
  { label: "Textile Design", left: 893, top: 481 },
  { label: "UI/UX", left: 1095, top: 481 },
  { label: "Motion Graphics", left: 1222, top: 481 },
  { label: "Game Design", left: 1446, top: 481 },

  { label: "Logo Design", left: 221, top: 565 },
  { label: "Advertising", left: 408, top: 565 },
  { label: "Illustration", left: 585, top: 565 },
  { label: "App Design", left: 756, top: 565 },
  { label: "Fine Arts", left: 934, top: 565 },
  { label: "Packaging Design", left: 1088, top: 565 },
  { label: "Poster Design", left: 1327, top: 565 },
  { label: "Icon Design", left: 1529, top: 565 },

  { label: "3D Modeling & Rendering", left: 325, top: 649 },
  { label: "Interior Design", left: 633, top: 649 },
  { label: "Fashion Design", left: 841, top: 649 },
  { label: "Animation", left: 1055, top: 649 },
  { label: "Storyboarding", left: 1220, top: 649 },
  { label: "Web Design", left: 1424, top: 649 },

  { label: "Branding & Identity", left: 348, top: 733 },
  { label: "Architecture", left: 597, top: 733 },
  { label: "Graphic Design", left: 783, top: 733 },
  { label: "Concept Art", left: 996, top: 733 },
  { label: "Product Design", left: 1179, top: 733 },
  { label: "Art Direction", left: 1393, top: 733 },
];

export default function InterestsPage() {
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const selectedCount = selected.length;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setScale(Math.min(1, rect.width / DESIGN_WIDTH, rect.height / DESIGN_HEIGHT));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      <main className="h-svh w-[min(100vw,1920px)] mx-auto relative overflow-hidden bg-white text-[#525252] font-sans text-center">
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
    <main className="h-svh w-[min(100vw,1920px)] mx-auto flex flex-col overflow-hidden bg-white text-[#525252] font-sans text-center">
      <header className="absolute inset-x-0 top-0 z-[2] pointer-events-none
                         max-[1160px]:static max-[1160px]:flex max-[1160px]:items-center max-[1160px]:justify-between max-[1160px]:gap-6 max-[1160px]:px-10 max-[1160px]:pt-8 max-[1160px]:box-border max-[1160px]:pointer-events-auto">
        <Link
          to={routes.home()}
          className="absolute top-[50px] left-[50px] inline-flex items-center gap-[7px] text-[#575656] text-[32px] font-bold leading-[1.2] no-underline pointer-events-auto
                     max-[1160px]:static max-[640px]:text-2xl focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
        >
          <Logo size="sm" />
        </Link>

        <Button
          variant="secondary"
          type="button"
          onClick={skip}
          className="absolute top-[158px] right-[50px] w-[142px] pointer-events-auto
                     max-[1160px]:static max-[640px]:w-24"
        >
          Skip
        </Button>
      </header>

      <section
        className="flex-1 min-h-0 w-[min(1478px,calc(100%-80px))] mx-auto flex flex-col items-center pt-[137px] pb-6 box-border overflow-hidden
                   max-[1160px]:pt-[82px]
                   max-[640px]:w-[min(calc(100%-40px),1478px)] max-[640px]:pt-[58px]"
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
          ref={wrapperRef}
          className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden mt-[42px]
                     max-[640px]:overflow-y-auto"
          aria-label="Available interests"
        >
          <div
            className="relative"
            style={{
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              flexShrink: 0,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            {INTEREST_LAYOUT.map(({ label, left, top }) => {
              const isSelected = selected.includes(label);
              return (
                <ToggleButton
                  key={label}
                  selected={isSelected}
                  aria-pressed={isSelected}
                  onClick={() => toggleInterest(label)}
                  className="absolute"
                  style={{
                    left: `${left - DESIGN_LEFT}px`,
                    top: `${top - DESIGN_TOP}px`,
                  }}
                >
                  {label}
                </ToggleButton>
              );
            })}
          </div>
        </div>

        <div className="shrink-0 mt-auto w-full flex items-end justify-between gap-4 pt-4
                     max-[640px]:px-5">
          <BackLarge to={routes.home()} />

          <div className="grid justify-items-end gap-[14px]">
            <p className="min-h-[18px] m-0 text-[#575656] text-sm font-medium leading-[1.2]" aria-live="polite">
              {message || (selectedCount > 0 ? `${selectedCount}/${MAX_INTERESTS} selected` : "")}
            </p>
            <Button
              variant="primary-icon"
              type="button"
              disabled={saveMutation.isPending || selected.length !== MAX_INTERESTS}
              onClick={() => persistAndLeave(selected)}
              className="w-[393px] disabled:cursor-wait disabled:opacity-70
                         max-[640px]:w-full"
              iconRight={
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              {saveMutation.isPending ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
