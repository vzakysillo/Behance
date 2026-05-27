import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi, type ApiResponse } from "../api/auth.api";
import { routes } from "../routes";

interface UserProfile {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  socials: string[];
  skills: string[];
  avatar: string;
  projects: string[];
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [token] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState(
    token ? "Loading profile..." : "Please login to view your profile."
  );

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [socials, setSocials] = useState<string[]>([]);
  const [socialInput, setSocialInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function getProfile() {
      try {
        const response = await AuthApi.get<ApiResponse<{ user: UserProfile }>>(
          "/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profile = response.data.data?.user;

        if (!profile) {
          setMessage("Could not load your profile.");
          return;
        }

        setUser(profile);
        setUserName(profile.userName || "");
        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setSkills(profile.skills || []);
        setSocials(profile.socials || []);
        setMessage("");
      } catch {
        localStorage.removeItem("token");
        setMessage("Your session expired. Please login again.");
      }
    }

    getProfile();
  }, [token]);

  const addSkill = () => {
    const newSkill = skillInput.trim();

    if (!newSkill) {
      return;
    }

    setSkills([...skills, newSkill]);
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, skillIndex) => skillIndex !== index);
    setSkills(newSkills);
  };

  const addSocial = () => {
    const newSocial = socialInput.trim();

    if (!newSocial) {
      return;
    }

    setSocials([...socials, newSocial]);
    setSocialInput("");
  };

  const removeSocial = (index: number) => {
    const newSocials = socials.filter((_, socialIndex) => socialIndex !== index);
    setSocials(newSocials);
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setMessage("Please login to update your profile.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await AuthApi.patch<ApiResponse<{ user: UserProfile }>>(
        "/users/me",
        {
          userName,
          firstName,
          lastName,
          skills,
          socials,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.data?.user;

      if (updatedUser) {
        setUser(updatedUser);
        setMessage("Profile updated successfully.");
      }
    } catch {
      setMessage("Could not update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate(routes.login);
  };

  if (!user) {
    return (
      <section>
        <h1>Profile</h1>
        <p>{message}</p>
        <button type="button" onClick={() => navigate(routes.login)}>
          Go to login
        </button>
      </section>
    );
  }

  return (
    <section>
      <p>Account</p>
      <h1>Profile</h1>

      <form onSubmit={saveProfile}>
        <div>
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={user.email} disabled />
        </div>

        <div>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="skill">Skills</label>
          <input
            id="skill"
            type="text"
            placeholder="Add skill"
            value={skillInput}
            onChange={(event) => setSkillInput(event.target.value)}
          />
          <button type="button" onClick={addSkill}>
            Add skill
          </button>

          <ul>
            {skills.map((skill, index) => (
              <li key={`${skill}-${index}`}>
                <span>{skill}</span>
                <button type="button" onClick={() => removeSkill(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label htmlFor="social">Socials</label>
          <input
            id="social"
            type="text"
            placeholder="Add social link"
            value={socialInput}
            onChange={(event) => setSocialInput(event.target.value)}
          />
          <button type="button" onClick={addSocial}>
            Add social
          </button>

          <ul>
            {socials.map((social, index) => (
              <li key={`${social}-${index}`}>
                <span>{social}</span>
                <button type="button" onClick={() => removeSocial(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p>Projects: {user.projects.length}</p>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>

      {user.avatar && (
        <div>
          <p>Avatar</p>
          <img src={user.avatar} alt={user.userName} />
        </div>
      )}

      {message && <p>{message}</p>}

      <button type="button" onClick={logout}>
        Logout
      </button>
    </section>
  );
}
