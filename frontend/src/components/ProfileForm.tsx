import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IUser } from "../types";

const profileSchema = z.object({
  userName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string(),
  skills: z.array(z.object({ value: z.string() })),
  socials: z.array(z.object({ value: z.string() })),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initial: IUser;
  onSubmit: (data: Partial<IUser>) => Promise<void>;
}

export default function ProfileForm({ initial, onSubmit }: ProfileFormProps) {
  const [message, setMessage] = useState("");

  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: initial.userName || "",
      firstName: initial.firstName || "",
      lastName: initial.lastName || "",
      avatar: initial.avatar || "",
      skills: (initial.skills || []).map((s) => ({ value: s })),
      socials: (initial.socials || []).map((s) => ({ value: s })),
    },
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control, name: "socials" });

  const [skillInput, setSkillInput] = useState("");
  const [socialInput, setSocialInput] = useState("");

  const addSkill = () => { const s = skillInput.trim(); if (s) { appendSkill({ value: s }); setSkillInput(""); } };
  const addSocial = () => { const s = socialInput.trim(); if (s) { appendSocial({ value: s }); setSocialInput(""); } };

  const onSubmitForm = async (data: ProfileValues) => {
    setMessage("");
    try {
      await onSubmit({
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        skills: data.skills.map((s) => s.value),
        socials: data.socials.map((s) => s.value),
      });
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save profile.");
    }
  };

  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full text-sm outline-none focus:border-gray-500";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4 max-w-lg">
      <label className={labelClass}>Username <input className={inputClass} type="text" {...register("userName")} /></label>
      <label className={labelClass}>Email <input className={`${inputClass} bg-gray-100 cursor-not-allowed`} type="email" value={initial.email} disabled /></label>
      <label className={labelClass}>First name <input className={inputClass} type="text" {...register("firstName")} /></label>
      <label className={labelClass}>Last name <input className={inputClass} type="text" {...register("lastName")} /></label>
      <label className={labelClass}>
        Avatar URL
        <input className={inputClass} type="url" placeholder="https://..." {...register("avatar")} />
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Skills</span>
        <div className="flex gap-2">
          <input className={`${inputClass} flex-1`} type="text" placeholder="Add skill" value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
          <button type="button" onClick={addSkill} className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">Add</button>
        </div>
        <ul className="flex flex-wrap gap-2 mt-1">
          {skillFields.map((field, i) => (
            <li key={field.id} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm">
              <span>{field.value}</span>
              <button type="button" onClick={() => removeSkill(i)} className="text-gray-500 hover:text-red-500">×</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Socials</span>
        <div className="flex gap-2">
          <input className={`${inputClass} flex-1`} type="url" placeholder="https://..." value={socialInput}
            onChange={(e) => setSocialInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSocial())} />
          <button type="button" onClick={addSocial} className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">Add</button>
        </div>
        <ul className="flex flex-col gap-1 mt-1">
          {socialFields.map((field, i) => (
            <li key={field.id} className="flex items-center gap-2 text-sm">
              <span className="truncate text-blue-600">{field.value}</span>
              <button type="button" onClick={() => removeSocial(i)} className="text-gray-500 hover:text-red-500 shrink-0">Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" disabled={isSubmitting}
        className="px-4 py-2 bg-gray-800 text-white text-sm rounded disabled:opacity-50 hover:bg-gray-700">
        {isSubmitting ? "Saving..." : "Save profile"}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
