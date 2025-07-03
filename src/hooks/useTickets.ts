import { useAuth } from '@/src/context/AuthContext';
import { useNotificationContext } from '@/src/context/NotificationContext';
import tripsData from '@/src/data/trips.json';
import { useNotificationService } from '@/src/services/notifications/NotificationService';
import { Ticket, TicketStatus } from '@/src/types';
import { useEffect, useState } from 'react';

// Hook pour gérer les tickets
const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { createTicketNotification } = useNotificationContext();
  const { checkUpcomingTrips, isTicketExpired } = useNotificationService();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Créer des tickets codés en dur pour les tests
        const hardcodedTickets: Ticket[] = [
          {
            id: "ticket1",
            tripId: "trip1",
            userId: "user1",
            passengerName: "Issa Sawadogo",
            seatNumber: "12",
            purchaseDate: "2025-06-10T15:30:00Z",
            travelDate: "2025-07-15T08:00:00Z",
            qrCode: "BF-TRANSPORT-TICKET-1234567890",
            status: "valid",
            trip: {
              departure: {
                city: "Ouagadougou",
                station: "Gare de Ouaga Inter",
                time: "2025-07-15T08:00:00Z"
              },
              arrival: {
                city: "Bobo-Dioulasso",
                station: "Gare de Bobo Centre",
                time: "2025-07-15T14:00:00Z"
              },
              company: "STAF",
              vehicleType: "bus",
              duration: "6h00"
            }
          },
          {
            id: "ticket2",
            tripId: "trip2",
            userId: "user1",
            passengerName: "Issa Sawadogo",
            seatNumber: "05",
            purchaseDate: "2025-06-12T09:45:00Z",
            travelDate: "2025-07-16T06:30:00Z",
            qrCode: "BF-TRANSPORT-TICKET-0987654321",
            status: "upcoming",
            trip: {
              departure: {
                city: "Koudougou",
                station: "Gare de Koudougou Nord",
                time: "2025-07-16T06:30:00Z"
              },
              arrival: {
                city: "Ouagadougou",
                station: "Gare de Ouaga Inter",
                time: "2025-07-16T09:00:00Z"
              },
              company: "TSR",
              vehicleType: "bus",
              duration: "2h30"
            }
          },
          {
            id: "ticket3",
            tripId: "trip3",
            userId: "user1",
            passengerName: "Issa Sawadogo",
            seatNumber: "14",
            purchaseDate: "2025-05-20T14:30:00Z",
            travelDate: "2025-06-05T10:00:00Z",
            qrCode: "BF-TRANSPORT-TICKET-5678901234",
            status: "used",
            trip: {
              departure: {
                city: "Ouagadougou",
                station: "Gare de Ouaga Inter",
                time: "2025-06-05T10:00:00Z"
              },
              arrival: {
                city: "Fada N’Gourma",
                station: "Gare Routière Centrale",
                time: "2025-06-05T14:00:00Z"
              },
              company: "RAK Transport",
              vehicleType: "bus",
              duration: "4h00"
            }
          },
          {
            id: "ticket4",
            tripId: "trip4",
            userId: "user1",
            passengerName: "Issa Sawadogo",
            seatNumber: "22",
            purchaseDate: "2025-06-01T11:15:00Z",
            travelDate: "2025-06-18T14:45:00Z",
            qrCode: "BF-TRANSPORT-TICKET-1357924680",
            status: "cancelled",
            trip: {
              departure: {
                city: "Banfora",
                station: "Gare Banfora Ville",
                time: "2025-06-18T14:45:00Z"
              },
              arrival: {
                city: "Bobo-Dioulasso",
                station: "Gare de Bobo Centre",
                time: "2025-06-18T17:00:00Z"
              },
              company: "STAF",
              vehicleType: "bus",
              duration: "2h15"
            }
          },
          {
            id: "ticket5",
            tripId: "trip5",
            userId: "user1",
            passengerName: "Issa Sawadogo",
            seatNumber: "08, 09",
            purchaseDate: "2025-06-15T16:20:00Z",
            travelDate: "2025-06-20T05:30:00Z",
            qrCode: "BF-TRANSPORT-TICKET-2468013579",
            status: "past",
            trip: {
              departure: {
                city: "Ouahigouya",
                station: "Gare Ouahigouya",
                time: "2025-06-20T05:30:00Z"
              },
              arrival: {
                city: "Ouagadougou",
                station: "Gare de Ouaga Inter",
                time: "2025-06-20T09:00:00Z"
              },
              company: "TSR",
              vehicleType: "bus",
              duration: "3h30"
            }
          }
        ];
        
        
        // Afficher les tickets dans la console pour débogage
        console.log('Tickets codés en dur:', hardcodedTickets.length);
        
        // Mettre à jour les statuts des tickets en fonction de la date actuelle
        const updatedTickets = hardcodedTickets.map(ticket => {
          if (isTicketExpired(ticket) && ticket.status === 'valid') {
            return { ...ticket, status: 'past' as TicketStatus };
          }
          return ticket;
        });
        
        setTickets(updatedTickets);
        
        // Vérifier les tickets à venir et générer des notifications de rappel
        checkUpcomingTrips(updatedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const getTicketsByStatus = (status: TicketStatus): Ticket[] => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getTicketById = (id: string): Ticket | undefined => {
    return tickets.find(ticket => ticket.id === id);
  };

  const cancelTicket = async (ticketId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the ticket to cancel
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return false;
      }
      
      const ticketToCancel = tickets[ticketIndex];
      
      // In a real app, we would send a request to cancel the ticket
      // For now, we'll just update our local state
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        status: 'cancelled'
      };
      
      setTickets(updatedTickets);
      
      // Créer une notification pour l'annulation du ticket
      createTicketNotification(
        ticketId,
        'cancelled',
        {
          departure: ticketToCancel.trip.departure.city,
          arrival: ticketToCancel.trip.arrival.city,
          date: ticketToCancel.trip.departure.time
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const transferTicket = async (ticketId: string, recipientId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the ticket to transfer
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return false;
      }
      
      const ticketToTransfer = tickets[ticketIndex];
      
      // In a real app, we would send a request to transfer the ticket
      // For now, we'll just update our local state
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        userId: recipientId
      };
      
      setTickets(updatedTickets);
      
      // Créer une notification pour le transfert du ticket
      createTicketNotification(
        ticketId,
        'updated',
        {
          departure: ticketToTransfer.trip.departure.city,
          arrival: ticketToTransfer.trip.arrival.city,
          date: ticketToTransfer.trip.departure.time
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error transferring ticket:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un nouveau ticket
  interface CreateTicketParams {
    tripId: string;
    userId: string;
    seats: string[];
    tripType?: 'one-way' | 'round-trip';
    passengerName: string;
    passengerEmail?: string;
    passengerPhone?: string;
    isForSelf?: boolean;
    relationToPassenger?: string;
    status: TicketStatus;
  }

  const createTicket = (params: CreateTicketParams): Ticket | null => {
    try {
      // Générer un ID unique pour le ticket
      const ticketId = `ticket${Date.now()}`;
      
      // Trouver les détails du voyage associé au ticket dans les données de voyage
      const tripData = tripsData.find(t => t.id === params.tripId);
      
      if (!tripData) {
        console.error('Trip not found for ticket creation');
        return null;
      }
      
      // Convertir les données du voyage pour s'assurer qu'elles correspondent au type attendu
      const tripDetails = {
        id: tripData.id,
        departure: tripData.departure,
        arrival: tripData.arrival,
        company: tripData.company,
        vehicleType: tripData.vehicleType as 'bus' | 'train' | 'ferry',
        duration: tripData.duration || '2h30', // Valeur par défaut si non définie
        price: tripData.price
      };
      
      // Créer le nouveau ticket conforme à l'interface Ticket
      const newTicket: Ticket = {
        id: ticketId,
        userId: params.userId,
        tripId: params.tripId,
        trip: tripDetails,
        seatNumber: params.seats.join(', '), // Convertir le tableau de sièges en chaîne
        passengerName: params.passengerName,
        status: params.status,
        purchaseDate: new Date().toISOString(),
        travelDate: tripDetails.departure.time,
        qrCode: `qr-${ticketId}`
      };
      
      // Ajouter le ticket à la liste des tickets
      setTickets(prevTickets => [...prevTickets, newTicket]);
      
      // Afficher le nouveau ticket dans la console pour débogage
      console.log('Nouveau ticket créé:', newTicket);
      
      // Créer une notification pour le nouveau ticket
      createTicketNotification(
        newTicket.id,
        'created',
        {
          departure: newTicket.trip.departure.city,
          arrival: newTicket.trip.arrival.city,
          date: newTicket.trip.departure.time
        }
      );
      
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return null;
    }
  };

  return {
    tickets,
    isLoading,
    getTicketsByStatus,
    getTicketById,
    transferTicket,
    createTicket,
    cancelTicket
  };
};

export default useTickets;
