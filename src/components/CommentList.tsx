import React, { useEffect, useState } from "react";
import { commentsApi } from "../api/comments";
import { Comment } from "../types";
import { handleApiError } from "../utils/errorHandler";

interface CommentListProps {
  postId: number;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentsApi.getByPostId(postId);
      setComments(data);

      const rating =
        await commentsApi.getAverageRating(postId);
      setAverageRating(rating.averageRating);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to load comments", err);
      setComments([]);
      setAverageRating(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await commentsApi.delete(id);
        await loadComments();
        alert("✅ Comment deleted successfully!");
      } catch (err) {
        const errorMessage = handleApiError(err);
        alert(
          `❌ Failed to delete comment: ${errorMessage}`,
        );
        console.error("Failed to delete comment", err);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (
      window.confirm("Delete ALL comments for this post?")
    ) {
      try {
        const result =
          await commentsApi.deleteByPostId(postId);
        await loadComments();
        alert(`✅ ${result.message}`);
      } catch (err) {
        const errorMessage = handleApiError(err);
        alert(
          `❌ Failed to delete comments: ${errorMessage}`,
        );
        console.error("Failed to delete comments", err);
      }
    }
  };

  if (loading)
    return (
      <div className='loading-comments'>
        Loading comments...
      </div>
    );
  if (error)
    return <div className='error-message'>❌ {error}</div>;

  return (
    <div className='comment-list'>
      <div className='comment-header'>
        <h4>Comments ({comments.length})</h4>
        {averageRating !== null && averageRating > 0 && (
          <div className='rating-summary'>
            ⭐ Average: {averageRating.toFixed(1)} / 5
          </div>
        )}
        {comments.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className='delete-all-btn'
          >
            Delete All Comments
          </button>
        )}
      </div>
      {comments.length === 0 ? (
        <div className='no-comments'>
          <p>
            ✨ No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id || comment.id}
            className='comment-card'
          >
            <div className='comment-header'>
              <strong>{comment.author}</strong>
              <span className='rating'>
                ⭐ {comment.rating}/5
              </span>
            </div>
            {comment.text && comment.text.trim() && (
              <p className='comment-text'>{comment.text}</p>
            )}
            <div className='comment-actions'>
              <small>
                {new Date(
                  comment.createdAt!,
                ).toLocaleString()}
              </small>
              <button
                onClick={() =>
                  handleDelete(comment._id || comment.id!)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
