import api from "@/src/config/api/axios.api";
import { PaginatedResponse, Post } from "@/src/types";

const PostService = {
    getAllPosts: async () => {
        return api.get<PaginatedResponse<Post>>('/articles').then(response => response.data);
    },
    getPostById: async (id: string) => {
        return api.get<Post>(`/articles/${id}`).then(response => response.data);
        
    },
}

export default PostService