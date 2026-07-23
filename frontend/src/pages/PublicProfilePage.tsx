import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProjects } from "../api/project.api";
import { getUser } from "../api/user.api";
import { getFollowers, getFollowing, followUser, unfollowUser } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";
import { MessageSquare, Heart } from "lucide-react";
import ProfileSidebar from "../components/ProfileSidebar";
import TabBar from "../components/TabBar";

type Tab = "Work" | "Moodboards" | "For sale" | "Appreciations" | "Your stats";
const TABS: Tab[] = ["Work", "Moodboards", "For sale", "Appreciations", "Your stats"];

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, token } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("Work");

  const {
    data: profileUser,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id!),
    enabled: !!id,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ["userProjects", id],
    queryFn: () => getUserProjects(id!),
    enabled: !!id,
  });

  const { data: followers } = useQuery({
    queryKey: ["followers", id],
    queryFn: () => getFollowers(id!),
    enabled: !!id,
  });

  const { data: following } = useQuery({
    queryKey: ["following", id],
    queryFn: () => getFollowing(id!),
    enabled: !!id,
  });

  const { data: currentUserFollowing } = useQuery({
    queryKey: ["following", currentUser?._id],
    queryFn: () => getFollowing(currentUser!._id),
    enabled: !!currentUser && currentUser._id !== id,
  });

  const isFollowing = currentUserFollowing?.some((u) => u.followingId._id === id) ?? false;

  const followMutation = useMutation({
    mutationFn: () => (isFollowing ? unfollowUser(id!) : followUser(id!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers", id] });
      queryClient.invalidateQueries({ queryKey: ["following", currentUser?._id] });
    },
  });

  if (userLoading) return <Spinner />;
  if (userError) return <ErrorMessage message={userError.message} />;
  if (!profileUser) return <ErrorMessage message="User not found." />;

  const likesCount = (projects ?? []).reduce((sum, p) => sum + (p.likesCount ?? 0), 0);
  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="flex min-h-screen bg-white font-['Inter',sans-serif]">

      {/* Left info panel */}
      <ProfileSidebar
        user={profileUser}
        likesCount={likesCount}
        followersCount={followers?.length ?? 0}
        followingCount={following?.length ?? 0}
        actionButtons={
          !isOwnProfile && token ? (
            <div className="flex flex-col gap-[18px] mt-6">
              <button
                type="button"
                onClick={() => followMutation.mutate()}
                className={`w-full h-10 flex items-center justify-center text-sm font-normal transition-colors hover:brightness-95 ${
                  isFollowing
                    ? "bg-gray-200 text-black border border-neutral-600"
                    : "bg-stone-300 text-black"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button
                type="button"
                className="w-full h-10 flex items-center justify-center gap-2 bg-gray-200 text-black text-sm font-normal hover:brightness-95"
              >
                <MessageSquare size={14} />
                Message
              </button>
            </div>
          ) : undefined
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
              {projectsLoading && <Spinner />}
              {projectsError && <ErrorMessage message={projectsError.message} />}
              {!projectsLoading && !projectsError && (
                <div className="grid grid-cols-3 gap-[22px]">
                  {(projects ?? []).map((project) => (
                    <Link
                      key={project._id}
                      to={routes.projectDetail(project._id)}
                      className="w-96 h-96 bg-zinc-300 relative block overflow-hidden no-underline group"
                    >
                      {project.cover
                        ? <img src={project.cover} alt={project.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-stone-300" />}

                      {/* Hover info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-xl font-normal text-white">{project.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Heart size={20} className="text-white" />
                            <span className="text-base font-normal text-white">{project.likesCount ?? 0}</span>
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
