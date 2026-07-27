interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "gap-[7px] text-[32px] max-[640px]:text-2xl",
  md: "gap-[10px] text-base",
  lg: "gap-[clamp(16px,1.98vw,38px)] text-[clamp(24px,1.67vw,32px)]",
};

const circleSizeClasses: Record<string, string> = {
  sm: "w-8 h-8 max-[640px]:w-7 max-[640px]:h-7",
  md: "w-[18px] h-[18px]",
  lg: "w-8 h-8",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center font-bold leading-[1.2] no-underline text-[#575656] ${sizeClasses[size]} ${className}`}
    >
      <span
        className={`shrink-0 border-4 border-[#575656] rounded-full box-border ${circleSizeClasses[size]}`}
        aria-hidden="true"
      />
      <span>LOGO</span>
    </span>
  );
}
