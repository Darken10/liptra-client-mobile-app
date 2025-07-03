import { Ticket, TicketStatus } from '@/src/types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TicketCardProps {
  ticket: Ticket;
  onPress?: () => void;
  onTransfer?: () => void;
  onShowQR?: () => void;
}

const TicketCard = ({ ticket, onPress, onTransfer, onShowQR }: TicketCardProps) => {
  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case 'valid':
        return '#10B981'; // green
      case 'upcoming':
        return '#3B82F6'; // blue
      case 'paused':
        return '#F59E0B'; // yellow
      case 'blocked':
        return '#EF4444'; // red
      case 'used':
        return '#6B7280'; // gray
      case 'past':
        return '#9CA3AF'; // light gray
      case 'cancelled':
        return '#DC2626'; // dark red
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: TicketStatus): string => {
    switch (status) {
      case 'valid':
        return 'Valide';
      case 'upcoming':
        return 'À venir';
      case 'paused':
        return 'En pause';
      case 'blocked':
        return 'Bloqué';
      case 'used':
        return 'Utilisé';
      case 'past':
        return 'Passé';
      case 'cancelled':
        return 'Annulé';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy à HH:mm', { locale: fr });
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
      <View style={styles.header}>
        <View style={styles.companyContainer}>
          <Text style={styles.company}>{ticket.trip.company}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(ticket.status) }]}>
          <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.tripInfo}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#3B82F6" />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>{ticket.trip.departure.city}</Text>
              <Text style={styles.locationSubtitle}>{ticket.trip.departure.station}</Text>
              <Text style={styles.timeText}>{formatDate(ticket.trip.departure.time)}</Text>
            </View>
          </View>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Ionicons name="arrow-forward" size={16} color="#6B7280" />
            <View style={styles.divider} />
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#EF4444" />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>{ticket.trip.arrival.city}</Text>
              <Text style={styles.locationSubtitle}>{ticket.trip.arrival.station}</Text>
              <Text style={styles.timeText}>{formatDate(ticket.trip.arrival.time)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.passengerContainer}>
            <Ionicons name="person" size={16} color="#6B7280" />
            <Text style={styles.passengerText}>{ticket.passengerName}</Text>
          </View>
          <View style={styles.seatContainer}>
          <MaterialIcons name="airline-seat-recline-normal" size={20} color="#6B7280"  />
            <Text style={styles.seatText}>Siège {ticket.seatNumber}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onTransfer ? onTransfer : () => {}}
        >
          <Ionicons name="share-outline" size={18} color="#3B82F6" />
          <Text style={styles.actionText}>Transférer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onShowQR ? onShowQR : () => {}}
        >
          <Ionicons name="qr-code-outline" size={18} color="#3B82F6" />
          <Text style={styles.actionText}>Voir QR</Text>
        </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  tripInfo: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4B5563',
  },
  seatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4B5563',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
});

export default TicketCard;
