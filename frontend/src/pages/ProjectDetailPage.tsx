import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProject, deleteProject } from "../api/project.api";
import { routes } from "../routes";
import type { IProject } from "../types";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getProject(id)
      .then((p) => { setProject(p); setLoading(false); })
      .catch((err) => { setError(err as string); setLoading(false); });
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      navigate(routes.profile.projects());
    } catch (err) {
      setError(err as string);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div>
      <nav>
        <Link to={routes.profile.projects()}>Projects</Link>
      </nav>

      <h1>{project.name}</h1>

      {project.cover && <img src={project.cover} alt={project.name} />}

      {project.description && <p>{project.description}</p>}

      {(project.photos ?? []).length > 0 && (
        <div>
          {(project.photos ?? []).map((photo, i) => (
            <img key={i} src={photo} alt={`photo-${i}`} />
          ))}
        </div>
      )}

      <button type="button" onClick={handleDelete}>Delete project</button>
    </div>
  );
}
