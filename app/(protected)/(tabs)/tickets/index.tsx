import TicketsListPage from '@/src/components/pages/tickets/ticketsListPage';
import PageHeader from '@/src/components/shared/header';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
export default function TicketsScreen() {

  
  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Mes tickets" 
      
      />
      <StatusBar style="dark" />
      <TicketsListPage />
    </View>
  );
} 