import { useState } from "react";
import type { ProjectPayload } from "../api/project.api";

type ProjectFormData = ProjectPayload;

interface ProjectFormProps {
  initial?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({ initial = {}, onSubmit, submitLabel }: ProjectFormProps) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [cover, setCover] = useState(initial.cover || "");
  const [photos] = useState<string[]>(initial.photos || []);
  const [tags, setTags] = useState<string[]>(initial.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState(initial.category || "");
  const [toolsInput, setToolsInput] = useState(initial.toolsUsed?.join(", ") || "");
  const [disableComments, setDisableComments] = useState(initial.disableComments ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 10) { setTags([...tags, t]); setTagInput(""); }
  };

  const removeTag = (i: number) => setTags(tags.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const toolsUsed = toolsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await onSubmit({ name, description, cover, photos, tags, category, toolsUsed, disableComments });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full h-11 px-2.5 py-2 outline outline-1 outline-offset-[-1px] outline-stone-500 text-sm font-normal font-['Inter'] leading-5 text-stone-500 bg-white focus:outline-black focus:text-black placeholder:text-stone-500";

  return (
    <form
      id="project-form"
      onSubmit={handleSubmit}
      className="grid grid-cols-[1fr_1px_726px] min-h-[calc(100vh-73px)]"
    >
      {/* ── Left column: cover upload ── */}
      <div className="flex flex-col items-center justify-start pt-[133px] px-8">
        <p className="self-start ml-[198px] mb-4 text-base font-semibold font-['Inter'] leading-6">
          Project Cover <span className="font-normal">(required)</span>
        </p>

        {/* Cover drop zone */}
        <label className="w-[726px] h-96 border-2 border-zinc-500 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-zinc-700 transition-colors">
          {cover ? (
            <img src={cover} alt="cover preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-xl font-semibold font-['Inter'] uppercase leading-8 text-black">
                Upload cover image
              </span>
              <span className="text-center text-neutral-600 text-base font-light font-['Inter'] leading-snug">
                Minimum size of "808 × 632px"<br />GIF files will not animate.
              </span>
            </>
          )}
          {/* Hidden URL input for now — swap for file upload when backend supports it */}
          <input
            type="url"
            className="sr-only"
            placeholder="https://..."
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
        </label>

        {/* Visible URL input as fallback */}
        <input
          type="url"
          placeholder="Or paste a cover image URL..."
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="mt-3 w-[726px] h-9 px-2.5 outline outline-1 outline-stone-400 text-sm font-['Inter'] placeholder:text-stone-400 focus:outline-black bg-white"
        />
      </div>

      {/* ── Divider ── */}
      <div className="bg-gray-200 self-stretch" />

      {/* ── Right column: project information ── */}
      <div className="flex flex-col px-10 pt-[133px] pb-20 gap-0">
        <p className="text-base font-semibold font-['Inter'] uppercase leading-6 mb-[50px]">
          Project Information
        </p>

        {/* Title */}
        <label className="flex flex-col gap-[10px] mb-[50px]">
          <span className="text-base font-['Inter'] leading-6">
            <strong className="font-semibold">Title</strong>{" "}
            <span className="font-normal">(required)</span>
          </span>
          <input
            className={inputClass}
            placeholder="Give your project a title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        {/* Tags */}
        <label className="flex flex-col gap-[10px] mb-[50px]">
          <span className="text-base font-['Inter'] leading-6">
            <strong className="font-semibold">Tags</strong>{" "}
            <span className="font-normal">(limit of 10)</span>
          </span>
          <div className="relative">
            <input
              className={inputClass}
              placeholder="Add up to 10 keywords to help people discover your project"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-sm font-['Inter']"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(i)} className="text-zinc-400 hover:text-black">×</button>
                </span>
              ))}
            </div>
          )}
        </label>

        {/* Category */}
        <div className="flex flex-col gap-[10px] mb-[50px]">
          <div className="flex items-center justify-between">
            <span className="text-base font-['Inter'] leading-6">
              <strong className="font-semibold">Category</strong>{" "}
              <span className="font-normal">(required, limit of 3)</span>
            </span>
            <button type="button" className="text-neutral-500 text-base font-medium font-['Inter'] leading-6">
              View all
            </button>
          </div>
          <input
            className={inputClass}
            placeholder="How would you categorize this project?"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Tools used */}
        <label className="flex flex-col gap-[10px] mb-[50px]">
          <span className="text-base font-semibold font-['Inter'] leading-6">Tools used</span>
          <input
            className={inputClass}
            placeholder="What software, hardware, or materials did you use? (comma-separated)"
            value={toolsInput}
            onChange={(e) => setToolsInput(e.target.value)}
          />
        </label>

        {/* Description */}
        <label className="flex flex-col gap-[10px] mb-[50px]">
          <span className="text-base font-semibold font-['Inter'] leading-6">Description</span>
          <textarea
            className={`${inputClass} h-28 resize-none items-start`}
            placeholder="Add short description for your project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {/* Comments */}
        <div className="flex flex-col gap-[10px]">
          <span className="text-base font-semibold font-['Inter'] leading-6">Comments</span>
          <label className="flex items-center gap-3">
            <div
              className={`w-4 h-4 outline outline-1 outline-offset-[-0.5px] outline-black flex items-center justify-center cursor-pointer ${disableComments ? "bg-black" : "bg-white"}`}
              onClick={() => setDisableComments(!disableComments)}
            >
              {disableComments && <span className="text-white text-xs leading-none">✓</span>}
            </div>
            <span className="text-base font-normal font-['Inter'] leading-6">
              Disable comments on this project
            </span>
          </label>
        </div>

        {error && <p className="mt-4 text-red-600 text-sm font-['Inter']">{error}</p>}

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={saving}
            className="flex justify-center items-center w-[284px] h-[45px] gap-2.5 p-2.5 bg-[#b3b3b3] text-base font-medium text-black disabled:opacity-50"
          >
            {saving ? "Saving..." : submitLabel || "Publish"}
          </button>
        </div>
      </div>
    </form>
  );
}
