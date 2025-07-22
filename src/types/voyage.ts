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
    aller_retour_price: number;
    aller_simple_price: number;
    duration: string;
    availableSeats: number;
    vehicleType: 'bus' | 'train' | 'ferry';
    popularity?: number; // Ajout de la propriété popularity optionnelle
}

export interface VoyageDetail {
  id: string;
  departure: {
    city: string;
    station: string;
    time: string; // Format: "YYYY-MM-DD HH:mm:ss"
  };
  arrival: {
    city: string;
    station: string;
    time: string;
  };
  company: string;
  price: number;
  aller_retour_price: number;
  duration: string; // Format: "HH:mm:ss"
  availableSeats: number;
  vehicleType: string;
  popularity: number;
  chauffer: {
    id: string | null;
    name: string;
    genre: string;
  };
  vehicle: {
    id: string;
    name: string;
    type: string;
    seats_number: number;
    classe: string;
    image: string | null;
    features: {
      id: string;
      name: string;
      description: string;
    }[];
  };
  seats: Seat[];
}

  

export interface payementModeTypeList{
  logo : string,
  name : string,
  type : string,
  redirect_url : string
}

export interface TripFilters {
  departureCity?: string;
  arrivalCity?: string;
  date?: string; // Format ISO recommandé: 'YYYY-MM-DD'
  company?: string;
}

export interface SearchParams extends TripFilters {
    passengers?: number;
}
export interface Seat {
    id: string;
    name: string;
    price: number;
    type: string;
    care?: string;
    is_available?: boolean;
}



export interface PaymentScreenParams {
  tripId: string;
  seats: string;
  tripType: 'one-way' | 'round-trip';
  isForSelf: 'true' | 'false';
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  relationToPassenger: string;
  totalPrice: string;
  payementMode: string;
}