import { BottomSheet } from '@/src/components/natiui';
import LoadingScreen from '@/src/components/pages/LoadingScreen';
import CustumAvatar from '@/src/components/shared/CustumAvatar';
import CommentSection from '@/src/components/shared/posts/CommentSection';
import { API_BASE_URL } from '@/src/constants/app';
import usePosts from '@/src/hooks/usePosts';
import { Comment } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getPostById, 
    likePost, 
    fetchPostById, 
    addComment, 
    deleteComment,
    getComments, 
    isLoading, 
    likeLoading,
    commentAddingLoading
  } = usePosts();
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [deletingComment, setDeletingComment] = useState(false);
  
  const article = getPostById(id as string);
  
  const [isLiked, setIsLiked] = useState(article?.i_liked || false);
  
  // Charger les commentaires depuis l'API
  useEffect(() => {
    if (openCommentSection && id) {
      loadComments();
    }
  }, [openCommentSection, id]);
  
  const loadComments = async () => {
    if (!id) return;
    
    try {
      const comments = await getComments(id as string);
      setPostComments(comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  // Get article details using the ID from URL params

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!article) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#D1D5DB" />
        <Text style={styles.notFoundTitle}>Article non trouvé</Text>
        <Text style={styles.notFoundText}>
          L'article que vous recherchez n'existe pas ou a été supprimé.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const handleLike = () => {
    likePost(article.id).then(() => {
      setIsLiked(!isLiked);
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cet article sur e-Liptra: ${article.title}
        
        ${API_BASE_URL}/article/${article.id}`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  function handleComment(): void {
    setOpenCommentSection(!openCommentSection);
  }
  
  const handleAddComment = async (comment: string): Promise<void> => {
    if (!id) return;
    
    setCommentLoading(true);
    try {
      const newComment = await addComment(id as string, comment);
      // Mettre à jour directement les commentaires locaux sans recharger
      setPostComments(prevComments => [...prevComments, newComment]);
      // Ne pas recharger tous les commentaires pour éviter les problèmes de synchronisation
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string): Promise<void> => {
    if (!id) return;
    
    setDeletingComment(true);
    try {
      await deleteComment(id as string, commentId);
      // Mettre à jour directement les commentaires locaux sans recharger
      setPostComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingComment(false);
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: article.image || 'https://via.placeholder.com/800x400?text=Article+Image' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.articleHeader}>
          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.authorContainer}>
            <CustumAvatar source={article.author.avatar || ""} size="md" name={article.author.name} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{article.author.name}</Text>
              <Text style={styles.publishDate}>{formatDate(article.publishedAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.articleContent}>
          <Text style={styles.summary}>{article.summary}</Text>
          <Text style={styles.content}>{article.content}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {article.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={20} color="#6B7280" />
              <Text style={styles.statText}>2.5k vues</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
              <Text style={styles.statText}>{article.comments?.length || 0} commentaires</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, isLiked && styles.likedButton]}
              onPress={handleLike}
            >
              {likeLoading ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={isLiked ? "#EF4444" : "#6B7280"}
                />
              )}

              <Text
                style={[styles.actionText, isLiked && styles.likedText]}
              >
                {article.likes + (isLiked ? 1 : 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleComment}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
              <Text style={styles.actionText}>{article.comments?.length || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={20} color="#6B7280" />
              <Text style={styles.actionText}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>

        {openCommentSection && (
          <View style={styles.commentsContainer}>
            <CommentSection comments={article.comments} />
          </View>
        )}

        <View style={styles.relatedArticlesContainer}>
          <Text style={styles.relatedTitle}>Articles similaires</Text>
          <Text style={styles.relatedSubtitle}>
            Vous pourriez aussi être intéressé par ces articles
          </Text>

          {/* In a real app, we would fetch related articles based on tags or category */}
          <View style={styles.relatedArticle}>
            <Image
              source={{ uri: 'https://picsum.photos/200' }}
              style={styles.relatedImage}
            />
            <View style={styles.relatedInfo}>
              <Text style={styles.relatedCategory}>Conseils</Text>
              <Text style={styles.relatedArticleTitle}>
                Comment préparer votre voyage en train
              </Text>
              <Text style={styles.relatedDate}>12 mai 2025</Text>
            </View>
          </View>

          <View style={styles.relatedArticle}>
            <Image
              source={{ uri: 'https://picsum.photos/300' }}
              style={styles.relatedImage}
            />
            <View style={styles.relatedInfo}>
              <Text style={styles.relatedCategory}>Actualités</Text>
              <Text style={styles.relatedArticleTitle}>
                Nouvelles lignes de bus entre Paris et Lyon
              </Text>
              <Text style={styles.relatedDate}>5 juin 2025</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <BottomSheet
        visible={openCommentSection}
        onClose={() => { setOpenCommentSection(false) }}
        height={90}
        title="Commentaires"
        children={
            <View style={[styles.commentsContainer, { width: '100%', height: '100%' }]}>
              <CommentSection 
                comments={postComments} 
                inBottomSheet={true} 
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                isAddingComment={commentAddingLoading}
                currentUserId="1" // Remplacer par l'ID de l'utilisateur connecté
              />
            </View>
        } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  articleHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  publishDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  articleContent: {
    padding: 16,
  },
  summary: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4B5563',
  },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  likedButton: {
    backgroundColor: '#FEE2E2',
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  likedText: {
    color: '#EF4444',
  },
  relatedArticlesContainer: {
    padding: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  relatedSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  relatedArticle: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  relatedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  relatedInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  relatedCategory: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 4,
  },
  relatedArticleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  relatedDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  commentsContainer: {
    padding: 16,
  },
});
