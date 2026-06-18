import type { IProject } from "../types";

interface Props {
  project: IProject;
  onEdit?: (project: IProject) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
      <h3 className="text-base font-semibold text-gray-800 m-0">{project.name}</h3>
      {project.cover && (
        <img src={project.cover} alt={project.name} className="w-full h-48 object-cover rounded" />
      )}
      {(project.photos ?? []).length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {(project.photos ?? []).map((photo, i) => (
            <img key={i} src={photo} alt={`photo-${i}`} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-auto">
        {onEdit && (
          <button type="button" onClick={() => onEdit(project)}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Edit</button>
        )}
        {onDelete && (
          <button type="button" onClick={() => onDelete(project._id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
        )}
      </div>
    </div>
  );
}
