import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects, getAppreciatedProjects } from "../api/project.api";
import { getFollowers, getFollowing } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../routes";
import ProfileSidebar from "../components/ProfileSidebar";
import TabBar from "../components/TabBar";
import { Button, LinkButton, Spinner, ErrorMessage, EmptyState, ProfileHeaderGradient } from "../components/ui";
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

  const {
    data: appreciatedProjects,
    isLoading: appreciationsLoading,
    isError: appreciationsError,
    error: appreciationsFetchError,
  } = useQuery({
    queryKey: ["appreciations"],
    queryFn: getAppreciatedProjects,
    enabled: !!user && activeTab === "Appreciations",
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
    <div className="relative min-h-screen bg-[#f8f8f8] font-sans">

      {/* Gradient header */}
      <ProfileHeaderGradient className="h-[300px]" />

      <div className="relative flex">

      {/* Left info panel */}
      <ProfileSidebar
        user={user}
        likesCount={likesCount}
        followersCount={followers?.length ?? 0}
        followingCount={following?.length ?? 0}
        actionButtons={
          <div className="flex flex-col gap-[12px] mt-6">
            <LinkButton to={routes.profile.edit()} variant="primary" fullWidth>
              Edit profile info
            </LinkButton>
            <Button variant="secondary" fullWidth>
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
      <main className="flex-1 flex flex-col pt-[300px]">

        {/* Tabs */}
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content */}
        <div className="flex-1 px-[50px] py-8">
          {activeTab === "Work" && (
            <>
              {isLoading && <Spinner />}
              {isError && <ErrorMessage message={error.message} />}
              {!isLoading && !isError && (
                <div className="grid grid-cols-3 gap-[30px]">

                  {/* Add project card */}
                  <Link
                    to={routes.profile.projectUpload()}
                    className="relative w-full h-[307px] no-underline"
                  >
                    <div className="w-full h-[307px] absolute left-[-2px] top-[-2px] rounded-[15px] border-[3px] border-brand-600" />
                    <svg
                      width={137}
                      height={137}
                      viewBox="0 0 137 137"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[137px] h-[137px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      preserveAspectRatio="none"
                    >
                      <circle cx="68.5" cy="68.5" r={67} stroke="#6146EA" strokeWidth={3} />
                      <path d="M44 68H94" stroke="#6146EA" strokeWidth={3} strokeLinecap="round" />
                      <path d="M68 93L68 43" stroke="#6146EA" strokeWidth={3} strokeLinecap="round" />
                    </svg>
                    <p className="absolute left-1/2 -translate-x-1/2 top-[235px] text-base font-medium text-center whitespace-nowrap text-brand-600">
                      Add project
                    </p>
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

          {activeTab === "Appreciations" && (
            <>
              {appreciationsLoading && <Spinner />}
              {appreciationsError && <ErrorMessage message={appreciationsFetchError?.message ?? "Failed to load appreciations"} />}
              {!appreciationsLoading && !appreciationsError && (
                <>
                  {(appreciatedProjects ?? []).length === 0 ? (
                    <EmptyState variant="centered" message="No appreciated projects yet" />
                  ) : (
                    <div className="grid grid-cols-3 gap-[30px]">
                      {(appreciatedProjects ?? []).map((project) => (
                        <ProfileProjectCard
                          key={project._id}
                          project={project}
                          linkTo={routes.projectDetail(project._id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab !== "Work" && activeTab !== "Appreciations" && (
            <EmptyState variant="centered" message={`${activeTab} — coming soon`} />
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
