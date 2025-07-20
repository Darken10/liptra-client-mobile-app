import { Button } from '@/src/components/natiui';
import Input from '@/src/components/shared/Input';
import { useAuth } from '@/src/context/AuthContext';
import useTickets from '@/src/hooks/useTickets';
import useVoyage from '@/src/hooks/useVoyage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { getVoyageById } = useVoyage();
  const { createTicket } = useTickets();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  
  // Simuler un temps de chargement pour démontrer le loader
  React.useEffect(() => {
    // Dans une vraie application, ce délai serait remplacé par le temps réel de chargement des données
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Extract params
  const tripId = params.tripId as string;
  const seats = (params.seats as string || '').split(',');
  const tripType = params.tripType as 'one-way' | 'round-trip';
  const isForSelf = params.isForSelf === 'true';
  const passengerName = params.passengerName as string;
  const passengerEmail = params.passengerEmail as string;
  const passengerPhone = params.passengerPhone as string;
  const relationToPassenger = params.relationToPassenger as string;
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get trip details
  const voyage = getVoyageById(tripId);
  
  // Afficher un loader pendant le chargement des données
  if (isPageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Chargement du paiement...</Text>
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
          onPress={() => router.push('/voyage')}
          style={{ marginTop: 24 }}
        >
          Retour à la recherche
        </Button>
      </View>
    );
  }
  
  // Calculate total price
  const pricePerSeat = voyage.price;
  const totalPrice = pricePerSeat * seats.length;
  
  const formatCardNumber = (text: string) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (text: string) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };
  
  const handlePayment = () => {
    // Validate payment information
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de carte valide.');
      return;
    }
    
    if (!cardName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le nom sur la carte.');
      return;
    }
    
    if (!expiryDate.trim() || expiryDate.length < 5) {
      Alert.alert('Erreur', 'Veuillez entrer une date d\'expiration valide.');
      return;
    }
    
    if (!cvv.trim() || cvv.length < 3) {
      Alert.alert('Erreur', 'Veuillez entrer un code CVV valide.');
      return;
    }
    
    // Create a new ticket
    const newTicket = createTicket({
      tripId: voyage.id,
      userId: user?.id || 'guest',
      seats: seats,
      tripType,
      passengerName: isForSelf ? user?.name || '' : passengerName,
      passengerEmail: isForSelf ? user?.email || '' : passengerEmail,
      passengerPhone: isForSelf ? user?.numero?.toString() || '' : passengerPhone,
      isForSelf,
      relationToPassenger: isForSelf ? '' : relationToPassenger,
      status: 'valid'
    });
    
    
    if (newTicket) {
      // Navigate to confirmation page
      router.push({
        pathname: '/voyage/confirmation',
        params: { ticketId: newTicket.id }
      });
    } else {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création du ticket.');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip summary */}
        <View style={styles.tripSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Trajet</Text>
            <Text style={styles.summaryValue}>
              {voyage.departure.city} → {voyage.arrival.city}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>
              {new Date(voyage.departure.time).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Heure</Text>
            <Text style={styles.summaryValue}>
              {new Date(voyage.departure.time).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sièges</Text>
            <Text style={styles.summaryValue}>{seats.join(', ')}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Type de voyage</Text>
            <Text style={styles.summaryValue}>{tripType === 'one-way' ? 'Aller simple' : 'Aller-retour'}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ticket pour</Text>
            <Text style={styles.summaryValue}>{isForSelf ? 'Moi-même' : 'Quelqu\'un d\'autre'}</Text>
          </View>
          
          {!isForSelf && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Passager</Text>
                <Text style={styles.summaryValue}>{passengerName}</Text>
              </View>
              
              {relationToPassenger && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Lien avec le passager</Text>
                  <Text style={styles.summaryValue}>{relationToPassenger}</Text>
                </View>
              )}
            </>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{totalPrice} €</Text>
          </View>
        </View>
        
        {/* Payment form */}
        <View style={styles.paymentForm}>
          <Text style={styles.sectionTitle}>Informations de paiement</Text>
          
          <Input
            label="Numéro de carte"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
            leftIcon={<Ionicons name="card-outline" size={20} color="#6B7280" />}
          />
          
          <Input
            label="Nom sur la carte"
            placeholder="JEAN DUPONT"
            value={cardName}
            onChangeText={setCardName}
            autoCapitalize="characters"
          />
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Date d'expiration"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            
            <View style={styles.halfInput}>
              <Input
                label="CVV"
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          size="large"
          onPress={handlePayment}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Traitement en cours..." : "Payer " + totalPrice + " FCFA"}
        </Button>
      </View>
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
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tripSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  paymentForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
