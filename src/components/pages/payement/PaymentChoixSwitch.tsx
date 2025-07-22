import { PaymentScreenParams } from '@/src/types/voyage';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import OrangeMoney from './OrangeMoney';

interface PaymentChoixSwitchProps {
    provider: string;
    params: PaymentScreenParams;
}

const PaymentChoixSwitch = ({provider, params}: PaymentChoixSwitchProps) => {
    switch(provider) {
        case 'orange-money':
            return <OrangeMoney params={params} />;
        case 'moov-money':
            return <Text>moov-money</Text>;
        case 'coris-money':
            return <Text>coris-money</Text>;
        case 'credit-card':
            return <Text>credit-card</Text>;
        case 'ligdi-cash':
            return <Text>ligdi-cash</Text>;
        case 'wave':
            return <Text>wave</Text>;
        case 'sank':
            return <Text>sank</Text>;
        default:
            return null;
    }
}

export default PaymentChoixSwitch

const styles = StyleSheet.create({})