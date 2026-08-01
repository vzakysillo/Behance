import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { BackLarge, Button } from "../ui";

interface ProjectCreationHeaderProps {
  backTo: string;
}

export function ProjectCreationHeader({ backTo }: ProjectCreationHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-[37px] pt-[43px] shrink-0">
      <BackLarge to={backTo} />

      <Button
        variant="secondary"
        type="button"
        onClick={() => navigate(routes.profile.root())}
        className="px-7"
      >
        Save as draft
      </Button>
    </header>
  );
}
