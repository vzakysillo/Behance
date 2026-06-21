import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getProjects } from "../api/project.api";
import { updateMe } from "../api/user.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import ProfileForm from "../components/ProfileForm";
import { routes } from "../routes";

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const { data: projects, loading, error } = useAsync(getProjects);

  if (!user) return <Spinner />;

  return (
    <section className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <nav className="mb-6">
        <Link
          to={routes.profile.projects()}
          className="text-sm text-blue-600 hover:underline"
        >
          My Projects ({loading ? "…" : projects?.length ?? 0})
        </Link>
      </nav>

      {error && <ErrorMessage message={error} className="min-h-0 mb-4" />}

      <ProfileForm
        initial={user}
        onSubmit={async (data) => {
          await updateMe(data);
          await refreshUser();
        }}
      />

      <button
        type="button"
        onClick={logout}
        className="mt-6 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
      >
        Logout
      </button>
    </section>
  );
}
