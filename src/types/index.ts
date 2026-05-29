export interface Post {
    id: string;
    title: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id?: string;
    id?: string;
    postId: number;
    text?: string;
    rating: number;
    author: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePostDto {
    title: string;
    text: string;
}

export interface CreateCommentDto {
    postId: number;
    text?: string;
    rating: number;
    author: string;
}
