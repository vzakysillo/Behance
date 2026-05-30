import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../api/project.api";
import { routes } from "../routes";
import type { IProject } from "../types";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { navigate(routes.auth.login()); return; }
    getProjects()
      .then(setProjects)
      .catch((err) => setError(err as string))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      setError(err as string);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <nav>
        <Link to={routes.profile.root()}>Profile</Link>
      </nav>

      <h1>My Projects</h1>

      <Link to={routes.profile.projectNew()}>New project</Link>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link to={routes.profile.projectDetail(project._id)}>{project.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
