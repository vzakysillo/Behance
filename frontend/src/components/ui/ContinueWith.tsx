import { AppleIcon, GoogleIcon } from "./BrandIcons";

interface ContinueWithProps {
  prompt: string;
  cta: string;
  ctaTo: string;
  className?: string;
}

export function ContinueWith({ prompt, cta, ctaTo, className = "" }: ContinueWithProps) {
  return (
    <div className={`max-w-[526px] mx-auto ${className}`}>
      <div className="flex items-center gap-[7px] text-[#1b1b1b]" aria-hidden="true">
        <span className="flex-1 h-px bg-[#1b1b1b]" />
        <p className="m-0 text-base font-normal leading-none whitespace-nowrap">or continue with</p>
        <span className="flex-1 h-px bg-[#1b1b1b]" />
      </div>

      <div className="flex justify-center gap-[29px] mt-[34px]" aria-label="Social login options">
        <button
          type="button"
          aria-label="Continue with Google"
          className="w-[43px] h-[43px] p-0 border-0 bg-transparent cursor-pointer rounded-full hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
        >
          <GoogleIcon />
        </button>
        <button
          type="button"
          aria-label="Continue with Apple"
          className="w-[43px] h-[43px] p-0 border-0 bg-transparent cursor-pointer rounded-full hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
        >
          <AppleIcon />
        </button>
      </div>

      <p className="m-0 mt-[28px] text-base font-normal leading-[1.2] text-center text-[#1b1b1b]">
        {prompt}{" "}
        <a href={ctaTo} className="text-base font-medium text-brand-700 hover:text-brand-600 no-underline">
          {cta}
        </a>
      </p>
    </div>
  );
}
