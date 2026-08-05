import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProjects } from "../api/project.api";
import { getUser } from "../api/user.api";
import { getFollowers, getFollowing, followUser, unfollowUser } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../routes";
import { UserPlus, Mail, Star } from "lucide-react";
import ProfileSidebar from "../components/ProfileSidebar";
import TabBar from "../components/TabBar";
import { Button, Spinner, ErrorMessage, EmptyState, ProfileHeaderGradient } from "../components/ui";
import { ProfileProjectCard } from "../components/layout/ProfileProjectCard";

const TABS = ["Work", "Moodboards", "For sale", "Appreciations", "Your stats"] as const;

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, token } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("Work");

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
    <div className="relative min-h-screen bg-[#f8f8f8] font-sans">

      {/* Gradient header */}
      <ProfileHeaderGradient className="h-[300px]" />

      <div className="relative flex">

      {/* Left info panel */}
      <ProfileSidebar
        user={profileUser}
        likesCount={likesCount}
        followersCount={followers?.length ?? 0}
        followingCount={following?.length ?? 0}
        actionButtons={
          !isOwnProfile && token ? (
            <div className="flex flex-col gap-[12px] mt-6">
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                type="button"
                onClick={() => followMutation.mutate()}
                icon={<UserPlus size={18} />}
                className="inline-flex items-center justify-center gap-2"
                fullWidth
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button
                variant="secondary"
                icon={<Mail size={18} />}
                className="inline-flex items-center justify-center gap-2"
                fullWidth
              >
                Message
              </Button>
              <Button
                variant="secondary"
                icon={<Star size={18} />}
                className="inline-flex items-center justify-center gap-2"
                fullWidth
              >
                Save candidate
              </Button>
            </div>
          ) : undefined
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
              {projectsLoading && <Spinner />}
              {projectsError && <ErrorMessage message={projectsError.message} />}
              {!projectsLoading && !projectsError && (
                <div className="grid grid-cols-3 gap-[30px]">
                  {(projects ?? []).map((project) => (
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

          {activeTab !== "Work" && (
            <EmptyState variant="centered" message={`${activeTab} — coming soon`} />
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
