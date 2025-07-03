import { NotificationsService } from '@/src/services/api.call';
import { Notification, PaginatedResponse } from '@/src/types';
import { DeviceEventEmitter } from 'react-native';

// Événements pour les notifications
export const NOTIFICATION_EVENTS = {
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
  NOTIFICATION_READ: 'NOTIFICATION_READ',
  NOTIFICATION_DELETED: 'NOTIFICATION_DELETED',
  ALL_NOTIFICATIONS_READ: 'ALL_NOTIFICATIONS_READ',
  ALL_NOTIFICATIONS_DELETED: 'ALL_NOTIFICATIONS_DELETED',
};

class NotificationService {
  private notifications: Notification[] = [];
  private unreadCount: number = 0;
  private isLoading: boolean = false;
  private currentPage: number = 1;
  private lastPage: number = 1;
  private perPage: number = 10;

  /**
   * Récupère les notifications depuis l'API
   * @param refresh Si true, recharge depuis la première page
   * @returns Les notifications récupérées
   */
  async fetchNotifications(refresh: boolean = false): Promise<Notification[]> {
    try {
      if (this.isLoading) return this.notifications;
      this.isLoading = true;

      // Si refresh, on recommence depuis la première page
      const page = refresh ? 1 : this.currentPage;

      const response = await NotificationsService.getNotifications({
        page,
        per_page: this.perPage,
      }) as PaginatedResponse<Notification>;

      // Mettre à jour les informations de pagination
      this.currentPage = response.current_page;
      this.lastPage = response.last_page;

      // Mettre à jour les notifications
      if (refresh) {
        this.notifications = response.data;
      } else {
        this.notifications = [...this.notifications, ...response.data];
      }

      // Calculer le nombre de notifications non lues
      this.updateUnreadCount();

      return this.notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Charge la page suivante de notifications
   * @returns Les notifications mises à jour
   */
  async loadMoreNotifications(): Promise<Notification[]> {
    if (this.currentPage < this.lastPage && !this.isLoading) {
      this.currentPage++;
      return this.fetchNotifications(false);
    }
    return this.notifications;
  }

  /**
   * Marque une notification comme lue
   * @param notificationId ID de la notification
   * @returns La notification mise à jour
   */
  async markAsRead(notificationId: number): Promise<Notification | null> {
    try {
      const response = await NotificationsService.markAsRead(notificationId);
      
      // Mettre à jour la notification localement
      const index = this.notifications.findIndex(n => n.id == notificationId);
      if (index !== -1) {
        this.notifications[index] = { ...this.notifications[index], read: true };
        this.updateUnreadCount();
        
        // Émettre un événement pour informer les composants
        DeviceEventEmitter.emit(NOTIFICATION_EVENTS.NOTIFICATION_READ, notificationId);
      }
      
      return response;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  /**
   * Marque toutes les notifications comme lues
   * @returns Le nombre de notifications marquées comme lues
   */
  async markAllAsRead(): Promise<number> {
    try {
      const response = await NotificationsService.markAllAsRead();
      
      // Mettre à jour toutes les notifications localement
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      this.unreadCount = 0;
      
      // Émettre un événement pour informer les composants
      DeviceEventEmitter.emit(NOTIFICATION_EVENTS.ALL_NOTIFICATIONS_READ);
      
      return response.count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Supprime une notification
   * @param notificationId ID de la notification
   * @returns true si la suppression a réussi
   */
  async deleteNotification(notificationId: number): Promise<boolean> {
    try {
      const response = await NotificationsService.deleteNotification(notificationId);
      
      // Supprimer la notification localement
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
      this.updateUnreadCount();
      
      // Émettre un événement pour informer les composants
      DeviceEventEmitter.emit(NOTIFICATION_EVENTS.NOTIFICATION_DELETED, notificationId);
      
      return response.deleted;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  }

  /**
   * Supprime toutes les notifications
   * @returns Le nombre de notifications supprimées
   */
  async deleteAllNotifications(): Promise<number> {
    try {
      const response = await NotificationsService.deleteAllNotifications();
      
      // Supprimer toutes les notifications localement
      const count = this.notifications.length;
      this.notifications = [];
      this.unreadCount = 0;
      
      // Émettre un événement pour informer les composants
      DeviceEventEmitter.emit(NOTIFICATION_EVENTS.ALL_NOTIFICATIONS_DELETED);
      
      return response.count;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }

  /**
   * Ajoute une nouvelle notification (utilisé pour les notifications push)
   * @param notification La notification à ajouter
   */
  addNotification(notification: Notification): void {
    // Ajouter la notification au début de la liste
    this.notifications = [notification, ...this.notifications];
    
    // Mettre à jour le compteur de notifications non lues
    if (!notification.read) {
      this.unreadCount++;
    }
    
    // Émettre un événement pour informer les composants
    DeviceEventEmitter.emit(NOTIFICATION_EVENTS.NEW_NOTIFICATION, notification);
  }

  /**
   * Récupère le nombre de notifications non lues
   * @returns Le nombre de notifications non lues
   */
  getUnreadCount(): number {
    return this.unreadCount;
  }

  /**
   * Récupère toutes les notifications en cache
   * @returns Les notifications en cache
   */
  getNotifications(): Notification[] {
    return this.notifications;
  }

  /**
   * Met à jour le compteur de notifications non lues
   */
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }
}

export default NotificationService;
