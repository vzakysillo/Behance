import { Link } from "react-router-dom";
import { routes } from "../routes";
import { Logo, LinkButton } from "../components/ui";

export default function WelcomePage() {
  return (
    <main className="min-h-svh w-[min(100vw,1920px)] mx-auto relative overflow-hidden bg-white text-[#575656] font-sans">
      <header
        className="absolute top-[clamp(24px,4.63vw,50px)] left-[clamp(24px,4.64vw,89px)] z-10"
        aria-label="Site header"
      >
        <Link
          to={routes.home()}
          className="inline-flex items-center gap-[clamp(16px,1.98vw,38px)] text-[#575656] text-[clamp(24px,1.67vw,32px)] font-bold leading-[1.2] no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
          aria-label="Home"
        >
          <Logo size="lg" />
        </Link>
      </header>

      <section
        className="w-[min(936px,calc(100%-48px))] min-h-svh mx-auto flex flex-col items-center justify-center px-0 pt-[120px] pb-[72px] box-border text-center"
        aria-labelledby="welcome-title"
      >
        <h1
          id="welcome-title"
          className="flex flex-col items-center max-w-full mt-0 mb-[clamp(40px,4.63vw,89px)] text-[#525252] text-[clamp(52px,5.21vw,100px)] font-bold leading-[1.2]"
        >
          <span className="whitespace-nowrap">Welcome to</span>
          <span className="whitespace-nowrap">Moddo Community</span>
        </h1>

        <p className="w-full m-0 text-[#575656] text-base font-medium leading-[1.2]">
          A creative platform where designers showcase their work, discover new ideas, connect with professionals, and turn their creativity into new opportunities.
        </p>

        <div className="w-full grid grid-cols-[minmax(220px,440px)_auto_minmax(220px,440px)] items-center justify-center gap-7 mt-[clamp(40px,4.07vw,78px)]
                        max-[720px]:grid-cols-1 max-[720px]:gap-4 max-[720px]:mt-10">
          <LinkButton
            to={routes.auth.login()}
            variant="primary"
            className="max-[720px]:w-full"
          >
            Log in
          </LinkButton>

          <span className="text-[#575656] text-base font-medium leading-[1.2]">or</span>

          <LinkButton
            to={routes.auth.register()}
            variant="secondary"
            className="max-[720px]:w-full"
          >
            Create account
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
