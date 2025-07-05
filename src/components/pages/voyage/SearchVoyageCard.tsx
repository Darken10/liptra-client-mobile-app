import { Voyage } from '@/src/types/voyage';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@natiui/components/Button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TripCardProps {
  voyage: Voyage;
  onPress?: () => void;
}

const TripCard = ({ voyage, onPress }: TripCardProps) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const formatFullDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE dd MMMM', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const getVehicleIcon = (type: string): any => {
    switch (type.toLowerCase()) {
      case 'train':
        return 'train';
      case 'plane':
        return 'airplane';
      default:
        return 'bus';
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.companyContainer}>
          <Ionicons name={getVehicleIcon(voyage.vehicleType)} size={18} color="#3B82F6" />
          <Text style={styles.company}>{voyage.company}</Text>
        </View>
        <Text style={styles.dateText}>{formatFullDate(voyage.departure.time)}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeText}>{formatDate(voyage.departure.time)}</Text>
          <View style={styles.durationContainer}>
            <View style={styles.durationLine} />
            <Text style={styles.durationText}>{voyage.duration}</Text>
            <View style={styles.durationLine} />
          </View>
          <Text style={styles.timeText}>{formatDate(voyage.arrival.time)}</Text>
        </View>
        
        <View style={styles.infoColumn}>
          <View style={styles.stationContainer}>
            <Text style={styles.cityText}>{voyage.departure.city}</Text>
            <Text style={styles.stationText}>{voyage.departure.station}</Text>
          </View>
          
          <View style={styles.stationContainer}>
            <Text style={styles.cityText}>{voyage.arrival.city}</Text>
            <Text style={styles.stationText}>{voyage.arrival.station}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Prix</Text>
          <Text style={styles.priceText}>{voyage.price.toFixed(2)} €</Text>
        </View>
        
        <View style={styles.seatsContainer}>
          <Text style={styles.seatsText}>
            {voyage.availableSeats} {voyage.availableSeats > 1 ? 'places disponibles' : 'place disponible'}
          </Text>
        </View>
        
        <Button
          variant="filled"
          size="small"
          onPress={() => {}}
          style={styles.bookButton}
        >
          Réserver
        </Button>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  durationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  infoColumn: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  stationContainer: {
    marginBottom: 8,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  stationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seatsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 14,
    color: '#4B5563',
  },
  bookButton: {
    minWidth: 100,
  },
});

export default TripCard;
