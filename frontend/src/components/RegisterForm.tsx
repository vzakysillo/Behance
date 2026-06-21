import { useState } from "react";
import type { FormEvent } from "react";
import { register } from "../api/auth.api";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [receiveNews, setReceiveNews] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(userName, email, password);
      setUserName(""); setEmail(""); setPassword("");
      setReceiveNews(false); setAcceptedTerms(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-[44px] px-[14px] py-[10px] box-border border border-[#525252] rounded-none bg-white text-[#525252] text-sm font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] outline-none placeholder:text-[#525252] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]";

  const checkboxClass =
    "w-[14px] h-[14px] mt-[1px] m-0 appearance-none border-[1.5px] border-[#525252] rounded-none bg-white cursor-pointer checked:bg-[#525252] focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]";

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <label className="grid gap-[10px] text-[#525252] text-base font-bold leading-[1.2]">
        <span>Username</span>
        <input className={inputClass} type="text" placeholder="@username" value={userName}
          onChange={(e) => { setUserName(e.target.value); setError(""); }} required />
      </label>

      <label className="grid gap-[10px] text-[#525252] text-base font-bold leading-[1.2]">
        <span>Your Email</span>
        <input className={inputClass} type="email" placeholder="ann@gmail.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }} required />
      </label>

      <label className="grid gap-[10px] text-[#525252] text-base font-bold leading-[1.2]">
        <span>Password</span>
        <input className={`${inputClass} text-[26px] tracking-[1px]`} type="password" placeholder="............" value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }} required />
      </label>

      <div className="grid gap-[13px] pt-1">
        <label className="grid grid-cols-[14px_1fr] items-start gap-4 text-[#525252] text-base font-normal leading-[1.25] max-[560px]:gap-3 max-[560px]:text-sm">
          <input className={checkboxClass} type="checkbox" checked={receiveNews}
            onChange={(e) => setReceiveNews(e.target.checked)} />
          <span>I want to receive latest news and updates from Deshub Community</span>
        </label>
        <label className="grid grid-cols-[14px_1fr] items-start gap-4 text-[#525252] text-base font-normal leading-[1.25] max-[560px]:gap-3 max-[560px]:text-sm">
          <input className={checkboxClass} type="checkbox" checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)} required />
          <span>I agree to the <a href="/terms" className="text-inherit underline">Terms &amp; Privacy Policy</a></span>
        </label>
      </div>

      {error && <p role="alert" className="text-[#b42318] text-sm leading-[1.35]">{error}</p>}

      <button
        className="w-full h-[44px] mt-4 border-0 rounded-none bg-[#a1a1aa] text-black text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Creating account..." : "Get started"}
      </button>
    </form>
  );
}
