import { useState } from 'react';
import PaymentService from '../services/PaymentService';
import { OrangeMoneyPayementPayload } from '../types/payement.type';

interface PopularDestinationType {
    city: string;
    country: string;
}

const usePayement = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const payByOrangeMoney = async ( payload: OrangeMoneyPayementPayload ) => {
        try {
            setIsLoading(true);
            
            const response = await PaymentService.payByOrangeMoney(payload);
            return response;
            
        } catch (error) {
            console.error('Error paying by Orange Money:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        payByOrangeMoney
    };
};

export default usePayement;
