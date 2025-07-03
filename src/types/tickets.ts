
export type TicketStatus = 'valid' | 'paused' | 'blocked' | 'used' | 'upcoming' | 'past' | 'cancelled';

export interface Ticket {
  id: string;
  tripId: string;
  userId: string;
  passengerName: string;
  seatNumber: string;
  purchaseDate: string;
  travelDate: string;
  qrCode: string;
  status: TicketStatus;
  trip: {
    departure: {
      city: string;
      station: string;
      time: string;
    };
    arrival: {
      city: string;
      station: string;
      time: string;
    };
    company: string;
    vehicleType: 'bus' | 'train' | 'ferry';
    duration: string;
  };
}
