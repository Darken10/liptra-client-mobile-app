import articlesData from '@/src/data/articles.json';
import { useEffect, useState } from 'react';
import { Post } from '../types';

const useArticles = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Extract unique categories and tags
      const allCategories = [...new Set(articlesData.map(article => article.category))];
      
      const allTags = [...new Set(
        articlesData.flatMap(article => article.tags)
      )];
      
      setPosts(articlesData);
      setFilteredPosts(articlesData);
      setCategories(allCategories);
      setTags(allTags);
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
    return posts.find(post => post.id === id);
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
