import { Link } from "react-router-dom";

interface BackLargeProps {
  to: string;
  className?: string;
}

export function BackLarge({ to, className = "" }: BackLargeProps) {
  return (
    <Link
      to={to}
      aria-label="Back"
      className={`group inline-flex items-center justify-center gap-3.5 no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] ${className}`}
    >
      <svg
        width={9}
        height={16}
        viewBox="0 0 9 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M8 15L1 8L8 1"
          stroke="#6146EA"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors group-hover:stroke-[#4A28C4]"
        />
      </svg>
      <span className="text-xl font-medium leading-[1.2] text-[#6146ea] transition-colors group-hover:text-[#4a28c4]">
        Back
      </span>
    </Link>
  );
}
