import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getProjects } from "../api/project.api";
import { getFollowers, getFollowing } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";
import { Plus, Heart } from "lucide-react";
import { Link as LinkIcon } from "lucide-react";
import ProfileSidebar from "../components/ProfileSidebar";
import TabBar from "../components/TabBar";

type Tab = "Work" | "Moodboards" | "For sale" | "Appreciations" | "Your stats" | "Drafts";
const TABS: Tab[] = ["Work", "Moodboards", "For sale", "Appreciations", "Your stats", "Drafts"];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: projects, loading, error } = useAsync(getProjects);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("Work");

  useEffect(() => {
    if (!user) return;

    getFollowers(user._id).then((res) => setFollowersCount(res.length));
    getFollowing(user._id).then((res) => setFollowingCount(res.length));
  }, [user]);

  if (!user) return <Spinner />;

  const likesCount = (projects ?? []).reduce((sum, p) => sum + (p.likesCount ?? 0), 0);

  return (
    <div className="flex min-h-screen bg-white font-['Inter',sans-serif]">

      {/* ── Left info panel ── */}
      <ProfileSidebar
        user={user}
        likesCount={likesCount}
        followersCount={followersCount}
        followingCount={followingCount}
        actionButtons={
          <div className="flex flex-col gap-[18px] mt-6">
            <Link
              to={routes.profile.edit()}
              className="w-full h-10 flex items-center justify-center bg-stone-300 text-black text-sm font-normal no-underline hover:brightness-95"
            >
              Edit profile info
            </Link>
            <button
              type="button"
              className="w-full h-10 flex items-center justify-center bg-gray-200 text-black text-sm font-normal hover:brightness-95"
            >
              Customize profile PRO
            </button>
          </div>
        }
        logoutButton={
          <button
            type="button"
            onClick={logout}
            className="mt-4 text-sm text-gray-400 hover:text-black text-left"
          >
            Log out
          </button>
        }
      />

      {/* ── Main content area ── */}
      <main className="flex-1 flex flex-col">

        {/* Tabs */}
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content */}
        <div className="flex-1 px-[50px] py-8">
          {activeTab === "Work" && (
            <>
              {loading && <Spinner />}
              {error && <ErrorMessage message={error} />}
              {!loading && !error && (
                <div className="grid grid-cols-3 gap-[22px]">

                  {/* Add project card */}
                  <Link
                    to={routes.profile.projectNew()}
                    className="w-96 h-96 bg-zinc-300 flex flex-col items-center justify-center gap-3 no-underline hover:brightness-95"
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Plus size={48} strokeWidth={3} className="text-black" />
                    </div>
                    <span className="text-base font-medium text-black">Add project</span>
                  </Link>

                  {/* Project cards */}
                  {(projects ?? []).map((project) => (
                    <Link
                      key={project._id}
                      to={routes.profile.projectDetail(project._id)}
                      className="w-96 h-96 bg-zinc-300 relative block overflow-hidden no-underline group"
                    >
                      {project.cover
                        ? <img src={project.cover} alt={project.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-stone-300" />}

                      {/* Hover info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent">
                        <p className="text-xl font-normal text-black">{project.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-normal text-black">Name Surname</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <LinkIcon size={24} className="text-black" />
                              <span className="text-base font-normal text-black">1.5</span>
                            </div>
                            <div className="flex items-center gap-1">
                            <Heart size={20} className="text-black" />
                            <span className="text-base font-normal text-black">1.5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab !== "Work" && (
            <div className="flex items-center justify-center h-64 text-stone-400 text-base">
              {activeTab} — coming soon
            </div>
          )}
        </div>
      </main>
    </div>
  );
}