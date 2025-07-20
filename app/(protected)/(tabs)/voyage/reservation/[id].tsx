import { colors } from '@/src/components/natiui';
import Input from '@/src/components/shared/Input';
import { formatMontant } from '@/src/helpers';
import useVoyage from '@/src/hooks/useVoyage';
import { Seat, VoyageDetail } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@natiui/components';
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

export default function SeatSelectionScreen() {
  const { id } = useLocalSearchParams();
  const { getVoyageById, getSeats } = useVoyage();
  
  const [voyage, setVoyage] = useState<VoyageDetail | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [seats, setSeats] = useState<Seat[]>([]);
  
  
  // Récupérer les détails du voyage en utilisant l'ID depuis les paramètres d'URL
  React.useEffect(() => {
    const fetchVoyage = async () => {
      try {
        const result = await getVoyageById(id as string);
        setVoyage(result as VoyageDetail);
        const seatsResult = await getSeats(id as string);
        setSeats(seatsResult);
        setIsPageLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du voyage:', error);
        setIsPageLoading(false);
      }
    };
    
    fetchVoyage();
  }, [id]);
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isForSelf, setIsForSelf] = useState<boolean>(true);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [relationToPassenger, setRelationToPassenger] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Afficher un loader pendant le chargement des données
  if (isPageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Chargement des places disponibles...</Text>
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
  
  const generateSeats = () => {
    // Organiser les sièges en 5 colonnes
    const columns: Array<Array<{
      id: string;
      name: string;
      price: number;
      type: string;
      care?: string;
      is_available?: boolean;
      isUnavailable: boolean;
      isSelected: boolean;
    }>> = [[], [], [], [], []];
    
    // Traiter les sièges récupérés de l'API
    seats.forEach((seat, index) => {
      // Déterminer dans quelle colonne placer le siège (0 à 4)
      const columnIndex = index % 5;
      
      // Ajouter les informations d'état pour chaque siège
      const processedSeat = {
        ...seat,
        id: seat.id,
        isUnavailable: !seat.is_available,
        isSelected: selectedSeats.includes(seat.id)
      };
      
      // Ajouter le siège à la colonne appropriée
      columns[columnIndex].push(processedSeat);
    });
    
    return columns;
  };

  const handleSeatPress = (seatId: string) => {
    // Vérifier si le siège est disponible
    const seat = seats.find(s => s.id === seatId);
    if (!seat || !seat.is_available) {
      return; // Siège indisponible
    }
    
    setSelectedSeats(prevSelected => {
      if (prevSelected.includes(seatId)) {
        return prevSelected.filter(id => id !== seatId);
      } else {
        // Limite à 4 sièges par réservation
        if (prevSelected.length >= 4) {
          Alert.alert(
            'Maximum atteint',
            'Vous ne pouvez sélectionner que 4 sièges maximum par réservation.'
          );
          return prevSelected;
        }
        return [...prevSelected, seatId];
      }
    });
  };

  const calculateTotalPrice = () => {
    return (voyage?.price || 0) * selectedSeats.length;
  };

  const handleSubmit = () => {
    // Validation conditionnelle selon si le ticket est pour soi-même ou non
    if (!isForSelf) {
      if (!passengerName.trim()) {
        Alert.alert("Erreur", "Veuillez entrer le nom du passager");
        return;
      }
      if (!passengerEmail.trim()) {
        Alert.alert("Erreur", "Veuillez entrer l'email du passager");
        return;
      }
      if (!passengerPhone.trim()) {
        Alert.alert("Erreur", "Veuillez entrer le numéro de téléphone du passager");
        return;
      }
      if (!relationToPassenger.trim()) {
        Alert.alert("Erreur", "Veuillez indiquer votre lien avec le passager");
        return;
      }
    }
    
    if (!tripType) {
      Alert.alert("Erreur", "Veuillez sélectionner le type de voyage");
      return;
    }

    if (selectedSeats.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un siège");
      return;
    }

    const totalPrice = selectedSeats.length * (voyage?.price || 0);

    // Navigation vers la page de paiement avec les paramètres
    router.push({
      pathname: "/voyage/payement",
      params: {
        tripId: voyage?.id || "",
        seats: selectedSeats.join(","),
        totalPrice: totalPrice.toString(),
        isForSelf: isForSelf.toString(),
        relationToPassenger,
        passengerName,
        passengerEmail,
        passengerPhone,
        tripType
      },
    });
  };

  const handleContinue = () => {
    handleSubmit();
  };

  const renderSeatLegend = () => (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, styles.availableSeat]} />
        <Text style={styles.legendText}>Disponible</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, styles.selectedSeat]} />
        <Text style={styles.legendText}>Sélectionné</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, styles.unavailableSeat]} />
        <Text style={styles.legendText}>Occupé</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sélection des sièges</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Trip summary */}
        <View style={styles.tripSummary}>
          <View style={styles.routeContainer}>
            <Text style={styles.cityText}>{voyage?.departure?.city || ''}</Text>
            <View style={styles.routeLineContainer}>
              <View style={styles.routeLine} />
              <Ionicons name={voyage?.vehicleType === 'bus' ? 'bus' : 'train'} size={16} color="#3B82F6" />
              <View style={styles.routeLine} />
            </View>
            <Text style={styles.cityText}>{voyage?.arrival?.city || ''}</Text>
          </View>
          
          <View style={styles.tripDetails}>
            <Text style={styles.tripDate}>
              {voyage?.departure?.time ? new Date(voyage.departure.time).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              }) : ''}
            </Text>
            <Text style={styles.tripTime}>
              {voyage?.departure?.time ? new Date(voyage.departure.time).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : ''}
              {voyage?.departure?.time && voyage?.arrival?.time ? ' - ' : ''}
              {voyage?.arrival?.time ? new Date(voyage.arrival.time).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : ''}
            </Text>
          </View>
        </View>
        
        {/* Seat selection */}
        <View style={styles.seatSelectionContainer}>
          <Text style={styles.sectionTitle}>Sélectionnez vos sièges</Text>
          {renderSeatLegend()}
          
          <View style={styles.vehicleContainer}>
            {/* Driver seat - hidden since we now have it in the bus layout */}
            
            {/* Affichage des sièges en 5 colonnes */}
            <View style={styles.busContainer}>
              {/* En-tête avec l'icône du conducteur */}
              <View style={styles.busFront}>
                <View style={styles.driverArea}>
                  <Ionicons name="car-outline" size={24} color="#1F2937" />
                </View>
              </View>
              
              {/* Zone principale des sièges */}
              <View style={styles.seatingArea}>
                {/* Affichage des 5 colonnes de sièges */}
                {generateSeats().map((column, columnIndex) => (
                  <View key={`column-${columnIndex}`} style={styles.seatColumn}>
                    {column.map((seat) => (
                      <TouchableOpacity
                        key={seat.id}
                        style={[
                          styles.busSeat,
                          seat.isUnavailable && styles.unavailableSeat,
                          seat.isSelected && styles.selectedSeat
                        ]}
                        onPress={() => handleSeatPress(seat.id)}
                        disabled={seat.isUnavailable}
                      >
                        <Text 
                          style={[
                            styles.busSeatText,
                            seat.isSelected && styles.busSeatTextSelected
                          ]}
                        >
                          {seat.name || seat.id}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </View>  
              {/* Back of the bus */}
              <View style={styles.busBack} />
            </View>
          </View>

        
        {/* Type de voyage (aller simple ou aller-retour) */}
        <View style={styles.tripTypeContainer}>
          <Text style={styles.sectionTitle}>Type de voyage</Text>
          <View style={styles.ticketForOptions}>
            <TouchableOpacity 
              style={[styles.ticketForOption, tripType === 'one-way' && styles.ticketForOptionSelected]}
              onPress={() => setTripType('one-way')}
            >
              <Text style={[styles.ticketForOptionText, tripType === 'one-way' && styles.ticketForOptionTextSelected]}>Aller simple</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.ticketForOption, tripType === 'round-trip' && styles.ticketForOptionSelected]}
              onPress={() => setTripType('round-trip')}
            >
              <Text style={[styles.ticketForOptionText, tripType === 'round-trip' && styles.ticketForOptionTextSelected]}>Aller-retour</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Passenger information */}
        <View style={styles.passengerInfoContainer}>
          <Text style={styles.sectionTitle}>Informations du passager</Text>
          
          {/* Option pour indiquer si le ticket est pour soi-même ou quelqu'un d'autre */}
          <View style={styles.ticketForContainer}>
            <Text style={styles.ticketForLabel}>Ce ticket est pour :</Text>
            <View style={styles.ticketForOptions}>
              <TouchableOpacity 
                style={[styles.ticketForOption, isForSelf && styles.ticketForOptionSelected]}
                onPress={() => setIsForSelf(true)}
              >
                <Text style={[styles.ticketForOptionText, isForSelf && styles.ticketForOptionTextSelected]}>Moi-même</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.ticketForOption, !isForSelf && styles.ticketForOptionSelected]}
                onPress={() => setIsForSelf(false)}
              >
                <Text style={[styles.ticketForOptionText, !isForSelf && styles.ticketForOptionTextSelected]}>Quelqu'un d'autre</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* N'afficher les champs que si le ticket est pour quelqu'un d'autre */}
          {!isForSelf && (
            <>
              <Input
                label="Nom complet"
                placeholder="Entrez le nom complet du passager"
                value={passengerName}
                onChangeText={setPassengerName}
                leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
              />
              
              <Input
                label="Email"
                placeholder="Entrez l'email du passager"
                keyboardType="email-address"
                autoCapitalize="none"
                value={passengerEmail}
                onChangeText={setPassengerEmail}
                leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
              />
              
              <Input
                label="Téléphone"
                placeholder="Entrez le numéro de téléphone du passager"
                keyboardType="phone-pad"
                value={passengerPhone}
                onChangeText={setPassengerPhone}
                leftIcon={<Ionicons name="call-outline" size={20} color="#6B7280" />}
              />
              
              <Input
                label="Votre lien avec le passager"
                placeholder="Ex: Ami, Famille, Collègue..."
                value={relationToPassenger}
                onChangeText={setRelationToPassenger}
                leftIcon={<Ionicons name="people-outline" size={20} color="#6B7280" />}
              />
            </>
          )}
        </View>
        
        {/* Price summary */}
        <View style={styles.priceSummaryContainer}>
          <Text style={styles.sectionTitle}>Résumé de la commande</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {selectedSeats.length} {selectedSeats.length > 1 ? 'sièges' : 'siège'} x {formatMontant(voyage?.price || 0)} 
            </Text>
            <Text style={styles.priceValue}>{formatMontant((voyage?.price || 0) * selectedSeats.length)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Frais de service</Text>
            <Text style={[styles.priceValue,{color:"#50C878"}]}>Gratuit</Text>
          </View>
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatMontant(calculateTotalPrice())}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <View style={styles.priceContainer}>
            <Text style={styles.totalPriceLabel}>Total</Text>
            <Text style={styles.totalPriceValue}>{formatMontant(calculateTotalPrice())}</Text>
          </View>
          
          <Button
            onPress={handleContinue}
            loading={isLoading}
            disabled={selectedSeats.length === 0}
            style={{ flex: 1 } as any}
          >Continuer au paiement</Button>
        </View>
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
    backgroundColor: '#F9FAFB',
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  tripSummary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  routeLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  routeLine: {
    height: 1,
    backgroundColor: '#D1D5DB',
    flex: 1,
  },
  tripDetails: {
    marginTop: 8,
  },
  tripDate: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  seatSelectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#4B5563',
  },
  availableSeat: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectedSeat: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  unavailableSeat: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  vehicleContainer: {
    marginTop: 16,
  },
  busContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  busFront: {
    height: 40,
    backgroundColor: '#D1D5DB',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverArea: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatingArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  seatColumn: {
    width: '18%',
    marginHorizontal: '1%',
  },
  busSeat: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  busSeatText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  busSeatTextSelected: {
    color: '#FFFFFF',
  },
  busBack: {
    height: 16,
    backgroundColor: '#D1D5DB',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 16,
  },
  driverSeat: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  driverText: {
    fontSize: 12,
    color: '#4B5563',
  },
  seatText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  passengerInfoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
  },
  ticketForContainer: {
    marginBottom: 16,
  },
  ticketForLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  ticketForOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketForOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  ticketForOptionSelected: {
    backgroundColor: '#EBF5FF',
    borderColor: '#3B82F6',
  },
  ticketForOptionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  ticketForOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  tripTypeContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  priceSummaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 100,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    marginRight: 16,
  },
  totalPriceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  tripTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
});
