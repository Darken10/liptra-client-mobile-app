import api from "@/src/config/api/axios.api";
import { Comment, PaginatedResponse, Post } from "@/src/types";

const PostService = {
    getAllPosts: async () => {
        return api.get<PaginatedResponse<Post>>('/articles').then(response => response.data);
    },
    getPostById: async (id: string) => {
        return api.get<Post>(`/articles/${id}`).then(response => response.data);
    },
    toggleLikePost: async (id: string) => {
        return api.post(`/articles/${id}/like`).then(response => response.data);
    },
    getAllComments: async (id: string) => {
        return api.get<Comment[]>(`/articles/${id}/comment`).then(response => response.data);
    },
    addComment: async (id: string, comment: string) => {
        return api.post(`/articles/${id}/comment`, { content : comment }).then(response => response.data);
    },
    deleteComment: async (commentId: string) => {
        return api.delete(`/articles/comment/${commentId}/delete`).then(response => response.data);
    },

}

export default PostService