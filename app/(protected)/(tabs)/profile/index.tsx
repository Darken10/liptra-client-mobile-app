import { Button, Spacer, Text } from '@/src/components/natiui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '../../../../src/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text variant="h4">Profil</Text>
      <Spacer size={16} />
      <Text variant="body1">Nom : {user.name}</Text>
      <Text variant="body1">Email : {user.email}</Text>
      <Spacer size={24} />
      <Button onPress={() => router.push('/(tabs)/profile/edit')} variant="outlined">Éditer le profil</Button>
      <Spacer size={8} />
      <Button onPress={() => router.push('/(tabs)/profile/change-password')} variant="outlined">Changer le mot de passe</Button>
      <Spacer size={16} />
      <Button onPress={logout} variant="filled" >Se déconnecter</Button>
    </View>
  );
} 