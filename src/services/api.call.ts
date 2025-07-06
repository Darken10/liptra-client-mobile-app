import TokenService from '@/src/services/auth/tokenService';
import axios from 'axios';
import { DeviceEventEmitter } from 'react-native';
import { API_BASE_URL } from '../constants/app';
// Création d'une instance axios avec la base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  async (config) => {
    const token = await TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types pour les réponses API
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  [key: string]: any; // Pour les autres propriétés comme 'trips', 'articles', etc.
}

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response) => {
    // Retourner la réponse originale avec les données transformées
    return response.data;
  },
  async (error) => {
    // Gestion des erreurs communes
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('API Error:', error.response.data);
      
      // Si le token est expiré ou invalide (401), déconnecter l'utilisateur
      if (error.response.status === 401) {

        console.log('Token expiré ou invalide. Redirection vers la page de connexion...');
        await TokenService.removeToken();
        DeviceEventEmitter.emit('SESSION_EXPIRED');
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      console.error('No response received:', error.request);
      return Promise.reject({ 
        status: 'error', 
        message: 'Aucune réponse du serveur. Vérifiez votre connexion internet.' 
      });
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Request error:', error.message);
      return Promise.reject({ 
        status: 'error', 
        message: 'Erreur lors de la requête: ' + error.message 
      });
    }
  }
);

// Services API
export const AuthService = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    sexe: string;
    numero: number;
    numero_identifiant: string;
  }) => {
    return api.post('/auth/register', userData);
  },
  
  logout: async () => {
    return api.post('/auth/logout');
  },
  
  forgotPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: async (email: string, token: string, password: string) => {
    return api.post('/auth/reset-password', { email, token, password });
  },
  
  getProfile: async () => {
    return api.get('/users/profile');
  },
  
  updateProfile: async (profileData: any) => {
    return api.put('/users/profile', profileData);
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    return api.put('/users/change-password', { 
      current_password: currentPassword, 
      password: newPassword 
    });
  }
};

export const TripsService = {
  getTrips: async (params?: {
    departureCity?: number;
    arrivalCity?: number;
    date?: string;
    company?: number;
    passengers?: number;
  }) => {
    return api.get('/trips', { params });
  },
  
  getTripById: async (tripId: number) => {
    return api.get(`/trips/${tripId}`);
  },
  
  getTripSeats: async (tripId: number) => {
    return api.get(`/trips/${tripId}/seats`);
  },
  
  searchTrips: async (searchParams: {
    departureCity: number;
    arrivalCity: number;
    date: string;
    passengers?: number;
  }) => {
    return api.post('/trips/search', searchParams);
  }
};

export const TicketsService = {
  getTickets: async (params?: { status?: string }) => {
    return api.get('/tickets', { params });
  },
  
  getTicketById: async (ticketId: number) => {
    return api.get(`/tickets/${ticketId}`);
  },
  
  createTicket: async (ticketData: {
    trip_id: number;
    seats: string[];
    passenger_name: string;
    passenger_email?: string;
    passenger_phone?: string;
    is_for_self: boolean;
    relation_to_passenger?: string;
    trip_type: 'one-way' | 'round-trip';
    payment_method: string;
  }) => {
    return api.post('/tickets', ticketData);
  },
  
  cancelTicket: async (ticketId: number) => {
    return api.put(`/tickets/${ticketId}/cancel`);
  },
  
  transferTicket: async (ticketId: number, recipientId: number) => {
    return api.put(`/tickets/${ticketId}/transfer`, { recipient_id: recipientId });
  },
  
  getTicketQrCode: async (ticketId: number) => {
    return api.get(`/tickets/${ticketId}/qr-code`);
  }
};

export const ArticlesService = {
  getArticles: async (params?: { category?: string; tag?: string }) => {
    return api.get('/articles', { params });
  },
  
  getArticleById: async (articleId: number) => {
    return api.get(`/articles/${articleId}`);
  },
  
  likeArticle: async (articleId: number) => {
    return api.post(`/articles/${articleId}/like`);
  },
  
  getCategories: async () => {
    return api.get('/articles/categories');
  },
  
  getTags: async () => {
    return api.get('/articles/tags');
  }
};

export const NotificationsService = {
  getNotifications: async (p0: { page: number; per_page: number; }) => {
    /* return api.get('/notifications'); */
    return JSON.parse(`
      {
  "status": "success",
  "data": [
    {
      "id": "101",
      "title": "Mise à jour disponible",
      "message": "Une nouvelle version de l'application est disponible. Veuillez mettre à jour.",
      "type": "info",
      "read": false,
      "created_at": "2025-07-03T10:15:30Z"
    },
    {
      "id": "102",
      "title": "Succès de la sauvegarde",
      "message": "Votre progression a été sauvegardée avec succès.",
      "type": "success",
      "read": true,
      "created_at": "2025-06-30T08:45:00Z"
    },
    {
      "id": "103",
      "title": "Espace de stockage faible",
      "message": "Il vous reste moins de 10% d’espace disponible.",
      "type": "warning",
      "read": false,
      "created_at": "2025-07-01T13:22:10Z"
    },
    {
      "id": "104",
      "title": "Erreur de connexion",
      "message": "Impossible de synchroniser vos données. Veuillez réessayer.",
      "type": "error",
      "read": true,
      "created_at": "2025-06-28T17:05:45Z"
    }
  ]
}
`)
  },
  
  markAsRead: async (notificationId: number) => {
    return api.put(`/notifications/${notificationId}/read`);
  },
  
  markAllAsRead: async () => {
    return api.put('/notifications/read-all');
  },
  
  deleteNotification: async (notificationId: number) => {
    return api.delete(`/notifications/${notificationId}`);
  },
  
  deleteAllNotifications: async () => {
    return api.delete('/notifications');
  }
};

export default api;
