import { Button } from '@/src/components/natiui';
import PaymentChoixSwitch from '@/src/components/pages/payement/PaymentChoixSwitch';
import PageHeader from '@/src/components/shared/header';
import { getPaymentMethod, getPaymentMethodProcedureText } from '@/src/constants/payementMethodeList';
import { PaymentScreenParams } from '@/src/types/voyage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function PaymentScreen() {
  const params = useLocalSearchParams() as unknown as PaymentScreenParams;
  const totalPrice = params.totalPrice as string;
  const paymentMethod = getPaymentMethod(params.payementMode as string);
  const [isLoading, setIsLoading] = useState(false);

  if (!paymentMethod) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#D1D5DB" />
        <Text style={styles.notFoundTitle}>Mode de paiement non trouvé</Text>
        <Text style={styles.notFoundText}>
          Le mode de paiement que vous recherchez n'existe pas ou a été supprimé.
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with back button */}

      <PageHeader
        title={paymentMethod.name}
        onBack={() => router.back()}
        startActions={(
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
      />

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.header}>
          <View style={[styles.methodImageContainer,]}>
            <Image source={paymentMethod.image} style={styles.methodImage} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations de paiement</Text>
          <View style={styles.cardContent}>
            <View style={styles.methodeProcedureTextContainer}>
              <Text style={styles.methodeProcedureText}>{getPaymentMethodProcedureText(paymentMethod.path, totalPrice)}</Text>
            </View>
            <PaymentChoixSwitch provider={paymentMethod.path} params={params} />
          </View>
        </View>
      </ScrollView>



    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF44',
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
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  card: {
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
  methodImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  methodImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: "100%",
  },
  methodeProcedureTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: "100%",
  },
  methodeProcedureText: {
    color: '#1F2937',
    marginBottom: 16,
  },
});
