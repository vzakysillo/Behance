import type { ReactNode } from "react";

interface TextLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function TextLink({ href, className = "", children }: TextLinkProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center text-base font-medium leading-[1.2] text-left text-brand-600 no-underline hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] ${className}`}
    >
      {children}
    </a>
  );
}
