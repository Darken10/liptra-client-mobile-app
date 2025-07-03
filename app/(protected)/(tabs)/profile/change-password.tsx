import { Button, FormField, Spacer, Text } from '@/src/components/natiui';
import Input from '@/src/components/shared/Input';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../../../src/context/AuthContext';

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    setError('');
    try {
      await changePassword(oldPassword, newPassword);
      router.back();
    } catch (e) {
      setError('Erreur lors du changement de mot de passe');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text variant="h4" align="center">Changer le mot de passe</Text>
      <Spacer size={24} />
      <FormField label="Ancien mot de passe">
        <Input value={oldPassword} onChangeText={setOldPassword} placeholder="Ancien mot de passe" secureTextEntry />
      </FormField>
      <FormField label="Nouveau mot de passe">
        <Input value={newPassword} onChangeText={setNewPassword} placeholder="Nouveau mot de passe" secureTextEntry />
      </FormField>
      {error ? <Text color="red" align="center">{error}</Text> : null}
      <Spacer size={16} />
      <Button onPress={handleSave} variant="filled">Sauvegarder</Button>
    </View>
  );
} 