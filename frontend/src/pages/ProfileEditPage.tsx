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
import { Button, Divider, LabeledInput } from "../components/ui";

type Section = "Base Information" | "Work Experience" | "Teams" | "Socials" | "Links" | "Add section";
const SECTIONS: Section[] = ["Base Information", "Work Experience", "Teams", "Socials", "Links", "Add section"];

import { GripHorizontal, User, ArrowLeft, Upload, Plus } from "lucide-react";
import { uploadAvatar } from "../api/upload.api";

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
  const [activeSection, setActiveSection] = useState<Section>("Base Information");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [socialReset, setSocialReset] = useState<Record<string, number>>({});

  const formDefaults: ProfileEditValues = {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    headline: user?.specialization ?? "",
    company: user?.company ?? "",
    location: user?.location ?? "",
    city: user?.city ?? "",
    bio: user?.bio ?? "",
    teamLink: "",
    socials: user?.socials ?? [],
    linkTitle: "",
    linkUrl: "",
  };

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: formDefaults,
  });

  const saveMutation = useMutation({
    mutationFn: (data: ProfileEditValues) =>
      updateMe({
        firstName: data.firstName,
        lastName: data.lastName,
        specialization: data.headline,
        company: data.company,
        location: data.location,
        city: data.city,
        socials: data.socials,
        bio: data.bio,
      }),
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

  const handleRemoveSocial = (platform: string) => {
    updateSocial(platform, "");
    setSocialReset((prev) => ({ ...prev, [platform]: (prev[platform] ?? 0) + 1 }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await uploadAvatar(file);
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload avatar.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateMe({ avatar: "" });
      refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove avatar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans">

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
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(handleSave)}
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex">

        {/* Left nav — sticky */}
        <nav className="ml-[20px] w-[285px] shrink-0 pt-10 sticky top-0">
          <div className="flex flex-col w-[285px] h-60">
            {SECTIONS.map((section, i) => {
              const active = activeSection === section;
              const isFirst = i === 0;
              const isLast = i === SECTIONS.length - 1;
              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => {
                    setActiveSection(section);
                    const id = section.toLowerCase().replace(/\s+/g, "-");
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={[
                    "flex justify-start items-center w-full h-10 gap-2.5 p-2.5 text-base text-left font-sans transition-colors",
                    isFirst ? "rounded-tl-[15px] rounded-tr-[15px]" : "",
                    isLast ? "rounded-bl-[15px] rounded-br-[15px]" : "",
                    active ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-white text-ink hover:bg-brand-100",
                  ].join(" ")}
                >
                  {section}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Scrollable content */}
        <div className="flex-1 px-16 py-10 max-w-[960px]">

          {/* Base Information */}
          <section id="base-information">
            <div className="flex gap-10">

              {/* Avatar column */}
              <div className="flex flex-col items-center shrink-0">
                <label className="w-[137px] h-[137px] rounded-full bg-[#D9D9D9] overflow-hidden relative cursor-pointer group">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={137} className="text-white bg-[#D9D9D9] p-4" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus size={32} className="text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={avatarUploading}
                  />
                </label>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleRemoveAvatar}
                  disabled={!user?.avatar}
                  className="w-[137px] mt-1"
                >
                  {avatarUploading ? "Uploading..." : "Remove image"}
                </Button>
              </div>

              {/* Fields column */}
              <div className="flex flex-col gap-4 flex-1">
                <p className="text-base text-black font-normal">Base Information</p>

                <div className="grid grid-cols-2 gap-3">
                  <LabeledInput label="First name" placeholder="First name" {...register("firstName")} defaultValue={formDefaults.firstName} />
                  <LabeledInput label="Last name" placeholder="Last name" {...register("lastName")} defaultValue={formDefaults.lastName} />
                </div>

                <LabeledInput label="Headline" placeholder="Headline" {...register("headline")} defaultValue={formDefaults.headline} />

                <LabeledInput label="Company" placeholder="Company" {...register("company")} defaultValue={formDefaults.company} />

                <div className="grid grid-cols-2 gap-3">
                  <LabeledInput label="Location" placeholder="Location" {...register("location")} defaultValue={formDefaults.location} />
                  <LabeledInput label="City" placeholder="City" {...register("city")} defaultValue={formDefaults.city} />
                </div>

                <LabeledInput label="Bio">
                  <textarea
                    className="w-full h-[100px] bg-transparent resize-none outline-none text-sm leading-[1.2] text-ink placeholder:text-line"
                    placeholder="Tell us about yourself"
                    {...register("bio")}
                  />
                </LabeledInput>
              </div>
            </div>
          </section>

          <Divider className={editDividerClass} />

          {/* Work Experience */}
          <section id="work-experience">
            <p className="text-base text-black mb-3">Work Experience | Education</p>
            <div className="flex items-start gap-8">
              <div className="flex flex-col gap-1">
                <button type="button" className="text-sm text-black text-left hover:underline">+ Add work history</button>
                <button type="button" className="text-sm text-black text-left hover:underline">+ Add education</button>
              </div>
              <Button
                type="button"
                variant="secondary"
                icon={<Upload size={16} />}
                className="flex-1 max-w-[579px] inline-flex items-center justify-center gap-2"
              >
                Upload CV
              </Button>
            </div>
          </section>

          <Divider className={editDividerClass} />

          {/* Teams */}
          <section id="teams">
            <p className="text-base text-black mb-3">Teams</p>
            <LabeledInput label="Team's link" placeholder="Team's link" {...register("teamLink")} defaultValue={formDefaults.teamLink} />
          </section>

          <Divider className={editDividerClass} />

          {/* Socials */}
          <section id="socials">
            <p className="text-base text-black mb-1">Socials</p>
            <p className="text-sm text-black mb-4">
              Build trust with your network by connecting your social profiles
            </p>

            <div className="flex flex-col gap-2">
              {SOCIAL_PLATFORMS.map((platform) => {
                const url = getSocialUrl(socials, platform);
                return (
                  <div key={platform} className="flex items-start gap-2.5">
                    <DragIcon />
                    <div className="shrink-0 mt-[2px]">{SOCIAL_ICONS[platform]}</div>
                    <LabeledInput
                      key={`${platform}-${socialReset[platform] ?? 0}`}
                      label={platform}
                      type="url"
                      defaultValue={url}
                      placeholder="https://..."
                      onChange={(e) => updateSocial(platform, e.target.value)}
                      className="flex-1"
                    />
                    {url && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(platform)}
                        className="w-[100px] h-[45px] rounded-[30px] bg-brand-600 text-sm text-white shrink-0 hover:bg-brand-700 mt-[27px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <Divider className={editDividerClass} />

          {/* Links */}
          <section id="links">
            <p className="text-base text-black mb-4">Links</p>
            <div className="flex items-end gap-3">
              <LabeledInput label="Link title" placeholder="Link title" className="flex-1" {...register("linkTitle")} defaultValue={formDefaults.linkTitle} />
              <LabeledInput label="URL" placeholder="URL" className="flex-1" {...register("linkUrl")} defaultValue={formDefaults.linkUrl} />
            </div>
          </section>

          <Divider className={editDividerClass} />

          {/* Add section */}
          <section id="add-section">
            <Button
              type="button"
              variant="secondary"
              icon={<Plus size={16} />}
              className="w-full inline-flex items-center justify-center gap-2"
            >
              Add a custom section
            </Button>
          </section>

        </div>
      </div>
    </div>
  );
}
