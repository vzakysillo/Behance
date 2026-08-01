import { ChevronRight } from "lucide-react";
import { Button } from "../ui";

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
      <Button
        variant="primary-icon"
        type="button"
        onClick={onClick}
        disabled={disabled}
        iconRight={<ChevronRight size={24} strokeWidth={2} />}
        className="px-7"
      >
        {label}
      </Button>
    </div>
  );
}
