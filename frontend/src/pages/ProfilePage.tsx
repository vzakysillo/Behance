import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects } from "../api/project.api";
import { getMe, updateMe } from "../api/user.api";
import ProfileForm from "../components/ProfileForm";
import { routes } from "../routes";
import type { IUser } from "../types";

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<IUser | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [message, setMessage] = useState(token ? "Loading..." : "Please login.");

  useEffect(() => {
    if (!token) return;
    Promise.all([getMe(), getProjects()])
      .then(([profile, projects]) => {
        setUser(profile);
        setProjectCount(projects.length);
        setMessage("");
      })
      .catch(() => {
        localStorage.removeItem("token");
        setMessage("Session expired. Please login again.");
      });
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate(routes.auth.login());
  };

  if (!user) {
    return (
      <section>
        <h1>Profile</h1>
        <p>{message}</p>
        <button type="button" onClick={() => navigate(routes.auth.login())}>Go to login</button>
      </section>
    );
  }

  return (
    <section>
      <h1>Profile</h1>

      <nav>
        <Link to={routes.profile.projects()}>My Projects ({projectCount})</Link>
      </nav>

      <ProfileForm
        initial={user}
        onSubmit={async (data) => {
          const updated = await updateMe(data);
          setUser(updated);
        }}
      />

      <button type="button" onClick={logout}>Logout</button>
    </section>
  );
}
