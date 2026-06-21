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

  const addPhoto = () => { const url = photoInput.trim(); if (url) { setPhotos([...photos, url]); setPhotoInput(""); } };
  const removePhoto = (i: number) => setPhotos(photos.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      await onSubmit({ name, description, cover, photos });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full text-sm outline-none focus:border-gray-500";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <label className={labelClass}>
        Name
        <input className={inputClass} id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label className={labelClass}>
        Description
        <textarea className={`${inputClass} min-h-[100px] resize-y`} id="description" value={description}
          onChange={(e) => setDescription(e.target.value)} />
      </label>

      <label className={labelClass}>
        Cover URL
        <input className={inputClass} id="cover" type="url" placeholder="https://..." value={cover}
          onChange={(e) => setCover(e.target.value)} />
        {cover && <img src={cover} alt="cover preview" className="w-full h-40 object-cover rounded" />}
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Photos</span>
        <div className="flex gap-2">
          <input className={`${inputClass} flex-1`} id="photo" type="url" placeholder="https://..." value={photoInput}
            onChange={(e) => setPhotoInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())} />
          <button type="button" onClick={addPhoto} className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">Add photo</button>
        </div>
        <ul className="flex flex-col gap-2 mt-1">
          {photos.map((url, i) => (
            <li key={i} className="flex items-center gap-2">
              <img src={url} alt={`photo-${i}`} className="w-16 h-16 object-cover rounded" />
              <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
              <button type="button" onClick={() => removePhoto(i)}
                className="text-sm text-red-500 hover:text-red-700 shrink-0">Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={saving}
        className="px-4 py-2 bg-gray-800 text-white text-sm rounded disabled:opacity-50 hover:bg-gray-700">
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
