import { useAuth } from '@/src/context/AuthContext';
import usePosts from '@/src/hooks/usePosts';
import useVoyage from '@/src/hooks/useVoyage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../natiui';
import ArticleCard from '../../shared/ArticleCard';
import PopularVoyageCard from '../../shared/voyages/PopularVoyageCard';


const HomePage = () => {

  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth()
  const { recentPosts: posts, isLoading,refreshArticles } = usePosts();
  const { popularVoyage, isLoading: isVoyageLoading,refreshVoyage } = useVoyage();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refreshVoyage(),
      refreshArticles()
    ]).then(() => {
      setRefreshing(false);
    });
  }, []);

  if (isLoading || isVoyageLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}>Chargement...</Text>
    </View>
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }>
      {/* Header with greeting and profile */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.username}>{user?.name ?? 'Utilisateur'}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          {/*  <View style={[styles.profileImage, styles.profilePlaceholder]}>
                        <Ionicons name="person" size={24} color="#6B7280" />
                    </View> */}

        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/voyage')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="search" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.actionText}>Rechercher</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/tickets')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="ticket" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.actionText}>Mes tickets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/tickets/transfert')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="swap-horizontal" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.actionText}>Transfert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/help' as any)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="help-circle" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.actionText}>Aide</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Voyages populaires</Text>
          <TouchableOpacity onPress={() => router.push('/voyage')}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {popularVoyage.map(voyage => (
          <PopularVoyageCard
            key={voyage.id}
            voyage={voyage}
            onPress={() => { router.push("/voyage/" + voyage.id) }}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Articles à la une</Text>
          <TouchableOpacity onPress={() => { router.push('/posts/all') }}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {posts.map(post => (
          <ArticleCard
            key={post.id}
            article={post}
            onPress={() => router.push(`/posts/details/${post.id}`)}
          />
        ))}
      </View>

    </ScrollView>




  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#4B5563',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
})