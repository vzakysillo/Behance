import { useNavigate, Link } from "react-router-dom";
import { createProject } from "../api/project.api";
import ProjectForm from "../components/ProjectForm";
import { routes } from "../routes";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  return (
    <div>
      <nav>
        <Link to={routes.profile.projects()}>← Projects</Link>
      </nav>

      <h1>New Project</h1>

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
