import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/project.api";
import { getFollowers, getFollowing } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../routes";
import { Plus } from "lucide-react";
import ProfileSidebar from "../components/ProfileSidebar";
import TabBar from "../components/TabBar";
import { Button, Spinner, ErrorMessage, EmptyState } from "../components/ui";
import { ProfileProjectCard } from "../components/layout/ProfileProjectCard";

const TABS = ["Work", "Moodboards", "For sale", "Appreciations", "Your stats", "Drafts"] as const;

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("Work");

  const { data: projects, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: !!user,
  });

  const { data: followers } = useQuery({
    queryKey: ["followers", user?._id],
    queryFn: () => getFollowers(user!._id),
    enabled: !!user,
  });

  const { data: following } = useQuery({
    queryKey: ["following", user?._id],
    queryFn: () => getFollowing(user!._id),
    enabled: !!user,
  });

  if (!user) return <Spinner />;

  const likesCount = (projects ?? []).reduce((sum, p) => sum + (p.likesCount ?? 0), 0);

  return (
    <div className="flex min-h-screen bg-white font-['Inter',sans-serif]">

      {/* Left info panel */}
      <ProfileSidebar
        user={user}
        likesCount={likesCount}
        followersCount={followers?.length ?? 0}
        followingCount={following?.length ?? 0}
        actionButtons={
          <div className="flex flex-col gap-[18px] mt-6">
            <Link
              to={routes.profile.edit()}
              className="w-full h-10 flex items-center justify-center bg-stone-300 text-black text-sm font-normal no-underline hover:brightness-95"
            >
              Edit profile info
            </Link>
            <Button variant="sidebar-light">
              Customize profile PRO
            </Button>
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

      {/* Main content area */}
      <main className="flex-1 flex flex-col">

        {/* Tabs */}
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content */}
        <div className="flex-1 px-[50px] py-8">
          {activeTab === "Work" && (
            <>
              {isLoading && <Spinner />}
              {isError && <ErrorMessage message={error.message} />}
              {!isLoading && !isError && (
                <div className="grid grid-cols-3 gap-[22px]">

                  {/* Add project card */}
                  <Link
                    to={routes.profile.projectUpload()}
                    className="w-96 h-96 bg-zinc-300 flex flex-col items-center justify-center gap-3 no-underline hover:brightness-95"
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Plus size={48} strokeWidth={3} className="text-black" />
                    </div>
                    <span className="text-base font-medium text-black">Add project</span>
                  </Link>

                  {/* Project cards */}
                  {(projects ?? []).map((project) => (
                    <ProfileProjectCard
                      key={project._id}
                      project={project}
                      linkTo={routes.profile.projectDetail(project._id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab !== "Work" && (
            <EmptyState variant="centered" message={`${activeTab} — coming soon`} />
          )}
        </div>
      </main>
    </div>
  );
}
