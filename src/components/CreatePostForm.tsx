import React, { useState } from "react";
import { postsApi } from "../api/posts";
import { handleApiError } from "../utils/errorHandler";

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export const CreatePostForm: React.FC<
  CreatePostFormProps
> = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await postsApi.create({ title, text });
      setTitle("");
      setText("");
      onPostCreated();
      alert("✅ Post created successfully!");
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='create-post-form'
    >
      <h3>Create New Post</h3>
      {error && (
        <div className='error-message'>❌ {error}</div>
      )}
      <input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder='Content'
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button type='submit' disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
};
