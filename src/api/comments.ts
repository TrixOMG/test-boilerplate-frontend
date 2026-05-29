import { Comment, CreateCommentDto } from "../types";
import { api } from "./config";

export const commentsApi = {
  getAll: async (): Promise<Comment[]> => {
    try {
      const response = await api.get("/comments");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getByPostId: async (
    postId: number,
  ): Promise<Comment[]> => {
    try {
      const response = await api.get(
        `/comments/post/${postId}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getAverageRating: async (
    postId: number,
  ): Promise<{ averageRating: number }> => {
    try {
      const response = await api.get(
        `/comments/post/${postId}/average-rating`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { averageRating: 0 };
      }
      throw error;
    }
  },

  create: async (
    data: CreateCommentDto,
  ): Promise<Comment> => {
    const response = await api.post("/comments", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateCommentDto>,
  ): Promise<Comment> => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  deleteByPostId: async (
    postId: number,
  ): Promise<{ message: string; deletedCount: number }> => {
    const response = await api.delete(
      `/comments/post/${postId}`,
    );
    return response.data;
  },
};
