import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AxiosApi } from "../api/axios.api";
import { routes } from "../routes";

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

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { status, message } = useVerifyToken(token);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] font-['Inter',system-ui,sans-serif] px-5">
      <div className="w-full max-w-[480px] bg-white p-10 text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-10">
          <div className="w-8 h-8 rounded-full border-[3px] border-[#575656]" />
          <span className="text-lg font-semibold text-[#525252]">LOGO</span>
        </Link>

        {status === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[15px] text-[#575656]">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="mt-0 mb-4 text-[28px] font-bold text-[#525252] leading-tight">
              Email verified!
            </h1>
            <p className="text-[15px] text-[#575656] leading-relaxed mb-8">
              {message}
            </p>
            <Link
              to={routes.auth.login()}
              className="inline-block px-10 py-3.5 bg-[#525252] text-white text-[15px] font-medium no-underline hover:opacity-90"
            >
              Log in
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mt-0 mb-4 text-[28px] font-bold text-[#525252] leading-tight">
              Something went wrong
            </h1>
            <p className="text-[15px] text-[#575656] leading-relaxed mb-8">
              {message}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to={routes.auth.register()}
                className="inline-block px-10 py-3.5 border border-[#575656] text-[#575656] text-[15px] font-medium no-underline hover:brightness-95"
              >
                Create account
              </Link>
              <Link
                to={routes.auth.login()}
                className="inline-block px-10 py-3.5 bg-[#b3b3b3] text-black text-[15px] font-medium no-underline hover:brightness-95"
              >
                Log in
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
