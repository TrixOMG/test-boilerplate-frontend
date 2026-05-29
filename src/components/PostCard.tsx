import React, { useState } from "react";
import { postsApi } from "../api/posts";
import { Post } from "../types";
import { handleApiError } from "../utils/errorHandler";
import { CommentList } from "./CommentList";
import { CreateCommentForm } from "./CreateCommentForm";

interface PostCardProps {
  post: Post;
  onPostDeleted: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostDeleted,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [text, setText] = useState(post.text);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post?",
      )
    ) {
      try {
        await postsApi.delete(post.id);
        onPostDeleted(post.id);
        alert("✅ Post deleted successfully!");
      } catch (err) {
        const errorMessage = handleApiError(err);
        alert(`❌ Failed to delete post: ${errorMessage}`);
        console.error("Failed to delete post", err);
      }
    }
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    setError(null);
    try {
      await postsApi.update(post.id, { title, text });
      setIsEditing(false);
      post.title = title;
      post.text = text;
      alert("✅ Post updated successfully!");
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to update post", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className='post-card editing'>
        {error && (
          <div className='error-message'>❌ {error}</div>
        )}
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Text'
        />
        <div className='edit-actions'>
          <button
            onClick={handleUpdate}
            disabled={updateLoading}
          >
            {updateLoading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='post-card'>
      <h3>{post.title}</h3>
      <p>{post.text}</p>
      <small>
        Created: {new Date(post.createdAt).toLocaleString()}
      </small>
      <div className='post-actions'>
        <button onClick={() => setIsEditing(true)}>
          ✏️ Edit
        </button>
        <button onClick={handleDelete}>🗑️ Delete</button>
        <button
          onClick={() => setShowComments(!showComments)}
        >
          {showComments
            ? "Hide Comments"
            : "💬 Show Comments"}
        </button>
      </div>
      {showComments && (
        <div className='comments-section'>
          <CreateCommentForm
            postId={parseInt(post.id.split("-")[0]) || 1}
            onCommentCreated={() => {
              window.location.reload();
            }}
          />
          <CommentList
            postId={parseInt(post.id.split("-")[0]) || 1}
          />
        </div>
      )}
    </div>
  );
};
