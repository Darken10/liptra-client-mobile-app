import PostService from '@/src/services/posts/PostService';
import { Comment, Post } from '@/src/types';
import { useEffect, useState } from 'react';

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [commentAddingLoading, setCommentAddingLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const postsData = await PostService.getAllPosts();
      // Extract unique categories and tags
      const allCategories = [...new Set(postsData.data.map(post => post.category))];
      
      const allTags = [...new Set(
        postsData.data.flatMap(post => post.tags)
      )];
      
      setPosts(postsData.data);
      setFilteredPosts(postsData.data);
      setCategories(allCategories);
      setTags(allTags);
      setRecentPosts(postsData.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterByCategory = (category: string) => {
    if (category === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === category));
    }
  };

  const getPostsByCategory = (category: string) => {
    if (category === 'all') {
      return posts;
    } else {
      return posts.filter(post => post.category === category);
    }
  };

  const filterByTag = (tag: string) => {
    const filtered = posts.filter(post => post.tags.includes(tag));
    setFilteredPosts(filtered);
  };

  const getPostById = (id: string): Post | undefined => {
    return posts.find(post => {
      return post.id == id;
    });
  };

  const likePost = async (id: string) => {
    try {
      setLikeLoading(true);
  
      // Appel pour liker / unliker le post
      await PostService.toggleLikePost(id);
  
      // Récupérer le post mis à jour une seule fois
      const updatedPost = await fetchPostById(id);
      if (!updatedPost) return;
  
      // Fonction utilitaire pour mettre à jour une liste de posts
      const updatePostList = (postList: Post[]): Post[] =>
        postList.map(post => post.id === id ? updatedPost : post);
  
      // Mettre à jour tous les états avec le post mis à jour
      setPosts(prev => updatePostList(prev));
      setFilteredPosts(prev => updatePostList(prev));
  
      if (recentPosts.some(post => post.id === id)) {
        setRecentPosts(prev => updatePostList(prev));
      }
  
      // Retourner le post mis à jour
      return updatedPost;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    } finally {
      setLikeLoading(false);
    }
  };

  
  // Fetch a specific post by ID from the API
  const fetchPostById = async (id: string): Promise<Post> => {
    try {
      const post = await PostService.getPostById(id);
      return post;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw error;
    }
  };

  // Get comments for a specific post
  const getComments = async (postId: string): Promise<Comment[]> => {
    try {
      const comments = await PostService.getAllComments(postId);
      return comments;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, commentText: string): Promise<Comment> => {
    try {
      setCommentAddingLoading(true);
      const newComment = await PostService.addComment(postId, commentText);
      
      // Update the post in our local state with the new comment
      const updatePostWithComment = (postList: Post[]) => {
        return postList.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        });
      };
      
      setPosts(updatePostWithComment(posts));
      setFilteredPosts(updatePostWithComment(filteredPosts));
      
      return newComment;
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      throw error;
    } finally {
      setCommentAddingLoading(false);
    }
  };

  // Delete a comment from a post
  const deleteComment = async (postId: string, commentId: string): Promise<void> => {
    try {
      await PostService.deleteComment(commentId);
      
      // Update the post in our local state by removing the deleted comment
      const updatePostWithoutComment = (postList: Post[]) => {
        return postList.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        });
      };
      
      setPosts(updatePostWithoutComment(posts));
      setFilteredPosts(updatePostWithoutComment(filteredPosts));
    } catch (error) {
      console.error(`Error deleting comment ${commentId} from post ${postId}:`, error);
      throw error;
    }
  };

  const refreshArticles = () => {
    refetchPosts();
  };

  const refetchPosts = async () => {
    try {
      setIsLoading(true);
      const postsData = await PostService.getAllPosts();
      // Extract unique categories and tags
      const allCategories = [...new Set(postsData.data.map(post => post.category))];
      
      const allTags = [...new Set(
        postsData.data.flatMap(post => post.tags)
      )];
      
      setPosts(postsData.data);
      setFilteredPosts(postsData.data);
      setCategories(allCategories);
      setTags(allTags);
      setRecentPosts(postsData.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    posts: filteredPosts,
    allPosts: posts,
    recentPosts,
    categories,
    tags,
    isLoading,
    filterByCategory,
    filterByTag,
    getPostById,
    fetchPostById,
    likePost,
    getPostsByCategory,
    fetchPosts,
    getComments,
    addComment,
    deleteComment,
    commentAddingLoading,
    likeLoading,
    refreshArticles
  };
};

export default usePosts;
