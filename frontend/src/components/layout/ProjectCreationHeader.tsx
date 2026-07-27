import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { routes } from "../../routes";

interface ProjectCreationHeaderProps {
  backTo: string;
}

export function ProjectCreationHeader({ backTo }: ProjectCreationHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-[37px] pt-[43px] shrink-0">
      <button
        onClick={() => navigate(backTo)}
        className="inline-flex items-center gap-3.5 text-base font-medium text-[#6146ea] hover:opacity-80"
      >
        <ChevronLeft size={16} strokeWidth={2} className="text-[#6146ea]" />
        Back
      </button>

      <button
        onClick={() => navigate(routes.profile.root())}
        className="flex items-center justify-center h-[45px] px-7 text-base font-medium text-[#6146ea] rounded-[30px] border border-[#6146ea] hover:bg-[#6146ea]/5"
      >
        Save as draft
      </button>
    </header>
  );
}
