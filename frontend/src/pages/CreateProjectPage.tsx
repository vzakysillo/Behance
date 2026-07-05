import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { createProject } from "../api/project.api";
import ProjectForm from "../components/ProjectForm";
import { routes } from "../routes";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-black">
      <div className="px-[50px] pt-10 flex items-center">
        <Link
          to={routes.profile.root()}
          className="inline-flex items-center gap-2 text-sm font-normal text-black no-underline hover:text-zinc-500"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          Back
        </Link>
      </div>

      <ProjectForm
        submitLabel="Publish"
        onSubmit={async (data) => {
          const project = await createProject(data);
          navigate(routes.profile.projectPublished(project._id));
        }}
      />
    </div>
  );
}
