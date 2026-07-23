import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Heart,
  MessageSquare,
  Send,
  Share2,
  Trash2,
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
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import AuthorPanel from "../components/AuthorPanel";
import ProjectPreview from "../components/ProjectPreview";
import { routes } from "../routes";
import type { IComment, ILike, IProject, IUser } from "../types";

interface ProjectDetailPageProps {
  publicView?: boolean;
}

const buttonClass =
  "h-7 px-3 bg-[#e8e5e5] text-black text-xs font-normal inline-flex items-center justify-center gap-2 transition-colors hover:bg-[#d8d5d5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

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
    mutationFn: () => {
      if (!id) throw new Error("No project id");
      const existingLike = likes.find((l) => l.userId === currentUser?._id);
      if (existingLike) return removeProjectLike(id, existingLike._id);
      return addProjectLike(id);
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

  const gallery = useMemo(() => {
    if (!project) return [];
    return [project.cover, ...(project.assets ?? [])].filter((image): image is string => Boolean(image));
  }, [project]);

  const similarProjects = useMemo(() => {
    if (!project) return [];
    return (project.similarProjects?.length ? project.similarProjects : relatedProjects)
      .filter((item) => item._id !== project._id)
      .slice(0, 4);
  }, [project, relatedProjects]);

  const authorProjects = useMemo(() => {
    if (!project) return [];
    const seen = new Set<string>();
    return (project.authorProjects?.length
      ? project.authorProjects
      : relatedProjects.filter((item) => item.userId === project.userId)
    )
      .filter((item) => {
        if (item._id === project._id || seen.has(item._id)) return false;
        seen.add(item._id);
        return true;
      })
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

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-black">
      <div className="mx-auto grid min-h-screen max-w-[1756px] grid-cols-[minmax(0,1fr)_494px] max-[1280px]:grid-cols-1">
        <main className="min-w-0 px-[50px] pb-20 pt-[30px] max-[768px]:px-5">
          <Link
            to={publicView ? routes.home() : routes.profile.root()}
            className="mb-5 inline-flex h-5 items-center gap-2 text-xs font-medium text-black no-underline hover:underline"
          >
            <ArrowLeft size={12} strokeWidth={2} />
            Back
          </Link>

          <section className="relative mb-8 aspect-[1262/819] w-full bg-[#a7a7a7] max-[768px]:aspect-[4/3]">
            {gallery[0] ? (
              <img src={gallery[0]} alt={project.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-base text-neutral-600">
                project
              </div>
            )}
          </section>

          {(project.assets ?? []).length > 0 && (
            <section className="mb-8 flex flex-col">
              {project.assets!.map((asset, index) => (
                <img
                  key={`${asset}-${index}`}
                  src={asset}
                  alt={`${project.name} asset ${index + 1}`}
                  className="w-full object-cover"
                />
              ))}
            </section>
          )}

          <section className="space-y-7">
            <div>
              <h1 className="mb-2 text-sm font-semibold uppercase leading-5">{project.name}</h1>
              <p className="max-w-[1260px] text-xs font-normal leading-4 text-black">
                {project.description || fallbackDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleLike}
                className={`${buttonClass} min-w-24 ${isLiked ? "bg-black text-white hover:bg-neutral-800" : ""}`}
              >
                <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
                {isLiked ? "Liked" : "Like"}
              </button>
              <button type="button" className={`${buttonClass} min-w-24`}>
                <Bookmark size={12} />
                Save
              </button>
              <button type="button" className={`${buttonClass} min-w-24`}>
                <Share2 size={12} />
                Share
              </button>
              {!project.disableComments && (
                <a href="#comments" className={`${buttonClass} min-w-40 no-underline`}>
                  <MessageSquare size={12} />
                  Add comment
                </a>
              )}
              <div className={`${buttonClass} ml-auto min-w-52 max-[768px]:ml-0 max-[768px]:min-w-0`}>
                <CalendarDays size={12} />
                {formatDate(project.createdAt)}
              </div>
            </div>

            {reactionError && <p className="text-sm text-red-600">{reactionError}</p>}

            <div className={dividerClass} />

            <section>
              <h2 className="mb-4 text-sm font-medium leading-5">Tags</h2>
              {(project.tags ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags!.map((tag) => (
                    <span key={tag} className="inline-flex h-7 items-center bg-[#e8e5e5] px-3 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">No tags yet.</p>
              )}
            </section>

            <div className={dividerClass} />

            <section>
              <h2 className="mb-4 text-sm font-medium leading-5">Tools used</h2>
              {(project.toolsUsed ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.toolsUsed?.map((tool) => (
                    <span key={tool} className="inline-flex h-7 items-center bg-[#e8e5e5] px-3 text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">No tools listed yet.</p>
              )}
            </section>

            {gallery.length > 1 && (
              <>
                <div className={dividerClass} />
                <section className="grid grid-cols-2 gap-5 max-[768px]:grid-cols-1">
                  {gallery.slice(1).map((photo, index) => (
                    <img
                      key={`${photo}-${index}`}
                      src={photo}
                      alt={`${project.name} asset ${index + 1}`}
                      className="aspect-[626/384] w-full bg-[#a7a7a7] object-cover"
                    />
                  ))}
                </section>
              </>
            )}

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
                  <div className="flex flex-1 gap-3">
                    <textarea
                      className="min-h-20 flex-1 resize-y border border-neutral-400 px-3 py-2 text-xs leading-4 outline-none focus:border-black"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment"
                    />
                    <button type="submit" className={`${buttonClass} w-10 px-0`} aria-label="Post comment">
                      <Send size={12} />
                    </button>
                  </div>
                </form>
              )}

              {!project.disableComments && comments.length === 0 && (
                <p className="text-xs text-neutral-500">No comments yet.</p>
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

        <aside className="h-screen overflow-y-auto bg-[#e7e7e7] px-[50px] py-[50px] max-[1280px]:static max-[1280px]:h-auto max-[768px]:px-5">
          <AuthorPanel
            author={author}
            authorName={authorName}
            authorSpecialization={authorSpecialization}
            projects={authorProjects}
          />
        </aside>
      </div>
    </div>
  );
}
