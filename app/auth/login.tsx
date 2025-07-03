
import { Button, FormField, Input, Spacer, Text } from '@/src/components/natiui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
    } catch (e) {
      setError('Identifiants invalides');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      {/* <View style={style.logoContenaire}>
        <Image source={ImagesUri.appIcon}  />
      </View> */}
      <Text variant="h4" align="center">Connexion</Text>
      <Spacer size={24} />
      <FormField label="Email">
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Votre email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </FormField>
      <FormField label="Mot de passe">
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Votre mot de passe"
          secureTextEntry
        />
      </FormField>
      {error ? <Text color="red" align="center">{error}</Text> : null}
      <Spacer size={16} />
      <Button onPress={handleLogin} variant="filled">Se connecter</Button>
      <Spacer size={8} />
      <Button onPress={() => router.push('/auth/register')} variant="text">S'inscrire</Button>
      <Button onPress={() => router.push('/auth/forgot-password')} variant="text">Mot de passe oublié ?</Button>
    </View>
  );
} 

const style = StyleSheet.create({
  logoContenaire : {
    flex : 1,
    flexDirection : "row",
    marginTop : 200,
    alignContent : 'center',
  }
})