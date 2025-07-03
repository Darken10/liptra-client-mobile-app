import ProfilePage from '@/src/components/pages/profile/profilePage';
import PageHeader from '@/src/components/shared/header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../../src/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

    const handleLogout = () => {
      Alert.alert(
        'Déconnexion',
        'Êtes-vous sûr de vouloir vous déconnecter ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Déconnecter', 
            style: 'destructive',
            onPress: () => {
              logout();
              router.replace('/auth/login');
            }
          }
        ]
      );
    };
  

  return (
    <View style={{ flex: 1 }}>
      <PageHeader 
        title="Profil" 
        onBack={() => router.back()} 
        startActions = {
          <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        }
        endActions = {
          <TouchableOpacity 
          style={styles.markAllButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
        }
        
      />
      <ProfilePage handleLogout={handleLogout}/>
    </View>
  );
} 

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
