import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addProjectComment,
  addProjectLike,
  deleteProject,
  getFeedProject,
  getProject,
  getProjectComments,
  getProjectLikes,
  removeProjectComment,
  removeProjectLike,
} from "../api/project.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";
import type { IComment, ILike, IProject } from "../types";

interface ProjectDetailPageProps {
  publicView?: boolean;
}

export default function ProjectDetailPage({ publicView = false }: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, token } = useAuth();

  const [project, setProject] = useState<IProject | null>(null);
  const [likes, setLikes] = useState<ILike[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reactionError, setReactionError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (!cancelled) setLoading(true);
        return Promise.all([
          publicView ? getFeedProject(id) : getProject(id),
          getProjectLikes(id),
          getProjectComments(id),
        ]);
      })
      .then(([p, projectLikes, projectComments]) => {
        if (cancelled) return;
        setProject(p);
        setLikes(projectLikes);
        setComments(projectComments);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load project.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, publicView]);

  const isLiked = likes.some((like) => like.userId === currentUser?._id);

  const handleLike = async () => {
    if (!id) return;
    setReactionError("");

    if (!currentUser) {
      setReactionError("Please login to like projects.");
      return;
    }

    try {
      if (isLiked) {
        await removeProjectLike(id);
        setLikes(likes.filter((like) => like.userId !== currentUser?._id));
        return;
      }
      const like = await addProjectLike(id);
      setLikes([...likes, like]);
    } catch (err) {
      setReactionError(err instanceof Error ? err.message : "Could not update like.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;
    setReactionError("");

    if (!currentUser) {
      setReactionError("Please login to comment.");
      return;
    }

    try {
      const comment = await addProjectComment(id, commentText);
      setComments([comment, ...comments]);
      setCommentText("");
    } catch (err) {
      setReactionError(err instanceof Error ? err.message : "Could not post comment.");
    }
  };

  const handleRemoveComment = async (commentId: string) => {
    if (!id) return;
    setReactionError("");
    try {
      await removeProjectComment(id, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      setReactionError(err instanceof Error ? err.message : "Could not delete comment.");
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      navigate(routes.profile.projects());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete project.");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!project) return <ErrorMessage message="Project not found." />;

  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full text-sm outline-none focus:border-gray-500";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <nav className="mb-4">
        <Link
          to={publicView ? routes.home() : routes.profile.projects()}
          className="text-sm text-blue-600 hover:underline"
        >
          {publicView ? "Home" : "Projects"}
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">{project.name}</h1>

      {project.cover && (
        <img src={project.cover} alt={project.name} className="w-full h-64 object-cover rounded mb-4" />
      )}

      {project.description && <p className="text-gray-700 mb-4">{project.description}</p>}

      <section className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleLike}
          className={`px-4 py-2 text-sm rounded ${
            isLiked ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
        <span className="text-sm text-gray-600">{likes.length} likes</span>
      </section>

      {(project.photos ?? []).length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {(project.photos ?? []).map((photo, i) => (
            <img key={i} src={photo} alt={`photo-${i}`} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Comments</h2>

        {!token || !currentUser ? (
          <p className="text-sm text-gray-600 mb-4">
            <Link to={routes.auth.login()} className="text-blue-600 hover:underline">
              Login
            </Link>{" "}
            to like or comment.
          </p>
        ) : (
          <form onSubmit={handleAddComment} className="flex flex-col gap-2 mb-4">
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment"
            />
            <button
              type="submit"
              className="self-start px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Post comment
            </button>
          </form>
        )}

        {reactionError && <p className="text-red-600 text-sm mb-4">{reactionError}</p>}

        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li key={comment._id} className="border border-gray-200 rounded p-3">
                <p className="text-gray-800 text-sm mb-1">{comment.text}</p>
                <time dateTime={comment.createdAt} className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
                {!publicView && comment.userId === currentUser?._id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveComment(comment._id)}
                    className="block mt-1 text-xs text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {!publicView && (
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Delete project
        </button>
      )}
    </div>
  );
}
