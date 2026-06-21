import { useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getProjects, deleteProject } from "../api/project.api";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";

export default function ProjectsPage() {
  const { data: projects, loading, error, reload } = useAsync(getProjects);
  const [actionError, setActionError] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setActionError("");
    try {
      await deleteProject(id);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete project.");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <nav className="mb-4">
        <Link to={routes.profile.root()} className="text-sm text-blue-600 hover:underline">
          Profile
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Projects</h1>

      <Link
        to={routes.profile.projectNew()}
        className="inline-block mb-6 px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        New project
      </Link>

      {actionError && <p className="text-red-600 text-sm mb-4">{actionError}</p>}

      {(projects?.length ?? 0) === 0 ? (
        <p className="text-gray-500">No projects yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects!.map((project) => (
            <li
              key={project._id}
              className="flex items-center justify-between border border-gray-200 rounded px-4 py-3"
            >
              <Link
                to={routes.profile.projectDetail(project._id)}
                className="text-gray-800 font-medium hover:underline"
              >
                {project.name}
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(project._id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
