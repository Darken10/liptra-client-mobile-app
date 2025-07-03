import NotificationToast from '@/src/components/shared/NotificationToast';
import { Notification } from '@/src/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NotificationsService } from '../services/api.call';
import { useAuth } from './AuthContext';

// Type pour le contexte
type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  deleteAllNotifications: () => Promise<boolean>;
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
        if (user) {
          const response = await NotificationsService.getNotifications();
          
          if (response && response.status === "success" && response.data?.notifications) {
            // Transformer les données de l'API au format attendu par l'application
            const apiNotifications = response.data.notifications.data || [];
            const formattedNotifications: Notification[] = apiNotifications.map((apiNotif: any) => ({
              id: apiNotif.id.toString(),
              title: apiNotif.title,
              message: apiNotif.message,
              type: apiNotif.type as 'info' | 'success' | 'warning' | 'error',
              read: apiNotif.read_at !== null,
              createdAt: apiNotif.created_at
            }));

            console.log('====================================');
            console.log(formattedNotifications);
            console.log('====================================');
            
            setNotifications(formattedNotifications);
            
            // Compter les notifications non lues
            const unread = formattedNotifications.filter(notification => !notification.read).length;
            setUnreadCount(unread);
          } else {
            setNotifications([]);
            setUnreadCount(0);
          }
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, [user]);

  // Marquer une notification comme lue
  const markAsRead = async (id: string): Promise<boolean> => {
    try {
      const response = await NotificationsService.markAsRead(Number(id));
      
      if (response && response.status === 200) {
        // Mettre à jour l'état local
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
        
        // Mettre à jour le compteur de notifications non lues
        const unread = updatedNotifications.filter(notification => !notification.read).length;
        setUnreadCount(unread);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      return false;
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async (): Promise<boolean> => {
    try {
      const response = await NotificationsService.markAllAsRead();
      
      if (response && response.status === 200) {
        // Mettre à jour l'état local
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          read: true
        }));
        
        setNotifications(updatedNotifications);
        setUnreadCount(0);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  // Créer une nouvelle notification locale (pas d'API pour créer des notifications côté client)
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
  const deleteNotification = async (id: string): Promise<boolean> => {
    try {
      const response = await NotificationsService.deleteNotification(Number(id));
      
      if (response &&  response.status === 200) {
        // Mettre à jour l'état local
        const updatedNotifications = notifications.filter(notification => notification.id !== id);
        setNotifications(updatedNotifications);
        
        // Mettre à jour le compteur de notifications non lues
        const unread = updatedNotifications.filter(notification => !notification.read).length;
        setUnreadCount(unread);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      return false;
    }
  };

  // Supprimer toutes les notifications
  const deleteAllNotifications = async (): Promise<boolean> => {
    try {
      const response = await NotificationsService.deleteAllNotifications();
      
      if (response &&  response.status === 200) {
        // Mettre à jour l'état local
        setNotifications([]);
        setUnreadCount(0);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return false;
    }
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
