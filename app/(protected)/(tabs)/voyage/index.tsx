import SearchPage from '@/src/components/pages/voyage/searchPage';
import { router } from 'expo-router';

export default function TravelScreen() {

  return (
    <SearchPage goBack={() => router.back()}/>
  );
} 
