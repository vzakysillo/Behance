import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/user.api";
import { routes } from "../routes";

type Section = "Base information" | "Work Experience" | "Teams" | "Socials" | "Links" | "Add section";
const SECTIONS: Section[] = ["Base information", "Work Experience", "Teams", "Socials", "Links", "Add section"];

const SOCIAL_PLATFORMS = [
  {
    name: "Facebook",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="#A2A0A0" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    icon: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <path d="M10.0004 0.399902C4.69839 0.399902 0.400391 4.6979 0.400391 9.9999C0.400391 15.3019 4.69839 19.5999 10.0004 19.5999C15.3024 19.5999 19.6004 15.3019 19.6004 9.9999C19.6004 4.6979 15.3024 0.399902 10.0004 0.399902ZM7.65039 13.9789H5.70639V7.7229H7.65039V13.9789ZM6.66639 6.9549C6.05239 6.9549 5.65539 6.5199 5.65539 5.9819C5.65539 5.4329 6.06439 5.0109 6.69139 5.0109C7.31839 5.0109 7.70239 5.4329 7.71439 5.9819C7.71439 6.5199 7.31839 6.9549 6.66639 6.9549ZM14.7504 13.9789H12.8064V10.5119C12.8064 9.7049 12.5244 9.1569 11.8214 9.1569C11.2844 9.1569 10.9654 9.5279 10.8244 9.8849C10.7724 10.0119 10.7594 10.1919 10.7594 10.3709V13.9779H8.81439V9.7179C8.81439 8.9369 8.78939 8.2839 8.76339 7.7219H10.4524L10.5414 8.5909H10.5804C10.8364 8.1829 11.4634 7.5809 12.5124 7.5809C13.7914 7.5809 14.7504 8.4379 14.7504 10.2799V13.9789Z" fill="#A2A0A0" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" fill="#A2A0A0" />
      </svg>
    ),
  },
];

import { GripHorizontal, User, ArrowLeft, Upload, ChevronDown } from "lucide-react";

const DragIcon = () => <GripHorizontal size={16} className="shrink-0 text-black" />;

const Divider = () => <div className="w-full h-px bg-[#575656] my-8" />;

export default function ProfileEditPage() {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("Base information");

  // Base information
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [headline, setHeadline] = useState(user?.specialization ?? "");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState(user?.location ?? "");
  const [city, setCity] = useState("");

  // Teams
  const [teamLink, setTeamLink] = useState("");

  // Links
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateMe({ firstName, lastName, specialization: headline, location });
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "h-10 px-2.5 border border-[#676767] text-sm text-black font-['Inter'] bg-white w-full outline-none focus:border-black placeholder:text-[#676767]";

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">

      {/* Top bar */}
      <div className="flex items-center justify-between h-16 px-8 border-b border-[#dadada]">
        <Link
          to={routes.profile.root()}
          className="flex items-center gap-3.5 no-underline text-black"
        >
          <ArrowLeft size={21} className="text-black" />
          <span className="text-xl">Edit profile</span>
        </Link>

        <div className="flex items-center gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-8 bg-[#b5b5b5] text-black text-sm hover:brightness-95 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex">

        {/* ── Left nav — sticky ── */}
        <nav className="ml-[20px] w-[200px] shrink-0 pt-10 sticky top-0 h-screen flex flex-col gap-0">
          {SECTIONS.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={[
                "w-full h-10 px-2.5 text-left text-sm font-['Inter'] transition-colors",
                activeSection === section
                  ? "bg-[#d3d3d3] text-black"
                  : "bg-[#f0efef] text-black hover:bg-[#e0e0e0]",
              ].join(" ")}
            >
              {section}
            </button>
          ))}
        </nav>

        {/* ── Scrollable content ── */}
        <div className="flex-1 px-16 py-10 max-w-[960px]">

          {/* ── Base information ── */}
          <section id="base-information">
            <div className="flex gap-10">

              {/* Avatar column */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-[137px] h-[137px] rounded-full bg-[#D9D9D9] overflow-hidden relative">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={137} className="text-white bg-[#D9D9D9] p-4" />
                  )}
                </div>
                <button
                  type="button"
                  className="w-[137px] h-7 bg-[#e3dddd] text-sm text-black mt-1 hover:brightness-95"
                >
                  Remove image
                </button>
              </div>

              {/* Fields column */}
              <div className="flex flex-col gap-4 flex-1">
                <p className="text-base text-black font-normal">Base information</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">First name</label>
                    <input className={inputClass} placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">Last name</label>
                    <input className={inputClass} placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black">Headline</label>
                  <input className={inputClass} placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black">Company</label>
                  <input className={inputClass} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">Location</label>
                    <input className={inputClass} placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">City</label>
                    <input className={inputClass} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* ── Work Experience ── */}
          <section id="work-experience">
            <p className="text-base text-black mb-3">Work Experience | Education</p>
            <div className="flex items-start gap-8">
              <div className="flex flex-col gap-1">
                <button type="button" className="text-sm text-black text-left hover:underline">+ Add work history</button>
                <button type="button" className="text-sm text-black text-left hover:underline">+ Add education</button>
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-[30px] px-4 border border-black text-sm text-black hover:bg-gray-50 flex-1 max-w-[579px]"
              >
                <Upload size={16} className="text-black" />
                Upload CV
              </button>
            </div>
          </section>

          <Divider />

          {/* ── Teams ── */}
          <section id="teams">
            <p className="text-base text-black mb-3">Teams</p>
            <input
              className={inputClass}
              placeholder="Team's link"
              value={teamLink}
              onChange={(e) => setTeamLink(e.target.value)}
            />
          </section>

          <Divider />

          {/* ── Socials ── */}
          <section id="socials">
            <p className="text-base text-black mb-1">Socials</p>
            <p className="text-sm text-black mb-4">
              Build trust with your network by connecting your social profiles
            </p>

            <div className="flex flex-col gap-2">
              {SOCIAL_PLATFORMS.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2.5 h-10">
                  <DragIcon />
                  <div className="flex items-center gap-2 w-[200px]">
                    {platform.icon}
                    <span className="text-sm text-[#a2a0a0]">{platform.name}</span>
                  </div>
                  <div className="flex-1 h-10 border border-[#a2a0a0] flex items-center justify-center">
                    <span className="text-sm text-[#a2a0a0]">Add link</span>
                  </div>
                  <button
                    type="button"
                    className="w-[100px] h-10 bg-[#b5b5b5] text-sm text-black shrink-0 hover:brightness-95"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className="flex items-center gap-2 mt-4 text-sm text-black">
              View more
              <ChevronDown size={15} className="text-black" />
            </button>
          </section>

          <Divider />

          {/* ── Links ── */}
          <section id="links">
            <p className="text-base text-black mb-4">Links</p>
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm text-black">Link title</label>
                <input className={inputClass} placeholder="Link title" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm text-black">URL</label>
                <input className={inputClass} placeholder="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              </div>
              <button
                type="button"
                className="h-10 px-6 bg-[#b5b5b5] text-sm text-black shrink-0 hover:brightness-95"
              >
                Add
              </button>
            </div>
          </section>

          <Divider />

          {/* ── Add section ── */}
          <section id="add-section">
            <button
              type="button"
              className="w-full h-10 border border-[#676767] text-base text-black hover:bg-gray-50"
            >
              + Add a custom section
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}