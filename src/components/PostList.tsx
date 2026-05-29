import React, { useEffect, useState } from "react";
import { postsApi } from "../api/posts";
import { Post } from "../types";
import { CreatePostForm } from "./CreatePostForm";
import { PostCard } from "./PostCard";

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await postsApi.getAll();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = () => {
    loadPosts();
  };

  const handlePostDeleted = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  if (loading)
    return <div className='loading'>Loading posts...</div>;
  if (error) return <div className='error'>{error}</div>;

  return (
    <div className='post-list'>
      <h2>📝 Posts</h2>
      <CreatePostForm onPostCreated={handlePostCreated} />

      {posts.length === 0 ? (
        <div className='no-posts'>
          <p>
            📭 No posts yet. Create your first post above!
          </p>
        </div>
      ) : (
        <div className='posts'>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};
