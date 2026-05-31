import { useState } from "react";
import type { ProjectPayload } from "../api/project.api";

type ProjectFormData = ProjectPayload;

interface ProjectFormProps {
  initial?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({ initial = {}, onSubmit, submitLabel = "Save" }: ProjectFormProps) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [cover, setCover] = useState(initial.cover || "");
  const [photos, setPhotos] = useState<string[]>(initial.photos || []);
  const [photoInput, setPhotoInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addPhoto = () => {
    const url = photoInput.trim();
    if (url) { setPhotos([...photos, url]); setPhotoInput(""); }
  };

  const removePhoto = (i: number) => setPhotos(photos.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({ name, description, cover, photos });
    } catch (err) {
      setError(err as string);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label htmlFor="cover">Cover URL</label>
        <input id="cover" type="url" placeholder="https://..." value={cover} onChange={(e) => setCover(e.target.value)} />
        {cover && <img src={cover} alt="cover preview" />}
      </div>

      <div>
        <label htmlFor="photo">Photos</label>
        <input
          id="photo"
          type="url"
          placeholder="https://..."
          value={photoInput}
          onChange={(e) => setPhotoInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())}
        />
        <button type="button" onClick={addPhoto}>Add photo</button>
        <ul>
          {photos.map((url, i) => (
            <li key={i}>
              <img src={url} alt={`photo-${i}`} />
              <span>{url}</span>
              <button type="button" onClick={() => removePhoto(i)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={saving}>{saving ? "Saving..." : submitLabel}</button>
    </form>
  );
}
