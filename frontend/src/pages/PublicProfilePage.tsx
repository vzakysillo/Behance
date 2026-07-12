import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getUserProjects } from "../api/project.api";
import { getUser } from "../api/user.api";
import { getFollowers, getFollowing, followUser, unfollowUser } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";
import { MapPin, Link as LinkIcon, Briefcase, ChevronRight, Heart, MessageSquare } from "lucide-react";
import type { IUser } from "../types";

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  Facebook: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="#A2A0A0" />
    </svg>
  ),
  LinkedIn: (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path d="M10.0004 0.399902C4.69839 0.399902 0.400391 4.6979 0.400391 9.9999C0.400391 15.3019 4.69839 19.5999 10.0004 19.5999C15.3024 19.5999 19.6004 15.3019 19.6004 9.9999C19.6004 4.6979 15.3024 0.399902 10.0004 0.399902ZM7.65039 13.9789H5.70639V7.7229H7.65039V13.9789ZM6.66639 6.9549C6.05239 6.9549 5.65539 6.5199 5.65539 5.9819C5.65539 5.4329 6.06439 5.0109 6.69139 5.0109C7.31839 5.0109 7.70239 5.4329 7.71439 5.9819C7.71439 6.5199 7.31839 6.9549 6.66639 6.9549ZM14.7504 13.9789H12.8064V10.5119C12.8064 9.7049 12.5244 9.1569 11.8214 9.1569C11.2844 9.1569 10.9654 9.5279 10.8244 9.8849C10.7724 10.0119 10.7594 10.1919 10.7594 10.3709V13.9779H8.81439V9.7179C8.81439 8.9369 8.78939 8.2839 8.76339 7.7219H10.4524L10.5414 8.5909H10.5804C10.8364 8.1829 11.4634 7.5809 12.5124 7.5809C13.7914 7.5809 14.7504 8.4379 14.7504 10.2799V13.9789Z" fill="#A2A0A0" />
    </svg>
  ),
  Instagram: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" fill="#A2A0A0" />
    </svg>
  ),
};

const parseSocials = (socials: string[]) =>
  socials
    .filter((s) => s.includes(":"))
    .map((s) => {
      const idx = s.indexOf(":");
      return { platform: s.slice(0, idx), url: s.slice(idx + 1) };
    })
    .filter((s) => SOCIAL_ICONS[s.platform] && s.url);

type Tab = "Work" | "Moodboards" | "For sale" | "Appreciations" | "Your stats";
const TABS: Tab[] = ["Work", "Moodboards", "For sale", "Appreciations", "Your stats"];

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, token } = useAuth();

  const {
    data: profileUser,
    loading: userLoading,
    error: userError,
  } = useAsync(() => getUser(id!), [id]);

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useAsync(() => getUserProjects(id!), [id]);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Work");

  useEffect(() => {
    if (!id) return;

    getFollowers(id).then((res) => setFollowersCount(res.length));
    getFollowing(id).then((res) => setFollowingCount(res.length));

    if (currentUser && currentUser._id !== id) {
      getFollowing(currentUser._id).then((res) => {
        setIsFollowing(res.some((u) => u._id === id));
      });
    }
  }, [id, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser || !id) return;
    try {
      if (isFollowing) {
        await unfollowUser(id);
        setFollowersCount((c) => c - 1);
      } else {
        await followUser(id);
        setFollowersCount((c) => c + 1);
      }
      setIsFollowing(!isFollowing);
    } catch {
      // silently fail
    }
  };

  if (userLoading) return <Spinner />;
  if (userError) return <ErrorMessage message={userError} />;
  if (!profileUser) return <ErrorMessage message="User not found." />;

  const fullName = [profileUser.firstName, profileUser.lastName].filter(Boolean).join(" ") || profileUser.userName;
  const likesCount = (projects ?? []).reduce((sum, p) => sum + (p.likesCount ?? 0), 0);
  const isOwnProfile = currentUser?._id === profileUser._id;

  const parsedSocials = parseSocials(profileUser.socials ?? []);

  return (
    <div className="flex min-h-screen bg-white font-['Inter',sans-serif]">

      {/* Left info panel */}
      <aside className="w-[340px] shrink-0 border-r border-stone-200 flex flex-col px-[50px] py-10 gap-0">

        {/* Avatar */}
        <div className="w-[144px] h-[144px] rounded-full bg-zinc-300 overflow-hidden mb-4 self-start">
          {profileUser.avatar
            ? <img src={profileUser.avatar} alt={fullName} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-zinc-300" />}
        </div>

        {/* Name & specialization */}
        <h1 className="text-2xl font-normal text-black leading-9">{fullName}</h1>
        <p className="text-xl font-normal text-zinc-600 mb-3">{profileUser.specialization ?? "Specialization"}</p>

        {/* Location */}
        <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
          <MapPin size={24} className="text-zinc-400 shrink-0" />
          <span>{profileUser.location ?? "Location"}</span>
        </div>

        {/* Available for freelance */}
        <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
          <Briefcase size={24} className="text-zinc-400 shrink-0" />
          <span>{profileUser.availableForFreelance ? "Available for freelance" : "Not available for freelance"}</span>
        </div>

        {/* Username / link */}
        <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
          <LinkIcon size={24} className="text-zinc-400 shrink-0" />
          <span>{profileUser.userName}</span>
        </div>

        {/* Follow / Message buttons */}
        {!isOwnProfile && token && (
          <div className="flex flex-col gap-[18px] mt-6">
            <button
              type="button"
              onClick={handleFollowToggle}
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
        )}

        {/* Divider */}
        <div className="w-full h-px bg-stone-300 my-6" />

        {/* Statistics */}
        <p className="text-base font-normal text-black mb-2">Statistics</p>
        <div className="flex flex-col">
          {[
            { label: "Likes", value: likesCount },
            { label: "Followers", value: followersCount },
            { label: "Following", value: followingCount },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between py-2.5">
              <span className="text-sm font-normal text-black">{s.label}</span>
              <span className="text-base font-normal text-black">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-stone-300 my-6" />

        {/* Socials */}
        <p className="text-base font-normal text-black mb-2">Socials</p>
        <div className="flex flex-col">
          {parsedSocials.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 py-2.5 no-underline text-black hover:underline"
            >
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                {SOCIAL_ICONS[s.platform]}
              </div>
              <span className="flex-1 text-sm font-normal">{s.platform}</span>
              <ChevronRight size={12} />
            </a>
          ))}
          {parsedSocials.length === 0 && (
            <p className="text-sm text-neutral-500">No social links yet.</p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-stone-300 my-6" />

        {/* Teams */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-normal text-black">Teams</p>
          </div>
          {(profileUser.teams ?? []).length > 0 ? (
            profileUser.teams!.map((team, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-16 h-16 rounded-full bg-zinc-300 shrink-0 overflow-hidden">
                  {team.avatar && <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-normal text-black">{team.name}</span>
                  <span className="text-sm font-normal text-black">{team.location}</span>
                </div>
              </div>
            ))
          ) : null}
          <div className="w-full h-px bg-stone-300 mt-3" />
        </div>

        {/* About me */}
        <p className="text-base font-normal text-black mb-3">About me</p>
        <p className="text-sm font-normal text-black leading-5">
          {profileUser.aboutMe ?? "No bio yet."}
        </p>

        {/* Member since */}
        <p className="text-base font-normal text-zinc-400 mt-auto pt-10">
          {profileUser.memberSince ? `Member since ${profileUser.memberSince}` : ""}
        </p>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col">

        {/* Tabs */}
        <div className="flex items-center border-b border-stone-200 px-[50px]">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "text-base font-normal text-black py-4 mr-[69px] border-b-2 -mb-px transition-colors whitespace-nowrap",
                activeTab === tab ? "border-black" : "border-transparent hover:border-stone-300",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 px-[50px] py-8">
          {activeTab === "Work" && (
            <>
              {projectsLoading && <Spinner />}
              {projectsError && <ErrorMessage message={projectsError} />}
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
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent">
                        <p className="text-xl font-normal text-black">{project.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Heart size={20} className="text-black" />
                            <span className="text-base font-normal text-black">{project.likesCount ?? 0}</span>
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
