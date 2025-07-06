// axios.ts (ou .js si tu n’utilises pas TypeScript)
import { API_BASE_URL, AUTH_TOKEN_KEY } from '@/src/constants/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// Crée une instance Axios avec ta configuration de base
const api = axios.create({
  baseURL: API_BASE_URL, // adapte l'URL à ton API
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false, // ou true si tu utilises les cookies de session
});

// Intercepteur pour ajouter automatiquement un token si besoin
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY); // ou autre méthode de stockage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;

      // Gérer les erreurs de validation (422)
      if (status === 422 && data.errors) {
        console.error('Validation error:', data.errors);
        // Optionnel : afficher un toast / envoyer à un store
      }

      // Gérer les erreurs non autorisées
      if (status === 401) {
        console.error('Non autorisé - Token invalide ou expiré');
        // Rediriger, supprimer token, etc.
      }

      // Autres erreurs
      if (status >= 500) {
        console.error('Erreur serveur:', data);
      }
    }

    // Propager l’erreur si besoin
    return Promise.reject(error);
  }
);

export default api;
