import { useNavigate, Link } from "react-router-dom";
import { createProject } from "../api/project.api";
import ProjectForm from "../components/ProjectForm";
import { routes } from "../routes";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="px-[50px] py-4 flex items-center gap-2">
        <Link to={routes.profile.projects()} className="text-sm text-blue-600 hover:underline">
          ← Projects
        </Link>
      </div>

      <ProjectForm
        submitLabel="Publish"
        onSubmit={async (data) => {
          const project = await createProject(data);
          navigate(routes.profile.projectDetail(project._id));
        }}
      />
    </div>
  );
}
