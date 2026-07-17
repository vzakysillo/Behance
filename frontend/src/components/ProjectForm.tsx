import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectPayload } from "../api/project.api";
import { uploadImage } from "../api/upload.api";

const projectSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string(),
  cover: z.string(),
  tagsInput: z.string(),
  categoriesInput: z.string(),
  toolsInput: z.string(),
  disableComments: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;
type ProjectFormData = ProjectPayload;

interface ProjectFormProps {
  initial?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({ initial = {}, onSubmit, submitLabel }: ProjectFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initial.cover || "");
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initial.name || "",
      description: initial.description || "",
      cover: initial.cover || "",
      tagsInput: initial.tags?.join(" ") || "",
      categoriesInput: initial.categories?.join(" ") || "",
      toolsInput: initial.toolsUsed?.join(" ") || "",
      disableComments: initial.disableComments ?? false,
    },
  });

  const coverValue = watch("cover");

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(coverValue);
      return;
    }

    const previewUrl = URL.createObjectURL(coverFile);
    setCoverPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [coverValue, coverFile]);

  const handleCoverSelect = (file: File | undefined) => {
    if (!file) return;
    setCoverFile(file);
    setError("");
  };

  const onSubmitForm = async (data: ProjectFormValues) => {
    setError("");
    try {
      let coverUrl = data.cover;
      if (coverFile) {
        coverUrl = await uploadImage(coverFile);
        setValue("cover", coverUrl);
        setCoverFile(null);
      }

      const tags = data.tagsInput.split(" ").map((t) => t.trim()).filter(Boolean);
      const categories = data.categoriesInput.split(" ").map((c) => c.trim()).filter(Boolean);
      const toolsUsed = data.toolsInput.split(" ").map((t) => t.trim()).filter(Boolean);

      const payload = { name: data.name, description: data.description, cover: coverUrl, tags, categories, toolsUsed, disableComments: data.disableComments };
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project.");
    }
  };

  const inputClass =
    "w-full h-11 px-2.5 border border-[#a2a0a0] text-sm font-normal font-['Inter'] leading-5 text-black bg-white outline-none placeholder:text-[#676767] focus:border-black";

  return (
    <form
      id="project-form"
      onSubmit={handleSubmit(onSubmitForm)}
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
          {...register("cover", { onChange: () => setCoverFile(null) })}
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
            {...register("name")}
          />
        </label>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm leading-5 text-black">
            <strong className="font-semibold">Tags</strong>{" "}
            <span className="font-normal">(space-separated, limit of 10)</span>
          </span>
          <input
            className={inputClass}
            placeholder="Add up to 10 keywords to help people discover your project"
            {...register("tagsInput")}
          />
        </label>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm leading-5 text-black">
            <strong className="font-semibold">Categories</strong>{" "}
            <span className="font-normal">(space-separated, limit of 3)</span>
          </span>
          <input
            className={inputClass}
            placeholder="How would you categorize this project?"
            {...register("categoriesInput")}
          />
        </label>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm font-semibold leading-5 text-black">Tools used</span>
          <input
            className={inputClass}
            placeholder="What software, hardware, or materials did you use?"
            {...register("toolsInput")}
          />
        </label>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-sm font-semibold leading-5 text-black">Description</span>
          <textarea
            className={`${inputClass} h-[100px] py-2 resize-none`}
            placeholder="Add short description for your project"
            {...register("description")}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold leading-5 text-black">Comments</span>
          <label className="flex items-center gap-2 text-sm font-normal text-black">
            <input
              type="checkbox"
              {...register("disableComments")}
              className="w-4 h-4 accent-black"
            />
            Disable comments on this project
          </label>
        </div>

        {error && <p className="mt-4 text-red-600 text-sm font-['Inter']">{error}</p>}

        <div className="flex justify-end mt-[124px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex justify-center items-center w-[284px] h-[45px] bg-[#b5b5b5] text-sm font-normal text-black hover:brightness-95 disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : submitLabel || "Publish"}
          </button>
        </div>
      </section>
    </form>
  );
}
