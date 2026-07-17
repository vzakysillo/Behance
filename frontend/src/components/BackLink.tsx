import { Link } from "react-router-dom";

interface BackLinkProps {
  to: string;
  className?: string;
}

export default function BackLink({ to, className = "" }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={`absolute top-[50px] left-[50px] inline-flex items-center gap-[14px] text-white text-base font-medium leading-[1.2] no-underline max-[1024px]:top-7 max-[1024px]:left-7 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] ${className}`}
      aria-label="Back to home"
    >
      <span className="w-2 h-4 border-l-2 border-b-2 border-current rotate-45" aria-hidden="true" />
      <span>Back</span>
    </Link>
  );
}
