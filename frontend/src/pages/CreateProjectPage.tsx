import { useNavigate, Link } from "react-router-dom";
import { createProject } from "../api/project.api";
import ProjectForm from "../components/ProjectForm";
import { routes } from "../routes";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <nav className="mb-4">
        <Link to={routes.profile.projects()} className="text-sm text-blue-600 hover:underline">
          ← Projects
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">New Project</h1>

      <ProjectForm
        submitLabel="Create project"
        onSubmit={async (data) => {
          const project = await createProject(data);
          navigate(routes.profile.projectDetail(project._id));
        }}
      />
    </div>
  );
}
