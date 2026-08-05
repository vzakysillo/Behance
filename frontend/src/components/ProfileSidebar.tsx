import type { ReactNode } from "react";
import { MapPin, Link as LinkIcon, Briefcase, ChevronRight } from "lucide-react";
import { SOCIAL_ICONS, parseSocials } from "../utils/socials";
import type { IUser } from "../types";
import { Divider } from "./ui";

const getMemberSinceDate = (id: string): string => {
  const timestamp = parseInt(id.slice(0, 8), 16) * 1000;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

interface ProfileSidebarProps {
  user: IUser;
  likesCount: number;
  followersCount: number;
  followingCount: number;
  actionButtons?: ReactNode;
  logoutButton?: ReactNode;
}

export default function ProfileSidebar({
  user,
  likesCount,
  followersCount,
  followingCount,
  actionButtons,
  logoutButton,
}: ProfileSidebarProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.userName;
  const parsedSocials = parseSocials(user.socials ?? []);

  return (
    <aside className="w-[340px] shrink-0 flex flex-col px-[50px] pt-[177px] pb-10 gap-0">

      {/* Avatar */}
      <div className="w-[176px] h-[176px] rounded-full bg-zinc-300 overflow-hidden mb-4 self-start">
        {user.avatar
          ? <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-zinc-300" />}
      </div>

      {/* Name & specialization */}
      <h1 className="text-2xl font-normal text-black leading-9">{fullName}</h1>
      <p className="text-xl font-normal text-zinc-600 mb-3">{user.specialization ?? "Specialization"}</p>

      {/* Location */}
      <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
        <MapPin size={24} className="text-black shrink-0" />
        <span>{user.location ?? "Location"}</span>
      </div>

      {/* Available for freelance */}
      <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
        <Briefcase size={24} className="text-black shrink-0" />
        <span>{user.availableForFreelance ? "Available for freelance" : "Not available for freelance"}</span>
      </div>

      {/* Username / link */}
      <div className="flex items-center gap-2.5 py-2.5 text-sm text-black">
        <LinkIcon size={24} className="text-black shrink-0" />
        <span>{user.userName}</span>
      </div>

      {/* Action buttons slot */}
      {actionButtons}

      <Divider />

      {/* Statistics */}
      <p className="text-base font-normal text-black mb-2">Statistics</p>
      <div className="flex flex-col">
        {[
          { label: "Appreciations", value: likesCount },
          { label: "Followers", value: followersCount },
          { label: "Following", value: followingCount },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between py-2.5">
            <span className="text-sm font-normal text-black">{s.label}</span>
            <span className="text-base font-normal text-black">{s.value}</span>
          </div>
        ))}
      </div>

      <Divider />

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
            <ChevronRight size={12} className="text-black" />
          </a>
        ))}
        {parsedSocials.length === 0 && (
          <p className="text-sm text-neutral-500">No social links yet.</p>
        )}
      </div>

      <Divider />

      {/* Teams */}
      <div className="flex flex-col mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-normal text-black">Teams</p>
        </div>
        {(user.teams ?? []).map((team, i) => (
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
        <Divider className="mt-3" />
      </div>

      {/* About me */}
      <p className="text-base font-normal text-black mb-3">About me</p>
      <p className="text-sm font-normal text-black leading-5">
        {user.bio || "No bio yet."}
      </p>

      {/* Member since */}
      <p className="text-sm font-normal text-zinc-400 mt-auto pt-10">
        Member since {getMemberSinceDate(user._id)}
      </p>

      {/* Logout button slot */}
      {logoutButton}
    </aside>
  );
}
