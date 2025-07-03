import { Button, FormField, Input, Spacer, Text } from '@/src/components/natiui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSend = async () => {
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
      setTimeout(() => router.replace('/auth/login'), 1500);
    } catch (e) {
      setError('Erreur lors de la demande');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text variant="h4" align="center">Mot de passe oublié</Text>
      <Spacer size={24} />
      <FormField label="Email">
        <Input value={email} onChangeText={setEmail} placeholder="Votre email" keyboardType="email-address" autoCapitalize="none" />
      </FormField>
      {error ? <Text color="red" align="center">{error}</Text> : null}
      {sent ? <Text color="green" align="center">Email envoyé !</Text> : null}
      <Spacer size={16} />
      <Button onPress={handleSend} variant="filled">Envoyer</Button>
    </View>
  );
} 