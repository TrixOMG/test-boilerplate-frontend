import React, { useState } from "react";
import { commentsApi } from "../api/comments";
import { handleApiError } from "../utils/errorHandler";

interface CreateCommentFormProps {
  postId: number;
  onCommentCreated: () => void;
}

export const CreateCommentForm: React.FC<
  CreateCommentFormProps
> = ({ postId, onCommentCreated }) => {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const commentData: any = {
        postId,
        author,
        rating,
      };

      // Для rating 2-4 текст обязателен
      if (rating >= 2 && rating <= 4) {
        if (!text || text.length < 10) {
          setError(
            "Text must be at least 10 characters for rating 2-4",
          );
          setLoading(false);
          return;
        }
        commentData.text = text;
      } else {
        // Для rating 1 и 5 текст не обязателен
        if (text) {
          commentData.text = text;
        }
      }

      await commentsApi.create(commentData);
      setAuthor("");
      setText("");
      setRating(5);
      onCommentCreated();
      alert("✅ Comment created successfully!");
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to create comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='create-comment-form'
    >
      <h4>Add Comment</h4>
      {error && (
        <div className='error-message'>❌ {error}</div>
      )}
      <input
        type='text'
        placeholder='Your name'
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>5 - Excellent</option>
        <option value={4}>4 - Good</option>
        <option value={3}>3 - Average</option>
        <option value={2}>2 - Poor</option>
        <option value={1}>1 - Terrible</option>
      </select>
      <textarea
        placeholder={
          rating >= 2 && rating <= 4
            ? "Comment (required for rating 2-4, min 10 characters)"
            : "Comment (optional for rating 1 and 5)"
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type='submit' disabled={loading}>
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};
