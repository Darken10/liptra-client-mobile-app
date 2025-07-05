import { useEffect, useState } from 'react';
import tripsData from '../data/trips.json';
import { Voyage } from '../types';

interface SearchParams {
    departureCity?: string;
    arrivalCity?: string;
    date?: string;
    company?: string;
    passengers?: number;
}

interface PopularDestinationType {
    city: string;
    country: string;
}

const useVoyage = () => {
    const [trips, setTrips] = useState<Voyage[]>([]);
    const [filteredTrips, setFilteredTrips] = useState<Voyage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [popularDestination, setPopularDestination] = useState<PopularDestinationType[]>([]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setIsLoading(true);

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Convertir les données pour s'assurer que vehicleType est du bon type
                const typedTrips = tripsData.map(trip => ({
                    ...trip,
                    vehicleType: trip.vehicleType as 'bus' | 'train' | 'ferry'
                }));

                setTrips(typedTrips);
                setFilteredTrips(typedTrips);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                updatePopularDestination();
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const searchVoyage = (params: SearchParams) => {
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            let results = [...trips];

            if (params.departureCity) {
                results = results.filter(trip =>
                    trip.departure.city.toLowerCase().includes(params.departureCity!.toLowerCase())
                );
            }

            if (params.arrivalCity) {
                results = results.filter(trip =>
                    trip.arrival.city.toLowerCase().includes(params.arrivalCity!.toLowerCase())
                );
            }

            /* if (params.date) {
                // In a real app, we would do proper date filtering
                // For now, we'll just filter by the date part of the string
                const searchDate = params.date.split('T')[0];
                results = results.filter(trip =>
                    trip.departure.time.includes(searchDate)
                );
            } */

            if (params.company) {
                results = results.filter(trip =>
                    trip.company.toLowerCase().includes(params.company!.toLowerCase())
                );
            }

            setFilteredTrips(results);
            setIsLoading(false);
        }, 500);
    };

    const getVoyageById = (id: string): Voyage | undefined => {
        // Si les voyages ne sont pas encore chargés, charger directement depuis les données brutes
        console.log("trips : ", trips);
        console.log("tripsData : ", tripsData);
        console.log("id : ", id);
        if (trips.length === 0) {
            // Convertir les données pour s'assurer que vehicleType est du bon type
            const typedTrips = tripsData.map(trip => ({
                ...trip,
                vehicleType: trip.vehicleType as 'bus' | 'train' | 'ferry'
            }));

            return typedTrips.find(trip => trip.id === id);
        }

        // Sinon, utiliser les voyages déjà chargés
        return trips.find(trip => trip.id === id);
    };

    const getPopularVoyages = () => {
        return [...trips].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    };

    const updatePopularDestination = (departureCity: string = "") => {
        const destination = trips.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        setPopularDestination([]);
        destination.forEach((trip) => {
            if (departureCity === "") {
                setPopularDestination([...popularDestination, { city: trip.departure.city, country: trip.departure.country || '' }]);
            } else if (trip.departure.city === departureCity) {
                setPopularDestination([...popularDestination, { city: trip.departure.city, country: trip.departure.country || '' }]);
            }
        });
    };

    return {
        voyages: filteredTrips,
        allVoyages: trips,
        isLoading,
        searchVoyage,
        getVoyageById,
        getPopularVoyages,
        updatePopularDestination,
        popularDestination
    };
};

export default useVoyage;
