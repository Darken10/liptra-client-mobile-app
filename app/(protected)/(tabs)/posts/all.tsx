import { colors } from '@/src/components/natiui';
import usePosts from '@/src/hooks/usePosts';
import { Post } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ArticlesScreen() {
  const { posts, fetchPosts, categories } = usePosts();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };
  
  const filteredArticles = selectedCategory === 'Tous' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const renderFeaturedArticle = () => {
    // Get the most recent article as featured
    const featuredArticle = posts[0];
    
    if (!featuredArticle) return null;
    
    return (
      <TouchableOpacity 
        style={styles.featuredContainer}
        onPress={() => router.push(`/posts/details/${featuredArticle.id}`)}
      >
        <Image 
          source={{ uri: featuredArticle.image || 'https://via.placeholder.com/600x300?text=Featured+Article' }} 
          style={styles.featuredImage}
        />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <View style={styles.featuredCategoryContainer}>
            <Text style={styles.featuredCategoryText}>{featuredArticle.category}</Text>
          </View>
          <Text style={styles.featuredTitle}>{featuredArticle.title}</Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredDate}>{formatDate(featuredArticle.publishedAt)}</Text>
            <View style={styles.featuredStats}>
              <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
              <Text style={styles.featuredStatsText}>2.5k</Text>
              <Ionicons name="heart-outline" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
              <Text style={styles.featuredStatsText}>{featuredArticle.likes}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderArticleItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.articleItem}
      onPress={() => router.push(`/posts/details/${item.id}`)}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/120x120?text=Article' }} 
        style={styles.articleImage}
      />
      <View style={styles.articleContent}>
        <View style={styles.articleCategoryContainer}>
          <Text style={styles.articleCategoryText}>{item.category}</Text>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.articleSummary} numberOfLines={2}>{item.summary}</Text>
        <View style={styles.articleMeta}>
          <Text style={styles.articleDate}>{formatDate(item.publishedAt)}</Text>
          <View style={styles.articleStats}>
            <Ionicons name="heart-outline" size={14} color="#6B7280" />
            <Text style={styles.articleStatsText}>{item.likes}</Text>
            <Ionicons name="chatbubble-outline" size={14} color="#6B7280" style={{ marginLeft: 8 }} />
            <Text style={styles.articleStatsText}>{item.comments.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Articles</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={renderArticleItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        ListHeaderComponent={
          <>
            {renderFeaturedArticle()}
            
            {/* Categories */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text 
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.selectedCategoryText
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {selectedCategory === 'Tous' ? 'Tous les articles' : selectedCategory}
              </Text>
              <Text style={styles.listCount}>{filteredArticles.length} articles</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Aucun article trouvé</Text>
            <Text style={styles.emptyText}>
              Aucun article n'est disponible dans cette catégorie pour le moment.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  featuredContainer: {
    height: 200,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  featuredCategoryContainer: {
    backgroundColor: 'rgba(1, 122, 251, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredCategoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredDate: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredStatsText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  listCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  articleItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  articleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  articleContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  articleCategoryContainer: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  articleCategoryText: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  articleSummary: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  articleStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleStatsText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 300,
  },
});
