import { Button, FormField, Input, Spacer, Text } from '@/src/components/natiui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    try {
      await register({ name, email, password });
    } catch (e) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text variant="h4" align="center">Inscription</Text>
      <Spacer size={24} />
      <FormField label="Nom">
        <Input value={name} onChangeText={setName} placeholder="Votre nom" />
      </FormField>
      <FormField label="Email">
        <Input value={email} onChangeText={setEmail} placeholder="Votre email" keyboardType="email-address" autoCapitalize="none" />
      </FormField>
      <FormField label="Mot de passe">
        <Input value={password} onChangeText={setPassword} placeholder="Votre mot de passe" secureTextEntry />
      </FormField>
      {error ? <Text color="red" align="center">{error}</Text> : null}
      <Spacer size={16} />
      <Button onPress={handleRegister} variant="filled">S'inscrire</Button>
    </View>
  );
} 