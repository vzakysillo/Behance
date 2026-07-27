import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectPayload } from "../api/project.api";
import CategoryPicker from "./CategoryPicker";
import TagInput from "./TagInput";
import { MAX_CATEGORIES } from "../utils/categories";
import { TAGS, MAX_TAGS } from "../utils/tags";
import { TOOLS } from "../utils/tools";
import { Button, Checkbox, FormError, TextInput, Tag } from "./ui";

const projectSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string(),
  cover: z.string(),
  disableComments: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;
type ProjectFormData = ProjectPayload;

interface ProjectFormProps {
  initial?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData, coverFile?: File) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({ initial = {}, onSubmit, submitLabel }: ProjectFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initial.cover || "");
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initial.categories || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(initial.tags || []);
  const [selectedTools, setSelectedTools] = useState<string[]>(initial.toolsUsed || []);
  const [showPicker, setShowPicker] = useState(false);

  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initial.name || "",
      description: initial.description || "",
      cover: initial.cover || "",
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
      const coverUrl = data.cover;

      const payload = { name: data.name, description: data.description, cover: coverUrl, tags: selectedTags, categories: selectedCategories, toolsUsed: selectedTools, disableComments: data.disableComments };
      await onSubmit(payload, coverFile ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project.");
    }
  };

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

        <TextInput
          variant="project"
          type="url"
          placeholder="Or paste a cover image URL..."
          {...register("cover", { onChange: () => setCoverFile(null) })}
          className="mt-3 w-full max-w-[726px] h-9"
        />
      </section>

      <section className="flex flex-col">
        <p className="text-sm font-semibold uppercase leading-5 mb-8 text-black">
          Project Information
        </p>

        <div className="flex flex-col gap-2 mb-6">
          <span className="text-sm leading-5 text-black">
            <strong className="font-semibold">Title</strong>{" "}
            <span className="font-normal">(required)</span>
          </span>
          <TextInput
            variant="project"
            placeholder="Give your project a title"
            {...register("name")}
          />
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm leading-5 text-black">
            <strong className="font-semibold">Tags</strong>{" "}
            <span className="font-normal">(limit of {MAX_TAGS})</span>
          </p>
          <div className="w-full px-2.5 py-2 border border-[#a2a0a0] bg-white outline-none focus-within:border-black">
            <TagInput
              selected={selectedTags}
              onSelect={setSelectedTags}
              options={TAGS}
              placeholder="Add up to 10 keywords to help people discover your project"
              maxItems={MAX_TAGS}
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm leading-5 text-black">
            <strong className="font-semibold">Categories</strong>{" "}
            <span className="font-normal">(required, limit of {MAX_CATEGORIES})</span>
          </p>
          <TextInput
            variant="project"
            type="button"
            onClick={() => setShowPicker(true)}
            readOnly
            value={selectedCategories.length > 0 ? selectedCategories.join(", ") : "Select categories..."}
            className="text-left truncate cursor-pointer"
          />
          {selectedCategories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <Tag
                  key={cat}
                  label={cat}
                  dismissible
                  onDismiss={() => setSelectedCategories((prev) => prev.filter((c) => c !== cat))}
                />
              ))}
            </div>
          )}
          {showPicker && (
            <CategoryPicker
              selected={selectedCategories}
              onSelect={setSelectedCategories}
              onClose={() => setShowPicker(false)}
            />
          )}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold leading-5 text-black">Tools used</p>
          <div className="w-full px-2.5 py-2 border border-[#a2a0a0] bg-white outline-none focus-within:border-black">
            <TagInput
              selected={selectedTools}
              onSelect={setSelectedTools}
              options={TOOLS}
              placeholder="What software, hardware, or materials did you use?"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <span className="text-sm font-semibold leading-5 text-black">Description</span>
          <TextInput
            variant="project"
            className="h-[100px] py-2 resize-none"
            placeholder="Add short description for your project"
            {...register("description")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold leading-5 text-black">Comments</span>
          <label className="flex items-center gap-2 text-sm font-normal text-black">
            <Checkbox variant="purple" {...register("disableComments")} />
            Disable comments on this project
          </label>
        </div>

        {error && <FormError message={error} className="mt-4" />}

        <div className="flex justify-end mt-[124px]">
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="w-[284px] h-[45px] bg-[#b5b5b5] text-sm font-normal"
          >
            {isSubmitting ? "Publishing..." : submitLabel || "Publish"}
          </Button>
        </div>
      </section>
    </form>
  );
}
