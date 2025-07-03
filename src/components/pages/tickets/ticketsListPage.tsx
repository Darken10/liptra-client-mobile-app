import TicketCard from '@/src/components/shared/tickets/TicketCard';
import useTickets from '@/src/hooks/useTickets';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function TicketsListPage() {
  const { tickets, getTicketsByStatus } = useTickets();
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Définir tous les hooks au début du composant
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, we would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  // Simuler un temps de chargement pour démontrer le loader
  React.useEffect(() => {
    // Dans une vraie application, ce délai serait remplacé par le temps réel de chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Logs de débogage
  console.log('Tickets disponibles:', tickets);
  console.log('Nombre de tickets:', tickets.length);
  
  // Si les données sont en cours de chargement, afficher un loader
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Chargement des tickets...</Text>
      </View>
    );
  }

  const getFilteredTickets = () => {
    switch(activeTab) {
      case 'upcoming':
        return getTicketsByStatus('upcoming');
      case 'past':
        return getTicketsByStatus('past');
      case 'cancelled':
        return getTicketsByStatus('cancelled');
      default:
        return tickets;
    }
  };

  const filteredTickets = getFilteredTickets();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="ticket-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Aucun ticket trouvé</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'all' 
          ? "Vous n'avez pas encore de tickets" 
          : `Vous n'avez pas de tickets ${
              activeTab === 'upcoming' ? 'à venir' : 
              activeTab === 'past' ? 'passés' : 'annulés'
            }`
        }
      </Text>
      {activeTab === 'all' && (
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => router.push('/voyage')}
        >
          <Text style={styles.searchButtonText}>Rechercher un voyage</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="ticket-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Aucun ticket</Text>
        <Text style={styles.emptyText}>
          Vous n'avez pas encore de tickets pour cette catégorie
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Tous
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            À venir
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Passés
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Annulés
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketCard
            ticket={item}
            onPress={() => router.push(`/tickets/${item.id}`)}
            onTransfer={() => router.push(`/tickets/transfer/${item.id}`)}
            onShowQR={() => router.push(`/tickets/qr/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.ticketsList}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3B82F6"]} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  ticketsList: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
