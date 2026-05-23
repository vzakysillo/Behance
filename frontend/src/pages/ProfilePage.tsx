import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/auth.api";
import { routes } from "../routes";

interface UserProfile {
  _id: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  socials: string[];
  skills: string[];
  avatar?: string;
  portfolios: string[];
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState("Loading profile...");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("Please login to view your profile.");
      return;
    }

    AuthApi.get<{ user: UserProfile }>("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUser(response.data.user);
        setStatus("");
      })
      .catch(() => {
        localStorage.removeItem("token");
        setStatus("Your session expired. Please login again.");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate(routes.login);
  };

  return (
    <section>
      <div>
        <p>Account</p>
        <h1>Profile</h1>
      </div>

      {user ? (
        <div>
          <div>
            <span>Username </span>
            <strong>{user.userName}</strong>
          </div>
          <div>
            <span>Email </span>
            <strong>{user.email}</strong>
          </div>
          <div>
            <span>First name </span>
            <strong>{user.firstName || "null"}</strong>
          </div>
          <div>
            <span>Last name </span>
            <strong>{user.lastName || "null"}</strong>
          </div>
          <div>
            <span>Skills </span>
            <strong>{user.skills.length ? user.skills.join(", ") : "null"}</strong>
          </div>
          <div>
            <span>Socials </span>
            <strong>{user.socials.length ? user.socials.join(", ") : "null"}</strong>
          </div>
          <div>
            <span>Portfolios </span>
            <strong>{user.portfolios.length}</strong>
          </div>
          {user.avatar && (
            <div>
              <span>Avatar</span>
              <img src={user.avatar} alt={user.userName} />
            </div>
          )}
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>{status}</p>
          <button type="button" onClick={() => navigate(routes.login)}>
            Go to login
          </button>
        </div>
      )}
    </section>
  );
}
