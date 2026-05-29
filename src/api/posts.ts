import { CreatePostDto, Post } from '../types';
import { api } from './config';

export const postsApi = {
    getAll: async (): Promise<Post[]> => {
        try {
            const response = await api.get('/posts');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return [];
            }
            throw error;
        }
    },

    getById: async (id: string): Promise<Post> => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    create: async (data: CreatePostDto): Promise<Post> => {
        try {
            const response = await api.post('/posts', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, data: Partial<CreatePostDto>): Promise<Post> => {
        try {
            const response = await api.put(`/posts/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/posts/${id}`);
        } catch (error) {
            throw error;
        }
    },
};
