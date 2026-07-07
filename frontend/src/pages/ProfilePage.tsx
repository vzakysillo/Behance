import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getProjects } from "../api/project.api";
import { getFollowers, getFollowing } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";
import { MapPin, Link as LinkIcon, Briefcase, Plus, ChevronRight, Heart } from "lucide-react";

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

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.userName;

  const likesCount = user.stats?.likes ?? 0;

  const socials = [
    {
      label: "Facebook",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="#A2A0A0" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" fill="#A2A0A0" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <path d="M21.8 7.6C21.6 6.8 21 6.2 20.2 6C18.8 5.6 12 5.6 12 5.6C12 5.6 5.2 5.6 3.8 6C3 6.2 2.4 6.8 2.2 7.6C2 9 2 12 2 12C2 12 2 15 2.2 16.4C2.4 17.2 3 17.8 3.8 18C5.2 18.4 12 18.4 12 18.4C12 18.4 18.8 18.4 20.2 18C21 17.8 21.6 17.2 21.8 16.4C22 15 22 12 22 12C22 12 22 9 21.8 7.6ZM10 15.2V8.8L15.5 12L10 15.2Z" fill="#A2A0A0" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-white font-['Inter',sans-serif]">

      {/* ── Left info panel ── */}
      <aside className="w-[340px] shrink-0 border-r border-stone-200 flex flex-col px-[50px] py-10 gap-0">

        {/* Avatar */}
        <div className="w-[144px] h-[144px] rounded-full bg-zinc-300 overflow-hidden mb-4 self-start">
          {user.avatar
            ? <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-zinc-300" />}
        </div>

        {/* Name & specialization */}
        <h1 className="text-2xl font-normal text-black leading-9">{fullName}</h1>
        <p className="text-xl font-normal text-zinc-600 mb-3">{user.specialization ?? "Specialization"}</p>

        {/* Location */}
        <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
          <MapPin size={24} className="text-zinc-400 shrink-0" />
          <span>{user.location ?? "Location"}</span>
        </div>

        {/* Available for freelance */}
        <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
          <Briefcase size={24} className="text-zinc-400 shrink-0" />
          <span>{user.availableForFreelance ? "Available for freelance" : "Not available for freelance"}</span>
        </div>

        {/* Username / link */}
        <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
          <LinkIcon size={24} className="text-zinc-400 shrink-0" />
          <span>{user.userName}</span>
        </div>

        {/* Edit buttons */}
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
          {socials.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5 py-2.5">
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                {s.icon}
              </div>
              <span className="flex-1 text-sm font-normal text-black">{s.label}</span>
              <ChevronRight size={12} className="text-black" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-stone-300 my-6" />

        {/* Teams */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-normal text-black">Teams</p>
            <button type="button" className="flex items-center justify-center">
              <Plus size={16} className="text-stone-500" />
            </button>
          </div>
          {(user.teams ?? [{ name: "Teams name", location: "Location" }]).map((team, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-16 h-16 rounded-full bg-zinc-300 shrink-0 overflow-hidden">
                {team.avatar && <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-normal text-black">{team.name}</span>
                <span className="text-sm font-normal text-black">{team.location}</span>
              </div>
            </div>
          ))}
          <div className="w-full h-px bg-stone-300 mt-3" />
        </div>

        {/* About me */}
        <p className="text-base font-normal text-black mb-3">About me</p>
        <p className="text-sm font-normal text-black leading-5">
          {user.aboutMe ?? "No bio yet."}
        </p>

        {/* Member since */}
        <p className="text-base font-normal text-zinc-400 mt-auto pt-10">
          {user.memberSince ? `Member since ${user.memberSince}` : ""}
        </p>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="mt-4 text-sm text-gray-400 hover:text-black text-left"
        >
          Log out
        </button>
      </aside>

      {/* ── Main content area ── */}
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
              {tab === "Drafts" ? `Drafts` : tab}
            </button>
          ))}
        </div>

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