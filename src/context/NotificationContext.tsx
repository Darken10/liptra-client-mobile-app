import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import NotificationToast from '../components/pages/notifications/NotificationToast';
import notificationsData from '../data/notifications.json';
import { Notification } from '../types';
import { useAuth } from './AuthContext';

// Type pour le contexte
type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  createTicketNotification: (
    ticketId: string,
    action: 'created' | 'updated' | 'cancelled' | 'reminder',
    ticketDetails: { departure: string; arrival: string; date: string }
  ) => Notification;
};

// Création du contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

// Props pour le provider
type NotificationProviderProps = {
  children: ReactNode;
};

// Provider du contexte
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [toastNotification, setToastNotification] = useState<Notification | null>(null);
  const { user } = useAuth();

  // Charger les notifications au démarrage
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Pour les besoins de test, nous chargeons toujours les notifications
        // même si l'utilisateur n'est pas authentifié
        // Typer correctement les données de notification
        const typedNotifications = notificationsData as Notification[];
        setNotifications(typedNotifications);
        
        // Count unread notifications
        const unread = typedNotifications.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id && !notification.read) {
        return {
          ...notification,
          read: true
        };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    
    // Update unread count
    const unread = updatedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  // Créer une nouvelle notification
  const createNotification = (params: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }): Notification => {
    const newNotification: Notification = {
      id: `notif${Date.now()}`, // Générer un ID unique basé sur le timestamp
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      createdAt: new Date().toISOString()
    };

    // Ajouter la notification à la liste
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    // Mettre à jour le compteur de notifications non lues
    setUnreadCount(prevCount => prevCount + 1);
    
    return newNotification;
  };

  // Supprimer une notification
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    
    // Mettre à jour le compteur de notifications non lues
    const unread = updatedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  // Supprimer toutes les notifications
  const deleteAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Créer une notification pour un ticket
  const createTicketNotification = (
    ticketId: string,
    action: 'created' | 'updated' | 'cancelled' | 'reminder',
    ticketDetails: { departure: string; arrival: string; date: string }
  ): Notification => {
    const date = new Date(ticketDetails.date);
    const formattedDate = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    let title = '';
    let message = '';
    let type: 'info' | 'success' | 'warning' | 'error' = 'info';
    
    switch (action) {
      case 'created':
        title = 'Ticket acheté avec succès';
        message = `Votre ticket pour ${ticketDetails.departure} - ${ticketDetails.arrival} le ${formattedDate} a été créé avec succès.`;
        type = 'success';
        break;
      case 'updated':
        title = 'Ticket mis à jour';
        message = `Votre ticket pour ${ticketDetails.departure} - ${ticketDetails.arrival} a été mis à jour.`;
        type = 'info';
        break;
      case 'cancelled':
        title = 'Ticket annulé';
        message = `Votre ticket pour ${ticketDetails.departure} - ${ticketDetails.arrival} le ${formattedDate} a été annulé.`;
        type = 'error';
        break;
      case 'reminder':
        title = 'Rappel de voyage';
        message = `Votre voyage ${ticketDetails.departure} - ${ticketDetails.arrival} est prévu demain à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.`;
        type = 'warning';
        break;
    }
    
    const notification = createNotification({ title, message, type });
    
    // Ajouter l'ID du ticket à la notification
    const notificationWithTicketId = {
      ...notification,
      ticketId
    };
    
    // Remplacer la notification dans la liste
    setNotifications(prev => [
      notificationWithTicketId,
      ...prev.filter(n => n.id !== notification.id)
    ]);
    
    // Afficher le toast
    setToastNotification(notificationWithTicketId);
    
    return notificationWithTicketId;
  };

  // Gérer la fermeture du toast
  const handleDismissToast = () => {
    setToastNotification(null);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
      createTicketNotification
    }}>
      {children}
      {toastNotification && (
        <NotificationToast
          title={toastNotification.title}
          message={toastNotification.message}
          type={toastNotification.type}
          onDismiss={handleDismissToast}
        />
      )}
    </NotificationContext.Provider>
  );
};
