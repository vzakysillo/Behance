import { Link } from "react-router-dom";
import { routes } from "../routes";

export default function WelcomePage() {
  return (
    <main className="min-h-svh w-[min(100vw,1920px)] mx-auto relative overflow-hidden bg-white text-[#575656] font-['Inter',system-ui,sans-serif]">
      <header
        className="absolute top-[clamp(24px,4.63vw,50px)] left-[clamp(24px,4.64vw,89px)] z-10"
        aria-label="Site header"
      >
        <Link
          to={routes.home()}
          className="inline-flex items-center gap-[clamp(16px,1.98vw,38px)] text-[#575656] text-[clamp(24px,1.67vw,32px)] font-bold leading-[1.2] no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
          aria-label="Home"
        >
          <span className="w-8 h-8 shrink-0 border-4 border-[#575656] rounded-full box-border" aria-hidden="true" />
          <span>LOGO</span>
        </Link>
      </header>

      <section
        className="w-[min(936px,calc(100%-48px))] min-h-svh mx-auto flex flex-col items-center justify-center px-0 pt-[120px] pb-[72px] box-border text-center"
        aria-labelledby="welcome-title"
      >
        <h1
          id="welcome-title"
          className="max-w-[820px] mt-0 mb-[clamp(40px,4.63vw,89px)] text-[#525252] text-[clamp(52px,5.21vw,100px)] font-bold leading-[1.2]"
        >
          Welcome to our service
        </h1>

        <p className="w-full m-0 text-[#575656] text-base font-medium leading-[1.2]">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          <br />
          <br />
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
          galley of type and scrambled it to make a type specimen book.
          <br />
          It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged.
        </p>

        <div className="w-full grid grid-cols-[minmax(220px,440px)_auto_minmax(220px,440px)] items-center justify-center gap-7 mt-[clamp(40px,4.07vw,78px)]
                        max-[720px]:grid-cols-1 max-[720px]:gap-4 max-[720px]:mt-10">
          <Link
            to={routes.auth.login()}
            className="min-h-[45px] inline-flex items-center justify-center px-6 py-[10px] box-border text-black text-base font-medium leading-[1.2] no-underline bg-[#b3b3b3] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]
                       max-[720px]:w-full"
          >
            Log in
          </Link>

          <span className="text-[#575656] text-base font-medium leading-[1.2]">or</span>

          <Link
            to={routes.auth.register()}
            className="min-h-[45px] inline-flex items-center justify-center px-6 py-[10px] box-border text-[#575656] text-base font-medium leading-[1.2] no-underline border border-[#575656] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]
                       max-[720px]:w-full"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
