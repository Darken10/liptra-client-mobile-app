export interface Voyage {
    id: string;
    departure: {
      city: string;
      station: string;
      time: string;
      country?: string;
    };
    arrival: {
      city: string;
      station: string;
      time: string;
      country?: string;
    };
    company: string;
    price: number;
    duration: string;
    availableSeats: number;
    vehicleType: 'bus' | 'train' | 'ferry';
    popularity?: number; // Ajout de la propriété popularity optionnelle
  }
  