import { useEffect, useState } from 'react';
import VoyageService from '../services/voyageService';
import { SearchParams, Seat, Voyage, VoyageDetail } from '../types';

interface PopularDestinationType {
    city: string;
    country: string;
}

const useVoyage = () => {
    const [trips, setTrips] = useState<Voyage[]>([]);
    const [filteredTrips, setFilteredTrips] = useState<Voyage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [popularDestination, setPopularDestination] = useState<PopularDestinationType[]>([]);
    const [voyage, setVoyage] = useState<VoyageDetail | undefined>(undefined);
    const [isGetVoyageByIdLoading, setIsGetVoyageByIdLoading] = useState<boolean>(false);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
    const [popularVoyage, setPopularVoyage] = useState<Voyage[]>([]);
    const [isGetSeatsLoading, setIsGetSeatsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setIsLoading(true);

                const apiResponse: Voyage[] = await VoyageService.getVoyageList({}) as Voyage[] | [];
                console.log("apiResponse : ", apiResponse);

                setTrips(apiResponse || []);
                setFilteredTrips(apiResponse || []);
                setPopularVoyage(apiResponse.slice(0, 3));
                console.log("popularVoyage : ", popularVoyage);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                updatePopularDestination();
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const searchVoyage = async (params: SearchParams) => {
        setIsSearchLoading(true);

        let results = [...trips];

        if (params.departureCity) {
            results = await VoyageService.getVoyageList({ filters: { departureCity: params.departureCity } }) as Voyage[];
        }

        if (params.arrivalCity) {
            results = await VoyageService.getVoyageList({ filters: { arrivalCity: params.arrivalCity } }) as Voyage[];
        }

        if (params.company) {
            results = await VoyageService.getVoyageList({ filters: { company: params.company } }) as Voyage[];
        }

        if (params.date) {
            results = await VoyageService.getVoyageList({ filters: { date: params.date } }) as Voyage[];
        }

        setFilteredTrips(results);
        setIsSearchLoading(false);
    };

    const getVoyageById = async (id: string): Promise<VoyageDetail | undefined> => {
        // Si les voyages ne sont pas encore chargés, charger directement depuis les données brutes
        console.log("trips : ", trips);
        console.log("id : ", id);
        setIsGetVoyageByIdLoading(true);
        try {
            const voyage = await VoyageService.getVoyageById(id) as VoyageDetail;
            setVoyage(voyage);
            return voyage;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsGetVoyageByIdLoading(false);
        }
    };

    const getPopularVoyages = () => {
        return [...trips].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    };

    const updatePopularDestination = (departureCity: string = "") => {
        const destination = trips.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        
        // Collect all destinations first, then update state once
        const newPopularDestinations: PopularDestinationType[] = [];
        
        destination.forEach((trip) => {
            if (departureCity === "") {
                newPopularDestinations.push({ city: trip.departure.city, country: trip.departure.country || '' });
            } else if (trip.departure.city === departureCity) {
                newPopularDestinations.push({ city: trip.departure.city, country: trip.departure.country || '' });
            }
        });
        
        // Set state once with all collected destinations
        setPopularDestination(newPopularDestinations);
    };

    const refreshVoyage = () => {
        fetchTrips();
    };

    const fetchTrips = async () => {
        try {
            setIsLoading(true);

            const apiResponse: Voyage[] = await VoyageService.getVoyageList({}) as Voyage[];
            console.log("apiResponse : ", apiResponse);

            setTrips(apiResponse || []);
            setFilteredTrips(apiResponse || []);
            setPopularVoyage(apiResponse.slice(0, 3));
            console.log("popularVoyage : ", popularVoyage);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            updatePopularDestination();
            setIsLoading(false);
        }
    };

    const getSeats = async (voyageId: string): Promise<Seat[]> => {
        try {
            setIsGetSeatsLoading(true);
            setIsLoading(true);

            const apiResponse: Seat[] = await VoyageService.getSeatList(voyageId) as Seat[];
            return apiResponse;
        } catch (error) {
            console.error('Error fetching seats:', error);
            return [];
        } finally {
            setIsGetSeatsLoading(false);
            setIsLoading(false);
        }
    };

    return {
        voyages: filteredTrips,
        allVoyages: trips,
        isLoading,
        searchVoyage,
        getVoyageById,
        getPopularVoyages,
        updatePopularDestination,
        popularDestination,
        voyage,
        isGetVoyageByIdLoading,
        isSearchLoading,
        popularVoyage,
        refreshVoyage,
        getSeats,
        isGetSeatsLoading
    };
};

export default useVoyage;
