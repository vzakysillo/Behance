import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import RegisterForm from "../components/RegisterForm";
import BackLink from "../components/BackLink";
import { routes } from "../routes";
import { AuthPageLayout } from "../components/layout/AuthPageLayout";
import { LinkButton, OrDivider, SocialButton } from "../components/ui";

export default function RegisterPage() {
  const navigate = useNavigate();
  const redirect = useAuthRedirect();

  if (redirect) return redirect;

  return (
    <AuthPageLayout
      visualPanel={
        <section
          className="relative min-h-svh grid place-items-center bg-[#71717a] max-[1024px]:min-h-[240px] max-[560px]:min-h-[180px]"
          aria-label="Featured project preview"
        >
          <BackLink to={routes.home()} />
          <p className="text-[#525252] text-[30px] font-normal leading-[1.2] max-[560px]:text-2xl">picture</p>
        </section>
      }
      formPanel={
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

          <div className="mt-[75px] max-[560px]:mt-14">
            <OrDivider />
          </div>

          <div className="flex justify-center gap-[31px] mt-[34px]" aria-label="Social sign up options">
            <SocialButton provider="google" className="w-9 h-9 bg-[#a1a1aa]" />
            <SocialButton provider="facebook" className="w-9 h-9 bg-[#a1a1aa]" />
            <SocialButton provider="apple" className="w-9 h-9 bg-[#a1a1aa]" />
          </div>

          <p className="mt-[31px] text-[#525252] text-sm font-normal leading-[1.2] text-center">
            Already have an account?{" "}
            <LinkButton to={routes.auth.login()} variant="text" className="font-medium">
              Log IN
            </LinkButton>
          </p>
        </section>
      }
    />
  );
}
