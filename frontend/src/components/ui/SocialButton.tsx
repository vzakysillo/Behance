interface SocialButtonProps {
  provider: "google" | "facebook" | "apple";
  onClick?: () => void;
  className?: string;
}

const providerConfig: Record<string, { label: string; ariaLabel: string; bgClass: string }> = {
  google: {
    label: "G",
    ariaLabel: "Continue with Google",
    bgClass: "bg-[#b3b3b3]",
  },
  facebook: {
    label: "f",
    ariaLabel: "Continue with Facebook",
    bgClass: "bg-[#b3b3b3]",
  },
  apple: {
    label: "A",
    ariaLabel: "Continue with Apple",
    bgClass: "bg-[#b3b3b3]",
  },
};

export function SocialButton({ provider, onClick, className = "" }: SocialButtonProps) {
  const config = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[38px] h-[38px] border-0 rounded-full ${config.bgClass} text-black text-[15px] font-bold leading-none cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] ${className}`}
      aria-label={config.ariaLabel}
    >
      {config.label}
    </button>
  );
}
