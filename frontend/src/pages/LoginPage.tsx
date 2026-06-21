import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import { routes } from "../routes";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();

  // Already logged in — redirect away
  if (!loading && token && user) {
    return <Navigate to={user.skills?.length ? routes.home() : routes.auth.interests()} replace />;
  }

  const handleSuccess = () => {
    // After LoginForm calls useAuth().login(), the user object is updated in context.
    // We read it via a fresh render; navigate based on skills.
    // Because LoginForm awaits setAuth(token) which calls getMe() internally,
    // by the time onSuccess fires the auth context user is populated.
    navigate(user?.skills?.length ? routes.home() : routes.auth.interests());
  };

  return (
    <main className="min-h-svh w-[min(100vw,1920px)] mx-auto grid grid-cols-[minmax(420px,49.74%)_minmax(460px,1fr)] overflow-hidden bg-white text-[#525252] font-['Inter',system-ui,sans-serif] text-left
                     max-[1024px]:grid-cols-1 max-[1024px]:overflow-visible">
      <section
        className="relative min-h-svh grid place-items-center bg-[#8b8b8b] max-[1024px]:min-h-[240px] max-[560px]:min-h-[180px]"
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
        <p className="text-[#575656] text-[30px] font-normal leading-[1.2] max-[560px]:text-2xl">picture</p>
      </section>

      <section
        className="w-[min(600px,calc(100%-80px))] min-h-svh ml-[clamp(56px,8.49vw,163px)] flex flex-col justify-start pt-[170px] pb-16 box-border
                   max-[1024px]:w-[min(600px,calc(100%-40px))] max-[1024px]:min-h-0 max-[1024px]:mx-auto max-[1024px]:pt-[52px] max-[1024px]:pb-12"
        aria-labelledby="login-title"
      >
        <div className="mb-[45px] max-[560px]:mb-9">
          <h1
            id="login-title"
            className="mt-0 mb-[25px] text-[#525252] text-[50px] font-bold leading-[1.2] max-[1024px]:text-[clamp(34px,8vw,50px)] max-[560px]:mb-[18px]"
          >
            Welcome Home!
          </h1>
          <p className="max-w-[594px] text-[#575656] text-base font-medium leading-[1.35]">
            Please enter your details
          </p>
        </div>

        <LoginForm onSuccess={handleSuccess} />

        <div className="flex justify-center mt-[76px] text-[#575656] max-[560px]:mt-14" aria-hidden="true">
          <p className="text-sm font-normal leading-[1.2] whitespace-nowrap">or continue with</p>
        </div>

        <div className="flex justify-center gap-[29px] mt-[33px]" aria-label="Social login options">
          {(["G", "f", "A"] as const).map((label, i) => (
            <button
              key={i}
              type="button"
              className="w-[38px] h-[38px] border-0 rounded-full bg-[#b3b3b3] text-black text-[15px] font-bold leading-none cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
              aria-label={["Continue with Google", "Continue with Facebook", "Continue with Apple"][i]}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-8 text-[#575656] text-sm font-normal leading-[1.2] text-center">
          Don't have an account?{" "}
          <Link to={routes.auth.register()} className="text-inherit font-medium no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]">
            Sign UP
          </Link>
        </p>
      </section>
    </main>
  );
}
