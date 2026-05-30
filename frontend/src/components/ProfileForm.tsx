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

  const addSkill = () => {
    const s = skillInput.trim();
    if (s) { setSkills([...skills, s]); setSkillInput(""); }
  };

  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

  const addSocial = () => {
    const s = socialInput.trim();
    if (s) { setSocials([...socials, s]); setSocialInput(""); }
  };

  const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await onSubmit({ userName, firstName, lastName, avatar, skills, socials });
      setMessage("Saved.");
    } catch (err) {
      setMessage(err as string);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userName">Username</label>
        <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={initial.email} disabled />
      </div>

      <div>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>

      <div>
        <label htmlFor="lastName">Last name</label>
        <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>

      <div>
        <label htmlFor="avatar">Avatar URL</label>
        <input id="avatar" type="url" placeholder="https://..." value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        {avatar && <img src={avatar} alt={userName} />}
      </div>

      <div>
        <label htmlFor="skill">Skills</label>
        <input
          id="skill"
          type="text"
          placeholder="Add skill"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
        />
        <button type="button" onClick={addSkill}>Add</button>
        <ul>
          {skills.map((skill, i) => (
            <li key={`${skill}-${i}`}>
              <span>{skill}</span>
              <button type="button" onClick={() => removeSkill(i)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label htmlFor="social">Socials</label>
        <input
          id="social"
          type="url"
          placeholder="https://..."
          value={socialInput}
          onChange={(e) => setSocialInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSocial())}
        />
        <button type="button" onClick={addSocial}>Add</button>
        <ul>
          {socials.map((social, i) => (
            <li key={`${social}-${i}`}>
              <span>{social}</span>
              <button type="button" onClick={() => removeSocial(i)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>

      {message && <p>{message}</p>}
    </form>
  );
}
