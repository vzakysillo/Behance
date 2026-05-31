import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeedProjects } from "../api/project.api";
import ProjectCard from "../components/ProjectCard";
import { routes } from "../routes";
import type { IProject } from "../types";

export default function HomePage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeedProjects()
      .then(setProjects)
      .catch((err) => setError(err as string))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <nav>
        <Link to={routes.profile.root()}>Profile</Link>
      </nav>

      <h1>Projects</h1>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link to={routes.projectDetail(project._id)}>
                <ProjectCard project={project} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
