import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import LoginForm from "../components/LoginForm";
import BackLink from "../components/BackLink";
import { routes } from "../routes";
import { AuthPageLayout } from "../components/layout/AuthPageLayout";
import { LinkButton, OrDivider, SocialButton } from "../components/ui";

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
          className="relative min-h-svh grid place-items-center bg-[#8b8b8b] max-[1024px]:min-h-[240px] max-[560px]:min-h-[180px]"
          aria-label="Featured project preview"
        >
          <BackLink to={routes.home()} />
          <p className="text-[#575656] text-[30px] font-normal leading-[1.2] max-[560px]:text-2xl">picture</p>
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

          <div className="flex justify-center mt-[76px] max-[560px]:mt-14" aria-hidden="true">
            <OrDivider variant="plain" />
          </div>

          <div className="flex justify-center gap-[29px] mt-[33px]" aria-label="Social login options">
            <SocialButton provider="google" />
            <SocialButton provider="facebook" />
            <SocialButton provider="apple" />
          </div>

          <p className="mt-8 text-[#575656] text-sm font-normal leading-[1.2] text-center">
            Don't have an account?{" "}
            <LinkButton to={routes.auth.register()} variant="text" className="font-medium">
              Sign UP
            </LinkButton>
          </p>
        </section>
      }
    />
  );
}
