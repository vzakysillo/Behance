import { ChevronRight } from "lucide-react";

interface ProjectCreationFooterProps {
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
}

export function ProjectCreationFooter({
  disabled,
  onClick,
  label = "Continue",
}: ProjectCreationFooterProps) {
  return (
    <div className="flex justify-end px-[37px] pb-[43px] pt-4 shrink-0">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center gap-[5px] h-[45px] px-7 rounded-[30px] bg-[#6146ea] text-base font-medium text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {label}
        <ChevronRight size={24} strokeWidth={2} className="text-white" />
      </button>
    </div>
  );
}
