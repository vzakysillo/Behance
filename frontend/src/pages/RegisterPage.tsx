import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RegisterForm from "../components/RegisterForm";
import { routes } from "../routes";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();

  if (!loading && token && user) {
    return <Navigate to={user.skills?.length ? routes.home() : routes.auth.interests()} replace />;
  }

  return (
    <main className="min-h-svh w-[min(100vw,1920px)] mx-auto grid grid-cols-[minmax(420px,49.74%)_minmax(460px,1fr)] overflow-hidden bg-white text-[#525252] font-['Inter',system-ui,sans-serif] text-left
                     max-[1024px]:grid-cols-1 max-[1024px]:overflow-visible">
      {/* Visual panel */}
      <section
        className="relative min-h-svh grid place-items-center bg-[#71717a] max-[1024px]:min-h-[240px] max-[560px]:min-h-[180px]"
        aria-label="Featured project preview"
      >
        <Link
          to={routes.welcome()}
          className="absolute top-[50px] left-[50px] inline-flex items-center gap-[14px] text-white text-base font-medium leading-[1.2] no-underline max-[1024px]:top-7 max-[1024px]:left-7 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]"
          aria-label="Back to home"
        >
          <span className="w-2 h-4 border-l-2 border-b-2 border-current rotate-45" aria-hidden="true" />
          <span>Back</span>
        </Link>
        <p className="text-[#525252] text-[30px] font-normal leading-[1.2] max-[560px]:text-2xl">picture</p>
      </section>

      {/* Form panel */}
      <section
        className="w-[min(600px,calc(100%-80px))] min-h-svh ml-[clamp(56px,8.49vw,163px)] flex flex-col justify-start pt-[112px] pb-16 box-border
                   max-[1024px]:w-[min(600px,calc(100%-40px))] max-[1024px]:min-h-0 max-[1024px]:mx-auto max-[1024px]:pt-[52px] max-[1024px]:pb-12"
        aria-labelledby="register-title"
      >
        <div className="mb-[45px] max-[560px]:mb-9">
          <h1
            id="register-title"
            className="mt-0 mb-[25px] text-[#525252] text-[48px] font-bold leading-[1.2] max-[1024px]:text-[clamp(34px,8vw,48px)] max-[560px]:mb-[18px]"
          >
            Create an account
          </h1>
          <p className="max-w-[594px] text-[#525252] text-base font-medium leading-[1.35]">
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.
          </p>
        </div>

        <RegisterForm onSuccess={() => navigate(routes.auth.login())} />

        {/* Divider */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-[7px] mt-[75px] text-[#525252] max-[560px]:mt-14" aria-hidden="true">
          <span className="h-px bg-[#525252]" />
          <p className="px-[2px] text-sm font-normal leading-[1.2] whitespace-nowrap">or continue with</p>
          <span className="h-px bg-[#525252]" />
        </div>

        {/* Social buttons */}
        <div className="flex justify-center gap-[31px] mt-[34px]" aria-label="Social sign up options">
          {(["G", "f", "A"] as const).map((label, i) => (
            <button
              key={i}
              type="button"
              className="w-9 h-9 border-0 rounded-full bg-[#a1a1aa] text-black text-[15px] font-bold leading-none cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
              aria-label={["Continue with Google", "Continue with Facebook", "Continue with Apple"][i]}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-[31px] text-[#525252] text-sm font-normal leading-[1.2] text-center">
          Already have an account?{" "}
          <Link to={routes.auth.login()} className="text-inherit font-medium no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]">
            Log IN
          </Link>
        </p>
      </section>
    </main>
  );
}
