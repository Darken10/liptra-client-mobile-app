import CustumAvatar from '@/src/components/shared/CustumAvatar';
import { Post } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ArticleCardProps {
  article: Post;
  onPress?: () => void;
}

const ArticleCard = ({ article, onPress }: ArticleCardProps) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } 
  };

  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: article.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        
        <Text style={styles.summary} numberOfLines={2}>
          {article.summary}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.authorContainer}>
            <CustumAvatar source={article.author.avatar || ""} size="md" name={article.author.name} />
            <View>
              <Text style={styles.authorName}>{article.author.name}</Text>
              <Text style={styles.publishDate}>{formatDate(article.publishedAt)}</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color="#6B7280" />
              <Text style={styles.statText}>{article.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
              <Text style={styles.statText}>{article.comments.length || 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  authorAvatarPlaceholder: {
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  publishDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ArticleCard;
