import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AxiosApi } from "../api/axios.api";
import { routes } from "../routes";
import { AuthGradient, LinkButton, Logo, Spinner } from "../components/ui";
import { AuthPageLayout } from "../components/layout/AuthPageLayout";
import { CheckCircle2, XCircle } from "lucide-react";

type Status = "loading" | "success" | "error";

function useVerifyToken(token: string | null) {
  const [status, setStatus] = useState<Status>(() => (token ? "loading" : "error"));
  const [message, setMessage] = useState(() =>
    token ? "Verifying your email..." : "No verification link provided."
  );
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    AxiosApi.get(`/auth/verify?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Invalid or expired verification link.");
      });
  }, [token]);

  return { status, message };
}

const visualPanel = (
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
        Confirm your email to activate your account and start building your portfolio today.
      </p>
      <h2 className="mt-4 m-0 text-[26px] font-medium leading-[1.3] text-white">
        Join a community where creators showcase their work, connect with peers, and discover new opportunities.
      </h2>
    </div>
  </section>
);

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { status, message } = useVerifyToken(token);

  let content: React.ReactNode;
  let title: string;

  if (status === "loading") {
    title = "Verifying your email";
    content = (
      <>
        <Spinner className="min-h-0 mb-6 justify-start" />
        <p className="mt-0 mb-8 text-[#575656] text-base font-medium leading-[1.35]">{message}</p>
      </>
    );
  } else if (status === "success") {
    title = "Email verified!";
    content = (
      <>
        <CheckCircle2 size={64} strokeWidth={1.5} className="text-brand-600 mb-7" aria-hidden="true" />
        <p className="mt-0 mb-10 text-[#575656] text-base font-medium leading-[1.35]">{message}</p>
        <LinkButton to={routes.auth.login()} variant="primary" className="px-10">
          Log in
        </LinkButton>
      </>
    );
  } else {
    title = "Something went wrong";
    content = (
      <>
        <XCircle size={64} strokeWidth={1.5} className="text-error mb-7" aria-hidden="true" />
        <p className="mt-0 mb-10 text-[#575656] text-base font-medium leading-[1.35]">{message}</p>
        <div className="flex gap-4">
          <LinkButton to={routes.auth.register()} variant="secondary" className="px-10">
            Create account
          </LinkButton>
          <LinkButton to={routes.auth.login()} variant="primary" className="px-10">
            Log in
          </LinkButton>
        </div>
      </>
    );
  }

  return (
    <AuthPageLayout
      visualPanel={visualPanel}
      formPanel={
        <section
          className="w-[min(600px,calc(100%-80px))] min-h-svh ml-[clamp(56px,8.49vw,163px)] flex flex-col justify-start pt-[170px] pb-16 box-border
                     max-[1024px]:w-[min(600px,calc(100%-40px))] max-[1024px]:min-h-0 max-[1024px]:mx-auto max-[1024px]:pt-[52px] max-[1024px]:pb-12"
          aria-labelledby="verify-title"
        >
          <div className="mb-[45px] max-[560px]:mb-9">
            <h1
              id="verify-title"
              className="mt-0 mb-[25px] text-[#525252] text-[48px] font-bold leading-[1.2] max-[1024px]:text-[clamp(34px,8vw,48px)] max-[560px]:mb-[18px]"
            >
              {title}
            </h1>
            {content}
          </div>
        </section>
      }
    />
  );
}
