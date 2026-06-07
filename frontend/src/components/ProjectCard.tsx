import type { IProject } from "../types";

interface Props {
  project: IProject;
  onEdit?: (project: IProject) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  return (
    <div>
      <h3>{project.name}</h3>
      {project.cover && <img src={project.cover} alt={project.name} />}
      {/* {project.description && <p>{project.description}</p>} */}
      {(project.photos ?? []).length > 0 && (
        <div>
          {(project.photos ?? []).map((photo, i) => (
            <img key={i} src={photo} alt={`photo-${i}`} />
          ))}
        </div>
      )}
      {onEdit && <button type="button" onClick={() => onEdit(project)}>Edit</button>}
      {onDelete && <button type="button" onClick={() => onDelete(project._id)}>Delete</button>}
    </div>
  );
}
