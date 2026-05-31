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
import { getMe } from "../api/user.api";
import { routes } from "../routes";
import type { IComment, ILike, IProject, IUser } from "../types";

interface ProjectDetailPageProps {
  publicView?: boolean;
}

export default function ProjectDetailPage({ publicView = false }: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [project, setProject] = useState<IProject | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [likes, setLikes] = useState<ILike[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reactionError, setReactionError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      publicView ? getFeedProject(id) : getProject(id),
      getProjectLikes(id),
      getProjectComments(id),
      token ? getMe() : Promise.resolve(null),
    ])
      .then(([p, projectLikes, projectComments, user]) => {
        setProject(p);
        setLikes(projectLikes);
        setComments(projectComments);
        setCurrentUser(user);
        setLoading(false);
      })
      .catch((err) => { setError(err as string); setLoading(false); });
  }, [id, publicView, token]);

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
      setReactionError(err as string);
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
      setReactionError(err as string);
    }
  };

  const handleRemoveComment = async (commentId: string) => {
    if (!id) return;
    setReactionError("");

    try {
      await removeProjectComment(id, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      setReactionError(err as string);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      navigate(routes.profile.projects());
    } catch (err) {
      setError(err as string);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div>
      <nav>
        <Link to={publicView ? routes.home() : routes.profile.projects()}>
          {publicView ? "Home" : "Projects"}
        </Link>
      </nav>

      <h1>{project.name}</h1>

      {project.cover && <img src={project.cover} alt={project.name} />}

      {project.description && <p>{project.description}</p>}

      <section>
        <button type="button" onClick={handleLike}>
          {isLiked ? "Unlike" : "Like"}
        </button>
        <span>{likes.length} likes</span>
      </section>

      {(project.photos ?? []).length > 0 && (
        <div>
          {(project.photos ?? []).map((photo, i) => (
            <img key={i} src={photo} alt={`photo-${i}`} />
          ))}
        </div>
      )}

      <section>
        <h2>Comments</h2>

        {currentUser ? (
          <form onSubmit={handleAddComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment"
            />
            <button type="submit">Post comment</button>
          </form>
        ) : (
          <p>
            <Link to={routes.auth.login()}>Login</Link> to like or comment.
          </p>
        )}

        {reactionError && <p>{reactionError}</p>}

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment._id}>
                <p>{comment.text}</p>
                <time dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
                {!publicView && comment.userId === currentUser?._id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveComment(comment._id)}
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
        <button type="button" onClick={handleDelete}>Delete project</button>
      )}
    </div>
  );
}
