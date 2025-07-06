import { useEffect, useState } from 'react';
import PostService from '../services/posts/PostService';
import { Post } from '../types';

const useArticles = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const articlesData = await PostService.getAllPosts();
      // Extract unique categories and tags
      const allCategories = [...new Set(articlesData.data.map(article => article.category))];
      
      const allTags = [...new Set(
        articlesData.data.flatMap(article => article.tags)
      )];
      
      setPosts(articlesData.data);
      setFilteredPosts(articlesData.data);
      setCategories(allCategories);
      setTags(allTags)
      setRecentPosts(articlesData.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching articles:', error);
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
      setFilteredPosts(posts.filter(article => article.category === category));
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

  const likePost = (id: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    
    // Update filtered articles as well
    const updatedFiltered = filteredPosts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    });
    
    setFilteredPosts(updatedFiltered);
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
    likePost,
    getPostsByCategory,
    fetchPosts
  };
};

export default useArticles;
