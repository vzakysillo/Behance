import { useState } from "react";
import type { IUser } from "../types";

interface ProfileFormProps {
  initial: IUser;
  onSubmit: (data: Partial<IUser>) => Promise<void>;
}

export default function ProfileForm({ initial, onSubmit }: ProfileFormProps) {
  const [userName, setUserName] = useState(initial.userName || "");
  const [firstName, setFirstName] = useState(initial.firstName || "");
  const [lastName, setLastName] = useState(initial.lastName || "");
  const [avatar, setAvatar] = useState(initial.avatar || "");
  const [skills, setSkills] = useState<string[]>(initial.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [socials, setSocials] = useState<string[]>(initial.socials || []);
  const [socialInput, setSocialInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const addSkill = () => { const s = skillInput.trim(); if (s) { setSkills([...skills, s]); setSkillInput(""); } };
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
  const addSocial = () => { const s = socialInput.trim(); if (s) { setSocials([...socials, s]); setSocialInput(""); } };
  const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMessage("");
    try {
      await onSubmit({ userName, firstName, lastName, avatar, skills, socials });
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full text-sm outline-none focus:border-gray-500";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <label className={labelClass}>Username <input className={inputClass} type="text" value={userName} onChange={(e) => setUserName(e.target.value)} /></label>
      <label className={labelClass}>Email <input className={`${inputClass} bg-gray-100 cursor-not-allowed`} type="email" value={initial.email} disabled /></label>
      <label className={labelClass}>First name <input className={inputClass} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
      <label className={labelClass}>Last name <input className={inputClass} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
      <label className={labelClass}>
        Avatar URL
        <input className={inputClass} type="url" placeholder="https://..." value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        {avatar && <img src={avatar} alt={userName} className="w-16 h-16 rounded-full object-cover" />}
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
          {skills.map((skill, i) => (
            <li key={`${skill}-${i}`} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm">
              <span>{skill}</span>
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
          {socials.map((social, i) => (
            <li key={`${social}-${i}`} className="flex items-center gap-2 text-sm">
              <span className="truncate text-blue-600">{social}</span>
              <button type="button" onClick={() => removeSocial(i)} className="text-gray-500 hover:text-red-500 shrink-0">Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" disabled={saving}
        className="px-4 py-2 bg-gray-800 text-white text-sm rounded disabled:opacity-50 hover:bg-gray-700">
        {saving ? "Saving..." : "Save profile"}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
