import useVoyage from '@/src/hooks/useVoyage';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@natiui/components/Button';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, DatePicker } from '../../natiui';
import PageHeader from '../../shared/header';
import SearchVoyageCard from './SearchVoyageCard';

interface SearchPageProps {
  goBack: () => void;
}

const searchPage = ({ goBack }: SearchPageProps) => {
  const { voyages, isLoading, popularDestination, searchVoyage, isSearchLoading } = useVoyage();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());
  const [company, setCompany] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    await searchVoyage({ departureCity: departure, arrivalCity: destination, date: date.toISOString(), company });
    setHasSearched(true);
  };

  const handleReset = () => {
    setDeparture('');
    setDestination('');
    setDate(new Date());
    setCompany('');
    setHasSearched(false);
  };

  if (isSearchLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <PageHeader title="Rechercher un voyage" onBack={goBack} />

      <ScrollView>
        <View style={styles.searchContainer}>
          <Text style={styles.searchTitle}>Rechercher un voyage</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ville de départ"
                value={departure}
                onChangeText={setDeparture}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="navigate-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ville de destination"
                value={destination}
                onChangeText={setDestination}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <DatePicker
                style={styles.input}
                value={date}
                onValueChange={setDate}
                iconName=""
                placeholder="Date (JJ/MM/AAAA)"
              />
            </View>

          </View>

          <View style={styles.buttonContainer}>
          
          <Button
            variant="filled"
            size="small"
            onPress={handleReset}
            style={styles.resetButton}
            leftIcon="refresh-outline"
            iconColor={colors.white}
            iconSize={20}
          >
            Reset
          </Button>
          <Button
            variant="filled"
            size="small"
            onPress={handleSearch}
            style={styles.searchButton}
            leftIcon="search-outline"
            iconColor={colors.white}
            iconSize={20}
          >
            Rechercher
          </Button>
          </View>
        </View>

        {!hasSearched ? (
          <View style={styles.content}>
            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Destinations populaires</Text>
              <View style={styles.destinationsGrid}>
                {popularDestination.map((destination, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.destinationCard}
                    onPress={() => {
                      setDestination(destination.city);
                    }}
                  >
                    <Text style={styles.destinationCity}>{destination.city}</Text>
                    <Text style={styles.destinationCountry}>{destination.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            {isSearchLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Recherche en cours...</Text>
              </View>
            ) : (
              <>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>
                    {voyages.length} {voyages.length > 1 ? 'résultats trouvés' : 'résultat trouvé'}
                  </Text>
                  <TouchableOpacity onPress={() => setHasSearched(false)}>
                    <Text style={styles.newSearchText}>Nouvelle recherche</Text>
                  </TouchableOpacity>
                </View>

                {voyages.length > 0 ? (
                  
                  <View style={styles.resultsList}>
                    {voyages.map((voyage) => (
                    <SearchVoyageCard
                      key={voyage.id}
                      voyage={voyage}
                      onPress={() => { }}
                    />
                  ))}
                  </View>

                ) : (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                    <Text style={styles.noResultsText}>Aucun voyage trouvé</Text>
                    <Text style={styles.noResultsSubtext}>
                      Essayez de modifier vos critères de recherche
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default searchPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  popularSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  destinationCity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  newSearchText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  resultsList: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 8,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})