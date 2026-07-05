import { useEffect, useState } from "react";
import type { ProjectPayload } from "../api/project.api";
import { uploadImage } from "../api/upload.api";

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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initial.cover || "");
  const [photos] = useState<string[]>(initial.photos || []);
  const [tags, setTags] = useState<string[]>(initial.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState(initial.category || "");
  const [toolsInput, setToolsInput] = useState(initial.toolsUsed?.join(", ") || "");
  const [disableComments, setDisableComments] = useState(initial.disableComments ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && tags.length < 10 && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (i: number) => setTags(tags.filter((_, idx) => idx !== i));

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(cover);
      return;
    }

    const previewUrl = URL.createObjectURL(coverFile);
    setCoverPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [cover, coverFile]);

  const handleCoverSelect = (file: File | undefined) => {
    if (!file) return;

    setCoverFile(file);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let coverUrl = cover;
      if (coverFile) {
        coverUrl = await uploadImage(coverFile);
        setCover(coverUrl);
        setCoverFile(null);
      }

      const toolsUsed = toolsInput
        .split(",")
        .map((tool) => tool.trim())
        .filter(Boolean);

      await onSubmit({ name, description, cover: coverUrl, photos, tags, category, toolsUsed, disableComments });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full h-11 px-2.5 border border-[#a2a0a0] text-sm font-normal font-['Inter'] leading-5 text-black bg-white outline-none placeholder:text-[#676767] focus:border-black";

  return (
    <form
      id="project-form"
      onSubmit={handleSubmit}
      className="grid grid-cols-[minmax(520px,1fr)_minmax(420px,726px)] gap-[120px] px-[120px] pt-[92px] pb-20 min-h-[calc(100vh-80px)] bg-white text-black font-['Inter',sans-serif]"
    >
      <section className="flex flex-col pt-[88px]">
        <p className="mb-4 text-sm font-semibold leading-5 text-black">
          Project Cover <span className="font-normal">(required)</span>
        </p>

        <label className="w-full max-w-[726px] h-96 border-2 border-dashed border-[#a2a0a0] flex flex-col items-center justify-center gap-[62px] cursor-pointer hover:border-black transition-colors">
          {coverPreview ? (
            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-xl font-semibold uppercase leading-8 text-black">
                Upload cover image
              </span>
              <span className="text-center text-sm font-normal leading-5 text-[#676767]">
                Minimum size of "808 x 632px"
                <br />
                GIF files will not animate.
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              handleCoverSelect(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>

        <input
          type="url"
          placeholder="Or paste a cover image URL..."
          value={cover}
          onChange={(e) => {
            setCover(e.target.value);
            setCoverFile(null);
          }}
          className="mt-3 w-full max-w-[726px] h-9 px-2.5 border border-[#a2a0a0] text-sm font-['Inter'] text-black placeholder:text-[#676767] outline-none focus:border-black bg-white"
        />
      </section>

      <section className="flex flex-col">
        <p className="text-sm font-semibold uppercase leading-5 mb-8 text-black">
          Project Information
        </p>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm leading-5 text-black">
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

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm leading-5 text-black">
            <strong className="font-semibold">Tags</strong>{" "}
            <span className="font-normal">(limit of 10)</span>
          </span>
          <input
            className={inputClass}
            placeholder="Add up to 10 keywords to help people discover your project"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag, i) => (
                <span key={tag} className="inline-flex items-center gap-2 h-7 px-2 bg-[#f0efef] text-sm text-black">
                  {tag}
                  <button type="button" onClick={() => removeTag(i)} className="text-zinc-500 hover:text-black">
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </label>

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm leading-5 text-black">
              <strong className="font-semibold">Category</strong>{" "}
              <span className="font-normal">(required, limit of 3)</span>
            </span>
            <button type="button" className="text-[#676767] text-sm font-normal hover:text-black">
              View all
            </button>
          </div>
          <input
            className={inputClass}
            placeholder="How would you categorize this project?"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm font-semibold leading-5 text-black">Tools used</span>
          <input
            className={inputClass}
            placeholder="What software, hardware, or materials did you use?"
            value={toolsInput}
            onChange={(e) => setToolsInput(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm font-semibold leading-5 text-black">Description</span>
          <textarea
            className={`${inputClass} h-[100px] py-2 resize-none`}
            placeholder="Add short description for your project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold leading-5 text-black">Comments</span>
          <label className="flex items-center gap-2 text-sm font-normal text-black">
            <input
              type="checkbox"
              checked={disableComments}
              onChange={(e) => setDisableComments(e.target.checked)}
              className="w-4 h-4 accent-black"
            />
            Disable comments on this project
          </label>
        </div>

        {error && <p className="mt-4 text-red-600 text-sm font-['Inter']">{error}</p>}

        <div className="flex justify-end mt-[124px]">
          <button
            type="submit"
            disabled={saving}
            className="flex justify-center items-center w-[284px] h-[45px] bg-[#b5b5b5] text-sm font-normal text-black hover:brightness-95 disabled:opacity-50"
          >
            {saving ? "Publishing..." : submitLabel || "Publish"}
          </button>
        </div>
      </section>
    </form>
  );
}
