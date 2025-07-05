import { colors } from '@/src/components/natiui';
import useVoyages from '@/src/hooks/useVoyage';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@natiui/components';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getVoyageById } = useVoyages();
  const [selectedSeatCount, setSelectedSeatCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simuler un temps de chargement pour démontrer le loader
  React.useEffect(() => {
    // Dans une vraie application, ce délai serait remplacé par le temps réel de chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get trip details using the ID from URL params
  const voyage = getVoyageById(id as string);
  
  // Afficher un loader pendant le chargement des données
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Chargement du voyage...</Text>
      </View>
    );
  }
  
  if (!voyage) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#D1D5DB" />
        <Text style={styles.notFoundTitle}>Voyage non trouvé</Text>
        <Text style={styles.notFoundText}>
          Le voyage que vous recherchez n'existe pas ou a été supprimé.
        </Text>
        <Button
          onPress={() => router.back()}
          style={{ marginTop: 24 }}
        >
          Retour à la recherche
        </Button>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const handleBooking = () => {
    if (selectedSeatCount > voyage.availableSeats) {
      Alert.alert(
        'Erreur',
        `Il n'y a que ${voyage.availableSeats} places disponibles pour ce voyage.`
      );
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      // Utiliser la syntaxe correcte d'Expo Router pour les routes dynamiques
      router.push({
        pathname: '/voyage/reservation/[id]',
        params: { id: voyage.id, seatCount: selectedSeatCount }
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du voyage</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Trip route info */}
        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <View style={styles.companyContainer}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/50x50?text=Logo' }} 
                style={styles.companyLogo} 
              />
              <Text style={styles.companyName}>{voyage.company}</Text>
            </View>
            <View style={styles.vehicleContainer}>
              <Ionicons 
                name={voyage.vehicleType === 'bus' ? 'bus' : 'train'} 
                size={20} 
                color="#6B7280" 
              />
              <Text style={styles.vehicleType}>
                {voyage.vehicleType === 'bus' ? 'Bus' : 'Train'}
              </Text>
            </View>
          </View>
          
          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(voyage.departure.time)}</Text>
                <Text style={styles.dateText}>{formatDate(voyage.departure.time)}</Text>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.locationName}>{voyage.departure.station}</Text>
                <Text style={styles.locationCity}>{voyage.departure.city}</Text>
              </View>
            </View>
            
            <View style={styles.routeDivider}>
              <View style={styles.routeLine} />
              <View style={styles.durationContainer}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.durationText}>{voyage.duration}</Text>
              </View>
              <View style={styles.routeLine} />
            </View>
            
            <View style={styles.routePoint}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(voyage.arrival.time)}</Text>
                <Text style={styles.dateText}>{formatDate(voyage.arrival.time)}</Text>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.locationName}>{voyage.arrival.station}</Text>
                <Text style={styles.locationCity}>{voyage.arrival.city}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Trip details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Informations</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={20} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Prix</Text>
                <Text style={styles.detailValue}>{voyage.price} €</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={20} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Places disponibles</Text>
                <Text style={styles.detailValue}>{voyage.availableSeats}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="briefcase-outline" size={20} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Bagages</Text>
                <Text style={styles.detailValue}>1 bagage inclus</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="wifi-outline" size={20} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Wi-Fi</Text>
                <Text style={styles.detailValue}>Disponible</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Booking section */}
        <View style={styles.bookingCard}>
          <Text style={styles.sectionTitle}>Réserver</Text>
          
          <View style={styles.passengerSelector}>
            <Text style={styles.passengerLabel}>Nombre de passagers</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={[
                  styles.counterButton, 
                  selectedSeatCount <= 1 && styles.disabledButton
                ]}
                onPress={() => selectedSeatCount > 1 && setSelectedSeatCount(selectedSeatCount - 1)}
                disabled={selectedSeatCount <= 1}
              >
                <Ionicons name="remove" size={20} color={selectedSeatCount <= 1 ? "#D1D5DB" : "#6B7280"} />
              </TouchableOpacity>
              
              <Text style={styles.counterValue}>{selectedSeatCount}</Text>
              
              <TouchableOpacity 
                style={[
                  styles.counterButton, 
                  selectedSeatCount >= voyage.availableSeats && styles.disabledButton
                ]}
                onPress={() => selectedSeatCount < voyage.availableSeats && setSelectedSeatCount(selectedSeatCount + 1)}
                disabled={selectedSeatCount >= voyage.availableSeats}
              >
                <Ionicons name="add" size={20} color={selectedSeatCount >= voyage.availableSeats ? "#D1D5DB" : "#6B7280"} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.priceSummary}>
            <Text style={styles.priceLabel}>Prix total</Text>
            <Text style={styles.priceValue}>{(voyage.price * selectedSeatCount).toFixed(2)} €</Text>
          </View>
          
          <Button
            onPress={handleBooking}
            loading={isLoading}
            style={styles.bookButton}
          >
            Réserver maintenant
          </Button>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  routeInfo: {
    paddingHorizontal: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeContainer: {
    width: 80,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  locationContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  locationCity: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
    marginBottom: 16,
  },
  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailContent: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 2,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passengerSelector: {
    marginBottom: 16,
  },
  passengerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#F9FAFB',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    width: 40,
    textAlign: 'center',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  bookButton: {
    marginTop: 8,
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
  },
});
