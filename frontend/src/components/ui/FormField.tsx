import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, children, className = "" }: FormFieldProps) {
  return (
    <label className={`grid gap-[10px] text-[#525252] text-base font-bold leading-[1.2] ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
