import { useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getProjects } from "../api/project.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";
import { MapPin, Link as LinkIcon, Briefcase, Plus } from "lucide-react";

type Tab = "Work" | "Moodboards" | "For sale" | "Appreciations" | "Your stats" | "Drafts";
const TABS: Tab[] = ["Work", "Moodboards", "For sale", "Appreciations", "Your stats", "Drafts"];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: projects, loading, error } = useAsync(getProjects);
  const [activeTab, setActiveTab] = useState<Tab>("Work");

  if (!user) return <Spinner />;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.userName;

  const stats = user.stats ?? {
    projectViews: 0,
    appreciations: 0,
    followers: 0,
    following: 0,
  };

  const socials = [
    { label: "Facebook" },
    { label: "Instagram" },
    { label: "YouTube" },
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
            { label: "Project Views", value: stats.projectViews },
            { label: "Appreciations", value: stats.appreciations },
            { label: "Followers", value: stats.followers },
            { label: "Following", value: stats.following },
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
              <div className="w-5 h-5 bg-black shrink-0" />
              <span className="flex-1 text-sm font-normal text-black">{s.label}</span>
              <div className="w-1 h-1 border border-black -rotate-45" />
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
                              <div className="w-5 h-5 bg-black shrink-0" />
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