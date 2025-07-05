import { colors } from '@/src/components/natiui';
import Input from '@/src/components/shared/Input';
import useVoyage from '@/src/hooks/useVoyage';
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
  const { getVoyageById } = useVoyage();
  
  // Get trip details using the ID from URL params
  const voyage = getVoyageById(id as string);
  
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  
  // Simuler un temps de chargement pour démontrer le loader
  React.useEffect(() => {
    // Dans une vraie application, ce délai serait remplacé par le temps réel de chargement des données
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  // Mock available and unavailable seats
  const totalSeats = 49; // Total seats in the vehicle based on the bus layout image
  // Les sièges déjà occupés (en vert sur l'image)
  const unavailableSeats = ['3',  '31', '36', '39', '44', '47', '14', '17','29', '34', '37', '42'];
  
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

  const generateSeats = () => {
    // Création du plan de sièges selon l'image du car
    // Structure: [rangée gauche avant, rangée droite avant, rangée gauche arrière, rangée droite arrière]
    
    // Définition des rangées et des sièges selon l'image
    const leftFrontRow = [
      { id: '3', position: 'left' },
      { id: '8', position: 'left' },
      { id: '11', position: 'left' },
      { id: '16', position: 'left' },
      { id: '19', position: 'left' }
    ];
    
    const rightFrontRow = [
      { id: '28', position: 'right' },
      { id: '31', position: 'right' },
      { id: '36', position: 'right' },
      { id: '39', position: 'right' },
      { id: '44', position: 'right' },
      { id: '47', position: 'right' },
      { id: '49', position: 'right' }
    ];
    
    const leftBackRow = [
      { id: '2', position: 'left' },
      { id: '6', position: 'left' },
      { id: '9', position: 'left' },
      { id: '14', position: 'left' },
      { id: '17', position: 'left' },
      { id: '22', position: 'left' }
    ];
    
    const rightBackRow = [
      { id: '26', position: 'right' },
      { id: '29', position: 'right' },
      { id: '34', position: 'right' },
      { id: '37', position: 'right' },
      { id: '42', position: 'right' },
      { id: '45', position: 'right' }
    ];
    
    // Ajouter les informations d'état pour chaque siège
    const processRow = (row: any[]) => {
      return row.map(seat => ({
        ...seat,
        isUnavailable: unavailableSeats.includes(seat.id),
        isSelected: selectedSeats.includes(seat.id)
      }));
    };
    
    return {
      leftFrontRow: processRow(leftFrontRow),
      rightFrontRow: processRow(rightFrontRow),
      leftBackRow: processRow(leftBackRow),
      rightBackRow: processRow(rightBackRow)
    };
  };

  const handleSeatPress = (seatId: string) => {
    if (unavailableSeats.includes(seatId)) {
      return; // Seat is unavailable
    }
    
    setSelectedSeats(prevSelected => {
      if (prevSelected.includes(seatId)) {
        return prevSelected.filter(id => id !== seatId);
      } else {
        // Limit to 4 seats per booking
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
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      handleSubmit();
    }, 1000);
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
            
            {/* Seat map based on the bus layout image */}
            <View style={styles.busContainer}>
              {/* Front of the bus */}
              <View style={styles.busFront}>
                <View style={styles.driverArea}>
                  <Ionicons name="car-outline" size={24} color="#1F2937" />
                </View>
              </View>
              
              {/* Main seating area */}
              <View style={styles.busSeatingArea}>
                {/* Left side rows */}
                <View style={styles.busSide}>
                  {/* Left front row */}
                  <View style={styles.seatColumn}>
                    {generateSeats().leftFrontRow.map((seat: any) => (
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
                            seat.isSelected && styles.selectedSeat
                          ]}
                        >
                          {seat.id}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {/* Center aisle */}
                  <View style={styles.busAisle} />
                  
                  {/* Left back row */}
                  <View style={styles.seatColumn}>
                    {generateSeats().leftBackRow.map((seat: any) => (
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
                            seat.isSelected && styles.selectedSeatText
                          ]}
                        >
                          {seat.id}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                {/* Center aisle */}
                <View style={styles.mainAisle} />
                
                {/* Right side rows */}
                <View style={styles.busSide}>
                  {/* Right front row */}
                  <View style={styles.seatColumn}>
                    {generateSeats().rightFrontRow.map((seat: any) => (
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
                            seat.isSelected && styles.selectedSeatText
                          ]}
                        >
                          {seat.id}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {/* Center aisle */}
                  <View style={styles.busAisle} />
                  
                  {/* Right back row */}
                  <View style={styles.seatColumn}>
                    {generateSeats().rightBackRow.map((seat: any) => (
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
                            seat.isSelected && styles.selectedSeatText
                          ]}
                        >
                          {seat.id}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              {/* Back of the bus */}
              <View style={styles.busBack} />
            </View>
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
              {selectedSeats.length} {selectedSeats.length > 1 ? 'sièges' : 'siège'} x {voyage?.price?.toFixed(2) || '0.00'} €
            </Text>
            <Text style={styles.priceValue}>{((voyage?.price || 0) * selectedSeats.length).toFixed(2)} €</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Frais de service</Text>
            <Text style={styles.priceValue}>2.00 €</Text>
          </View>
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{(calculateTotalPrice() + 2).toFixed(2)} €</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <View style={styles.priceContainer}>
            <Text style={styles.totalPriceLabel}>Total</Text>
            <Text style={styles.totalPriceValue}>{(calculateTotalPrice() + 2).toFixed(2)} €</Text>
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
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  tripSummary: {
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  },
  routeLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  routeLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    flex: 1,
  },
  tripDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  tripDate: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  tripTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  seatSelectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  availableSeat: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectedSeat: {
    backgroundColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  unavailableSeat: {
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vehicleContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busContainer: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  busFront: {
    width: '80%',
    height: 40,
    backgroundColor: '#D1D5DB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  busSeatingArea: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  busSide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seatColumn: {
    flexDirection: 'column',
  },
  busSeat: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    margin: 4,
    borderWidth: 1,
    borderColor: '#1E40AF',
  },
  busSeatText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  mainAisle: {
    width: 20,
    backgroundColor: '#E5E7EB',
  },
  busAisle: {
    width: 10,
  },
  busBack: {
    width: '80%',
    height: 20,
    backgroundColor: '#D1D5DB',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  selectedSeatText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  driverArea: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  }
});
