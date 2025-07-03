import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../../../src/context/AuthContext';

export default function EditProfileScreen() {
  const { user, editProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const router = useRouter();

  const handleSave = async () => {
    await editProfile({ name, email });
    router.back();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Éditer le profil</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Nom" style={{ borderWidth: 1, width: 200, margin: 8, padding: 4 }} />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={{ borderWidth: 1, width: 200, margin: 8, padding: 4 }} />
      <Button title="Sauvegarder" onPress={handleSave} />
    </View>
  );
} 