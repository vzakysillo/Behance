import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import LoginForm from "../components/LoginForm";
import { routes } from "../routes";
import { AuthPageLayout } from "../components/layout/AuthPageLayout";
import { AuthGradient, ContinueWith, Logo } from "../components/ui";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const redirect = useAuthRedirect();

  if (redirect) return redirect;

  const handleSuccess = () => {
    navigate(user?.skills?.length ? routes.home() : routes.auth.interests());
  };

  return (
    <AuthPageLayout
      visualPanel={
        <section
          className="relative min-h-svh grid place-items-center overflow-hidden max-[1024px]:min-h-[240px] max-[560px]:min-h-[180px]"
          aria-label="Featured project preview"
        >
          <AuthGradient className="absolute inset-0" />
          <header
            className="absolute top-[clamp(24px,4.63vw,50px)] left-[clamp(24px,4.64vw,89px)] z-10"
            aria-label="Site header"
          >
            <Link
              to={routes.home()}
              className="inline-flex items-center gap-[clamp(16px,1.98vw,38px)] text-white text-[clamp(24px,1.67vw,32px)] font-bold leading-[1.2] no-underline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]"
              aria-label="Home"
            >
              <Logo size="lg" variant="white" />
            </Link>
          </header>
          <div className="absolute left-[clamp(24px,3.5vw,64px)] bottom-[clamp(24px,3.5vw,64px)] max-w-[520px] z-10 text-white max-[1024px]:hidden">
            <p className="m-0 text-base font-normal leading-[1.4] text-white">
              Log in to continue building your portfolio and finding new creative opportunities
            </p>
            <h2 className="mt-4 m-0 text-[26px] font-medium leading-[1.3] text-white">
              Discover inspiring projects, explore high-quality design resources, and connect with creators from around the world.
            </h2>
          </div>
        </section>
      }
      formPanel={
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

          <ContinueWith
            className="mt-[50px] max-[560px]:mt-10"
            prompt="Don't have an account?"
            cta="Sign UP"
            ctaTo={routes.auth.register()}
          />
        </section>
      }
    />
  );
}
