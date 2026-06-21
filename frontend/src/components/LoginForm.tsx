import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

interface LoginFormProps {
  onSuccess?: () => void | Promise<void>;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const token = await login(email, password);
      await setAuth(token);
      await onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-[45px] px-[15px] py-[10px] box-border border border-[#575656] rounded-none bg-white text-[#575656] text-sm font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] outline-none placeholder:text-[#575656] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]";

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <label className="grid gap-[10px] text-[#575656] text-base font-bold leading-[1.2]">
        <span>Email</span>
        <input
          className={inputClass}
          type="text"
          placeholder="user@mail.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          required
        />
      </label>

      <label className="grid gap-[10px] text-[#575656] text-base font-bold leading-[1.2]">
        <span>Password</span>
        <input
          className={`${inputClass} text-[26px] tracking-[1px]`}
          type="password"
          placeholder="............"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          required
        />
      </label>

      <div className="flex items-center justify-between gap-[18px] -mt-2 text-[#575656] text-base font-normal leading-[1.25] max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-[14px] max-[560px]:text-sm">
        <label className="inline-grid grid-cols-[15px_1fr] items-center gap-[15px]">
          <input
            className="w-[15px] h-[15px] m-0 appearance-none border-[1.5px] border-[#575656] rounded-none bg-white cursor-pointer checked:bg-[#575656] focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <a href="/forgot-password" className="text-inherit no-underline whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]">
          Forget password?
        </a>
      </div>

      {error && <p role="alert" className="text-[#b42318] text-sm leading-[1.35]">{error}</p>}

      <button
        className="w-full h-[45px] mt-[17px] border-0 rounded-none bg-[#b3b3b3] text-black text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
