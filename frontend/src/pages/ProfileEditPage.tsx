import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/user.api";
import { routes } from "../routes";
import { SOCIAL_ICONS, SOCIAL_PLATFORMS, getSocialUrl, setSocialUrl } from "../utils/socials";
import { Divider } from "../components/ui";

type Section = "Base information" | "Work Experience" | "Teams" | "Socials" | "Links" | "Add section";
const SECTIONS: Section[] = ["Base information", "Work Experience", "Teams", "Socials", "Links", "Add section"];

import { GripHorizontal, User, ArrowLeft, Upload } from "lucide-react";

const DragIcon = () => <GripHorizontal size={16} className="shrink-0 text-black" />;

const editDividerClass = "w-full h-px bg-[#575656] my-8";

const profileEditSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string(),
  company: z.string(),
  location: z.string(),
  city: z.string(),
  bio: z.string(),
  teamLink: z.string(),
  socials: z.array(z.string()),
  linkTitle: z.string(),
  linkUrl: z.string(),
});

type ProfileEditValues = z.infer<typeof profileEditSchema>;

export default function ProfileEditPage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("Base information");

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      headline: user?.specialization ?? "",
      company: "",
      location: user?.location ?? "",
      city: "",
      bio: user?.bio ?? "",
      teamLink: "",
      socials: user?.socials ?? [],
      linkTitle: "",
      linkUrl: "",
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data: ProfileEditValues) =>
      updateMe({ firstName: data.firstName, lastName: data.lastName, specialization: data.headline, location: data.location, socials: data.socials, bio: data.bio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?._id] });
      refreshUser();
    },
  });

  const socials = watch("socials");

  const handleSave = async (data: ProfileEditValues) => {
    setError("");
    try {
      await saveMutation.mutateAsync(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    }
  };

  const updateSocial = (platform: string, url: string) => {
    setValue("socials", setSocialUrl(socials, platform, url), { shouldDirty: true });
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
            onClick={handleSubmit(handleSave)}
            disabled={isSubmitting}
            className="h-10 px-8 bg-[#b5b5b5] text-black text-sm hover:brightness-95 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
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
              onClick={() => {
                setActiveSection(section);
                const id = section.toLowerCase().replace(/\s+/g, "-");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
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
                    <input className={inputClass} placeholder="First name" {...register("firstName")} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">Last name</label>
                    <input className={inputClass} placeholder="Last name" {...register("lastName")} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black">Headline</label>
                  <input className={inputClass} placeholder="Headline" {...register("headline")} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black">Company</label>
                  <input className={inputClass} placeholder="Company" {...register("company")} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">Location</label>
                    <input className={inputClass} placeholder="Location" {...register("location")} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-black">City</label>
                    <input className={inputClass} placeholder="City" {...register("city")} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black">Bio</label>
                  <textarea
                    className={`${inputClass} h-[100px] py-2 resize-none`}
                    placeholder="Tell us about yourself"
                    {...register("bio")}
                  />
                </div>
              </div>
            </div>
          </section>

          <Divider className={editDividerClass} />

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

          <Divider className={editDividerClass} />

          {/* ── Teams ── */}
          <section id="teams">
            <p className="text-base text-black mb-3">Teams</p>
            <input
              className={inputClass}
              placeholder="Team's link"
              {...register("teamLink")}
            />
          </section>

          <Divider className={editDividerClass} />

          {/* ── Socials ── */}
          <section id="socials">
            <p className="text-base text-black mb-1">Socials</p>
            <p className="text-sm text-black mb-4">
              Build trust with your network by connecting your social profiles
            </p>

            <div className="flex flex-col gap-2">
              {SOCIAL_PLATFORMS.map((platform) => {
                const url = getSocialUrl(socials, platform);
                return (
                  <div key={platform} className="flex items-center gap-2.5 h-10">
                    <DragIcon />
                    <div className="flex items-center gap-2 w-[200px]">
                      {SOCIAL_ICONS[platform]}
                      <span className="text-sm text-[#a2a0a0]">{platform}</span>
                    </div>
                    <input
                      type="url"
                      className="flex-1 h-10 px-2.5 border border-[#a2a0a0] text-sm text-black font-['Inter'] bg-white outline-none focus:border-black placeholder:text-[#a2a0a0]"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => updateSocial(platform, e.target.value)}
                    />
                    {url && (
                      <button
                        type="button"
                        onClick={() => updateSocial(platform, "")}
                        className="w-[100px] h-10 bg-[#b5b5b5] text-sm text-black shrink-0 hover:brightness-95"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <Divider className={editDividerClass} />

          {/* ── Links ── */}
          <section id="links">
            <p className="text-base text-black mb-4">Links</p>
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm text-black">Link title</label>
                <input className={inputClass} placeholder="Link title" {...register("linkTitle")} />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm text-black">URL</label>
                <input className={inputClass} placeholder="URL" {...register("linkUrl")} />
              </div>
              <button
                type="button"
                className="h-10 px-6 bg-[#b5b5b5] text-sm text-black shrink-0 hover:brightness-95"
              >
                Add
              </button>
            </div>
          </section>

          <Divider className={editDividerClass} />

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
