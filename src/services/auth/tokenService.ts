import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api.call';

// Clés pour AsyncStorage
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes en millisecondes

interface DecodedToken {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  sub: string;
}

/**
 * Service de gestion du token JWT
 */
const TokenService = {
  /**
   * Stocke le token JWT et sa date d'expiration
   * @param token Token JWT à stocker
   */
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      
      // Extraire la date d'expiration du token JWT
      const expiryDate = this.getTokenExpiryDate(token);
      if (expiryDate) {
        await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toString());
      }
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
    }
  },

  /**
   * Récupère le token JWT stocké
   * @returns Token JWT ou null si non trouvé
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  },

  /**
   * Supprime le token JWT et sa date d'expiration
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, TOKEN_EXPIRY_KEY]);
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  },

  /**
   * Vérifie si le token est sur le point d'expirer
   * @returns true si le token expire dans moins de 5 minutes
   */
  async isTokenExpiringSoon(): Promise<boolean> {
    try {
      const expiryTimestamp = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiryTimestamp) return false;
      
      const expiryDate = parseInt(expiryTimestamp, 10);
      const now = Date.now();
      
      // Le token expire dans moins de 5 minutes
      return expiryDate - now < REFRESH_THRESHOLD;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'expiration du token:', error);
      return false;
    }
  },

  /**
   * Vérifie si le token est expiré
   * @returns true si le token est expiré
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const expiryTimestamp = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiryTimestamp) return true;
      
      const expiryDate = parseInt(expiryTimestamp, 10);
      const now = Date.now();
      
      return now >= expiryDate;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'expiration du token:', error);
      return true;
    }
  },

  /**
   * Extrait la date d'expiration d'un token JWT
   * @param token Token JWT
   * @returns Timestamp d'expiration en millisecondes ou null si invalide
   */
  getTokenExpiryDate(token: string): number | null {
    try {
      // Découper le token JWT (format: header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      // Décoder la partie payload (base64)
      const payload = parts[1];
      const tokenData = JSON.parse(payload) as DecodedToken;
      
      // Convertir la date d'expiration en millisecondes
      if (tokenData.exp) {
        return tokenData.exp * 1000; // Convertir de secondes à millisecondes
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du décodage du token JWT:', error);
      return null;
    }
  },

  /**
   * Tente de reconnecter l'utilisateur automatiquement
   * @param email Email de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @returns true si la reconnexion a réussi
   */
  async refreshSession(email: string, password: string): Promise<boolean> {
    try {
      // Appeler l'API de connexion pour obtenir un nouveau token
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      if (response && response.status === 200 && response.data?.token) {
        // Stocker le nouveau token
        await this.setToken(response.data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la session:', error);
      return false;
    }
  }
};

export default TokenService;
