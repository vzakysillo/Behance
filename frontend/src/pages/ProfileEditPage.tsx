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

const DragIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="shrink-0">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.5 12C2.5 11.8674 2.55268 11.7402 2.64645 11.6464C2.74021 11.5527 2.86739 11.5 3 11.5H13C13.1326 11.5 13.2598 11.5527 13.3536 11.6464C13.4473 11.7402 13.5 11.8674 13.5 12C13.5 12.1326 13.4473 12.2598 13.3536 12.3536C13.2598 12.4473 13.1326 12.5 13 12.5H3C2.86739 12.5 2.74021 12.4473 2.64645 12.3536C2.55268 12.2598 2.5 12.1326 2.5 12ZM2.5 8C2.5 7.86739 2.55268 7.74021 2.64645 7.64645C2.74021 7.55268 2.86739 7.5 3 7.5H13C13.1326 7.5 13.2598 7.55268 13.3536 7.64645C13.4473 7.74021 13.5 7.86739 13.5 8C13.5 8.13261 13.4473 8.25979 13.3536 8.35355C13.2598 8.44732 13.1326 8.5 13 8.5H3C2.86739 8.5 2.74021 8.44732 2.64645 8.35355C2.55268 8.25979 2.5 8.13261 2.5 8ZM2.5 4C2.5 3.86739 2.55268 3.74021 2.64645 3.64645C2.74021 3.55268 2.86739 3.5 3 3.5H13C13.1326 3.5 13.2598 3.55268 13.3536 3.64645C13.4473 3.74021 13.5 3.86739 13.5 4C13.5 4.13261 13.4473 4.25979 13.3536 4.35355C13.2598 4.44732 13.1326 4.5 13 4.5H3C2.86739 4.5 2.74021 4.44732 2.64645 4.35355C2.55268 4.25979 2.5 4.13261 2.5 4Z" fill="black" />
  </svg>
);

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
          <svg width={21} height={15} viewBox="0 0 21 15" fill="none">
            <path d="M0.292892 6.65691C-0.0976315 7.04743 -0.0976315 7.6806 0.292892 8.07112L6.65685 14.4351C7.04738 14.8256 7.68054 14.8256 8.07107 14.4351C8.46159 14.0446 8.46159 13.4114 8.07107 13.0209L2.41421 7.36401L8.07107 1.70716C8.46159 1.31664 8.46159 0.68347 8.07107 0.292946C7.68054 -0.0975785 7.04738 -0.0975785 6.65685 0.292946L0.292892 6.65691ZM21 7.36401V6.36401L1 6.36401V7.36401V8.36401L21 8.36401V7.36401Z" fill="black" />
          </svg>
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
                    <svg width={137} height={137} viewBox="0 0 137 137" fill="none">
                      <ellipse cx="68.4999" cy="68.5015" rx="68.4999" ry="68.5015" fill="#D9D9D9" />
                      <ellipse cx="68.5003" cy="52.4394" rx="27.8724" ry="27.873" fill="white" />
                      <path d="M68.501 88.8154C89.826 88.8155 108.631 98.7788 119.76 113.94C107.211 128.087 88.8971 137.003 68.5 137.003C48.1027 137.003 29.788 128.087 17.2393 113.94C28.3679 98.7781 47.1753 88.8154 68.501 88.8154Z" fill="white" />
                    </svg>
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
                Upload CV
                <svg width={8} height={11} viewBox="0 0 8 11" fill="none">
                  <path d="M4.03519 0.146446C3.83993 -0.0488157 3.52335 -0.0488157 3.32809 0.146446L0.146107 3.32843C-0.0491552 3.52369 -0.0491552 3.84027 0.146107 4.03553C0.341369 4.2308 0.657952 4.2308 0.853214 4.03553L3.68164 1.20711L6.51007 4.03553C6.70533 4.2308 7.02191 4.2308 7.21717 4.03553C7.41244 3.84027 7.41244 3.52369 7.21717 3.32843L4.03519 0.146446ZM3.68164 10.5L4.18164 10.5L4.18164 0.5L3.68164 0.5L3.18164 0.5L3.18164 10.5L3.68164 10.5Z" fill="black" />
                </svg>
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
              <svg width={15} height={9} viewBox="0 0 15 9" fill="none">
                <path d="M1 1L7.5 7.5L14 1" stroke="black" strokeWidth={2} strokeLinecap="round" />
              </svg>
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