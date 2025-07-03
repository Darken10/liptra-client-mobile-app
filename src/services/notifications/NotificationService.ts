import { useNotificationContext } from '@/src/context/NotificationContext';
import { Ticket } from '@/src/types';

/**
 * Service pour gérer les notifications automatiques
 */
export class NotificationService {
  /**
   * Vérifie les tickets à venir et génère des notifications de rappel
   * @param tickets Liste des tickets à vérifier
   * @param createTicketNotification Fonction pour créer une notification de ticket
   */
  static checkUpcomingTrips(
    tickets: Ticket[], 
    createTicketNotification: (
      ticketId: string, 
      action: 'created' | 'updated' | 'cancelled' | 'reminder', 
      ticketDetails: { departure: string; arrival: string; date: string }
    ) => void
  ) {
    const now = new Date();
    
    // Parcourir tous les tickets
    tickets.forEach(ticket => {
      // Ne vérifier que les tickets valides ou à venir
      if (ticket.status !== 'valid' && ticket.status !== 'upcoming') {
        return;
      }
      
      const travelDate = new Date(ticket.trip.departure.time);
      
      // Calculer la différence en jours
      const diffTime = travelDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Générer des notifications selon la proximité du voyage
      if (diffDays === 1) {
        // Voyage demain
        createTicketNotification(
          ticket.id,
          'reminder',
          {
            departure: ticket.trip.departure.city,
            arrival: ticket.trip.arrival.city,
            date: ticket.trip.departure.time
          }
        );
      } else if (diffDays === 7) {
        // Voyage dans une semaine
        createTicketNotification(
          ticket.id,
          'reminder',
          {
            departure: ticket.trip.departure.city,
            arrival: ticket.trip.arrival.city,
            date: ticket.trip.departure.time
          }
        );
      }
    });
  }
  
  /**
   * Vérifie si un ticket est expiré et met à jour son statut
   * @param ticket Ticket à vérifier
   * @returns Booléen indiquant si le ticket est expiré
   */
  static isTicketExpired(ticket: Ticket): boolean {
    const now = new Date();
    const travelDate = new Date(ticket.trip.departure.time);
    
    // Si la date de voyage est passée, le ticket est expiré
    return now > travelDate;
  }
}

/**
 * Hook pour utiliser le service de notification
 */
export const useNotificationService = () => {
  const { createTicketNotification } = useNotificationContext();
  
  /**
   * Vérifie les tickets à venir et génère des notifications de rappel
   * @param tickets Liste des tickets à vérifier
   */
  const checkUpcomingTrips = (tickets: Ticket[]) => {
    NotificationService.checkUpcomingTrips(tickets, createTicketNotification);
  };
  
  return {
    checkUpcomingTrips,
    isTicketExpired: NotificationService.isTicketExpired
  };
};
