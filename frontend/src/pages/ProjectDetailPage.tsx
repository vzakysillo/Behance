import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  CalendarDays,
  Heart,
  MessageSquare,
  Send,
  Share2,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  addProjectComment,
  addProjectLike,
  deleteProject,
  getFeedProject,
  getFeedProjects,
  getProject,
  getProjectComments,
  getProjectLikes,
  getProjects,
  removeProjectComment,
  removeProjectLike,
} from "../api/project.api";
import { followUser, getFollowing, unfollowUser } from "../api/follow.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage, Button, Tag, EmptyState, BackLarge, LabeledInput } from "../components/ui";
import ProjectPreview from "../components/ProjectPreview";
import { routes } from "../routes";
import type { IUser } from "../types";

interface ProjectDetailPageProps {
  publicView?: boolean;
}

const dividerClass = "border-t border-[#b8b8b8]";

const formatDate = (value?: string) => {
  if (!value) return "Publication date pending";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const getAuthorName = (author?: IUser, fallback = "Name Surname") => {
  if (!author) return fallback;
  const fullName = [author.firstName, author.lastName].filter(Boolean).join(" ").trim();
  return fullName || author.userName || fallback;
};

export default function ProjectDetailPage({ publicView = false }: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, token } = useAuth();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState("");
  const [reactionError, setReactionError] = useState("");
  const [followError, setFollowError] = useState("");

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id, publicView],
    queryFn: () => (publicView ? getFeedProject(id!) : getProject(id!)),
    enabled: !!id,
  });

  const { data: likes = [] } = useQuery({
    queryKey: ["projectLikes", id],
    queryFn: () => getProjectLikes(id!),
    enabled: !!id,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["projectComments", id],
    queryFn: () => getProjectComments(id!),
    enabled: !!id,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects", publicView ? "feed" : "all"],
    queryFn: () => (publicView ? getFeedProjects() : getProjects()),
  });

  const relatedProjects = useMemo(
    () => allProjects.filter((item) => item._id !== project?._id),
    [allProjects, project]
  );

  const likeMutation = useMutation({
    mutationFn: (): Promise<void> => {
      if (!id) throw new Error("No project id");
      const existingLike = likes.find((l) => l.userId === currentUser?._id);
      if (existingLike) return removeProjectLike(id, existingLike._id).then(() => {});
      return addProjectLike(id).then(() => {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectLikes", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (text: string) => {
      if (!id) throw new Error("No project id");
      return addProjectComment(id, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectComments", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCommentText("");
    },
  });

  const removeCommentMutation = useMutation({
    mutationFn: (commentId: string) => {
      if (!id) throw new Error("No project id");
      return removeProjectComment(id, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectComments", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("No project id");
      return deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projectLikes", id] });
      queryClient.invalidateQueries({ queryKey: ["projectComments", id] });
      navigate(routes.profile.root());
    },
  });

  const isLiked = likes.some((like) => like.userId === currentUser?._id);

  const author = useMemo<IUser | undefined>(() => {
    if (project?.author) return project.author;
    if (currentUser && project?.userId === currentUser._id) return currentUser;
    return undefined;
  }, [currentUser, project]);

  const isOwnProfile = !!author && author._id === currentUser?._id;

  const { data: currentUserFollowing } = useQuery({
    queryKey: ["following", currentUser?._id],
    queryFn: () => getFollowing(currentUser!._id),
    enabled: !!currentUser && !!author?._id && !isOwnProfile,
  });

  const isFollowing =
    currentUserFollowing?.some((u) => u.followingId._id === author?._id) ?? false;

  const followMutation = useMutation({
    mutationFn: () => {
      if (!author?._id) throw new Error("No author id");
      return isFollowing ? unfollowUser(author._id) : followUser(author._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers", author?._id] });
      queryClient.invalidateQueries({ queryKey: ["following", currentUser?._id] });
    },
  });

  const gallery = useMemo(() => {
    if (!project) return [];
    const assets = (project.assets ?? []).filter(
      (asset): asset is string => Boolean(asset) && asset !== project.cover
    );
    return [project.cover, ...assets].filter((image): image is string => Boolean(image));
  }, [project]);

  const similarProjects = useMemo(() => {
    if (!project) return [];
    return (project.similarProjects?.length ? project.similarProjects : relatedProjects)
      .filter((item) => item._id !== project._id)
      .slice(0, 4);
  }, [project, relatedProjects]);

  const handleLike = () => {
    if (!currentUser) {
      setReactionError("Please login to like projects.");
      return;
    }
    setReactionError("");
    likeMutation.mutate(undefined, {
      onError: (err) => setReactionError(err instanceof Error ? err.message : "Could not update like."),
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!currentUser) {
      setReactionError("Please login to comment.");
      return;
    }
    setReactionError("");
    addCommentMutation.mutate(commentText, {
      onError: (err) => setReactionError(err instanceof Error ? err.message : "Could not post comment."),
    });
  };

  const handleRemoveComment = (commentId: string) => {
    setReactionError("");
    removeCommentMutation.mutate(commentId, {
      onError: (err) => setReactionError(err instanceof Error ? err.message : "Could not delete comment."),
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this project?")) return;
    deleteMutation.mutate(undefined, {
      onError: (err) => setReactionError(err instanceof Error ? err.message : "Could not delete project."),
    });
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!project) return <ErrorMessage message="Project not found." />;

  const fallbackDescription =
    "This project does not have a description yet. Add a project story in the backend and it will appear here.";
  const authorName = getAuthorName(author);
  const authorSpecialization = author?.specialization || "Specialization";
  const likesCount = likes.length || project.likesCount || 0;
  const commentsCount = comments.length || project.commentsCount || 0;

  const scrollToComments = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans text-black">
      <main className="mx-auto min-h-screen max-w-[1756px] px-[50px] pb-20 pt-[30px] max-[768px]:px-5">
        <BackLarge to={publicView ? routes.home() : routes.profile.root()} className="mb-5" />

        {/* Author header */}
        <section className="mb-8 flex items-center justify-between gap-10 max-[768px]:flex-col max-[768px]:items-start">
          <div className="relative h-[108px] w-[298px] shrink-0">
            <Link
              to={author ? routes.publicProfile(author._id) : routes.home()}
              className="block h-[90px] w-[90px] no-underline"
            >
              {author?.avatar ? (
                <img src={author.avatar} alt={authorName} className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="h-full w-full rounded-full bg-[#d9d9d9]" />
              )}
            </Link>
            <Link
              to={author ? routes.publicProfile(author._id) : routes.home()}
              className="absolute left-32 top-[23px] text-2xl font-medium text-[#1b1b1b] no-underline hover:underline"
            >
              {authorName}
            </Link>
            <p className="absolute left-32 top-[61px] text-xl text-[#878787]">{authorSpecialization}</p>
          </div>
          {publicView && author && !isOwnProfile && token && currentUser && (
            <div className="flex flex-col items-end gap-1">
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                icon={<UserPlus size={16} />}
                onClick={() =>
                  followMutation.mutate(undefined, {
                    onError: (err) =>
                      setFollowError(err instanceof Error ? err.message : "Could not update follow."),
                  })
                }
                className="inline-flex w-[284px] items-center justify-center gap-2.5 px-6"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              {followError && <p className="text-sm text-red-600">{followError}</p>}
            </div>
          )}
        </section>

          {/* Cover + assets: one rounded rect */}
          <section className="mb-8 flex w-full flex-col overflow-hidden rounded-[15px]">
            <div className="aspect-[1262/819] w-full bg-[#a7a7a7] max-[768px]:aspect-[4/3]">
              {gallery[0] ? (
                <img src={gallery[0]} alt={project.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-base text-neutral-600">
                  project
                </div>
              )}
            </div>
            {gallery.slice(1).map((asset, index) => (
              <img
                key={`${asset}-${index}`}
                src={asset}
                alt={`${project.name} asset ${index + 1}`}
                className="w-full object-cover"
              />
            ))}
          </section>

          <section className="space-y-7">
            <div>
              <h1 className="mb-2 text-sm font-semibold uppercase leading-5">{project.name}</h1>
              <p className="max-w-[1260px] text-xs font-normal leading-4 text-black">
                {project.description || fallbackDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                icon={<Heart size={16} fill={isLiked ? "currentColor" : "none"} />}
                onClick={handleLike}
                className="inline-flex items-center justify-center gap-2 px-6"
              >
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button variant="secondary" icon={<Bookmark size={16} />} className="inline-flex items-center justify-center gap-2 px-6">
                Save
              </Button>
              <Button variant="secondary" icon={<Share2 size={16} />} className="inline-flex items-center justify-center gap-2 px-6">
                Share
              </Button>
              {!project.disableComments && (
                <Button
                  variant="secondary"
                  icon={<MessageSquare size={16} />}
                  onClick={scrollToComments}
                  className="inline-flex items-center justify-center gap-2 px-6"
                >
                  Add comment
                </Button>
              )}
              <span className="ml-auto inline-flex items-center gap-2 text-base font-normal text-brand-600">
                <CalendarDays size={16} />
                {formatDate(project.createdAt)}
              </span>
            </div>

            {reactionError && <p className="text-sm text-red-600">{reactionError}</p>}

            <div className={dividerClass} />

            <section>
              <h2 className="mb-4 text-sm font-medium leading-5">Tags</h2>
              {(project.tags ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags!.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No tags yet." />
              )}
            </section>

            <div className={dividerClass} />

            <section>
              <h2 className="mb-4 text-sm font-medium leading-5">Tools used</h2>
              {(project.toolsUsed ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.toolsUsed?.map((tool) => (
                    <Tag key={tool} label={tool} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No tools listed yet." />
              )}
            </section>

            <div className={dividerClass} />

            <section id="comments">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-sm font-medium leading-5">Comments</h2>
                <span className="inline-flex items-center gap-2 text-xs text-neutral-600">
                  <Heart size={12} />
                  {likesCount}
                  <MessageSquare size={12} className="ml-3" />
                  {commentsCount}
                </span>
              </div>

              {project.disableComments ? (
                <p className="text-xs text-neutral-500">Comments are disabled for this project.</p>
              ) : !token || !currentUser ? (
                <p className="text-xs text-neutral-600">
                  <Link to={routes.auth.login()} className="text-black underline">
                    Login
                  </Link>{" "}
                  to like or comment.
                </p>
              ) : (
                <form onSubmit={handleAddComment} className="mb-6 flex gap-4 max-[768px]:flex-col">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
                    {currentUser.avatar && (
                      <img src={currentUser.avatar} alt={currentUser.userName} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 items-end gap-3 max-[768px]:flex-col">
                    <LabeledInput label="Write a comment" className="flex-1 w-full">
                      <textarea
                        className="w-full h-[100px] resize-none bg-transparent text-sm leading-[1.2] text-ink outline-none placeholder:text-line"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment"
                      />
                    </LabeledInput>
                    <Button
                      type="submit"
                      variant="primary"
                      icon={<Send size={16} />}
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-6"
                    >
                      Send
                    </Button>
                  </div>
                </form>
              )}

              {!project.disableComments && comments.length === 0 && (
                <EmptyState message="No comments yet." />
              )}

              {!project.disableComments && comments.length > 0 && (
                <ul className="space-y-5">
                  {comments.map((comment) => {
                    const commentAuthor = comment.author || (comment.userId === currentUser?._id ? currentUser : undefined);
                    return (
                      <li key={comment._id} className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
                          {commentAuthor?.avatar && (
                            <img
                              src={commentAuthor.avatar}
                              alt={getAuthorName(commentAuthor, "Comment author")}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-3">
                            <span className="text-xs font-medium">{getAuthorName(commentAuthor, "User")}</span>
                            <time dateTime={comment.createdAt} className="text-[10px] text-neutral-500">
                              {formatDate(comment.createdAt)}
                            </time>
                          </div>
                          <p className="text-xs leading-4">{comment.text}</p>
                          {!publicView && comment.userId === currentUser?._id && (
                            <button
                              type="button"
                              onClick={() => handleRemoveComment(comment._id)}
                              className="mt-2 inline-flex items-center gap-2 text-xs text-red-700 hover:text-red-900"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <div className={dividerClass} />

            <section>
              <h2 className="mb-4 text-sm font-medium leading-5">Similar projects</h2>
              {similarProjects.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-[768px]:grid-cols-1">
                  {similarProjects.map((item) => (
                    <ProjectPreview key={item._id} project={item} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-[768px]:grid-cols-1">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="aspect-[626/384] bg-[#a7a7a7]" />
                  ))}
                </div>
              )}
            </section>

            {!publicView && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-8 items-center justify-center gap-2 bg-red-100 px-3 text-xs text-red-700 hover:bg-red-200"
              >
                <Trash2 size={12} />
                Delete project
              </button>
            )}
          </section>
        </main>
    </div>
  );
}
