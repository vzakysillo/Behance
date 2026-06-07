import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getFeedProjects } from "../api/project.api";
import ProjectCard from "../components/ProjectCard";
import { routes } from "../routes";
import type { IProject } from "../types";

type SortOption = "popular" | "newest";

const getProjectTime = (project: IProject) => {
  if (project.createdAt) {
    return new Date(project.createdAt).getTime();
  }

  return parseInt(project._id.substring(0, 8), 16) * 1000;
};

export default function HomePage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeedProjects()
      .then(setProjects)
      .catch((err) => setError(err as string))
      .finally(() => setLoading(false));
  }, []);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (sortBy === "popular") {
        return (
          (b.likesCount ?? 0) - (a.likesCount ?? 0) ||
          getProjectTime(b) - getProjectTime(a)
        );
      }

      return getProjectTime(b) - getProjectTime(a);
    });
  }, [projects, sortBy]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <nav>
        <Link to={routes.profile.root()}>Profile</Link>
      </nav>

      <h1>Projects</h1>

      <label>
        Sort by{" "}
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
        </select>
      </label>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {sortedProjects.map((project) => (
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
