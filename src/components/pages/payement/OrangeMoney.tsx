import { Toast } from '@/src/context/ToastContext';
import { PaymentScreenParams } from '@/src/types/voyage';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@natiui/components';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Input from '../../shared/Input';

interface OrangeMoneyProps {
    params: PaymentScreenParams;
}

const OrangeMoney = ({ params }: OrangeMoneyProps) => {
    const totalPrice = params.totalPrice as string;
    const [isLoading, setIsLoading] = React.useState(false);

    const [number, setNumber] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [validationError, setValidationError] = React.useState({
        number: '',
        otp: '',
    });

    const resetValidation = () => {
        setValidationError({
            number: '',
            otp: '',
        });
    }

    const handlePay = () => {
        resetValidation();
        
        if (number.length < 8) {
            setValidationError({
                number: 'Le numéro doit contenir au moins 8 chiffres',
                otp: '',
            });
            return;
        }
        if (otp.length < 6) {
            setValidationError({
                number: '',
                otp: 'Le code OTP doit contenir au moins 6 chiffres',
            });
            return;
        }

        
        setIsLoading(true);
        console.log('number', number);
        console.log('otp', otp);
         setTimeout(() => {
            setIsLoading(false);
            Toast.show({
                message: 'Orange Money',
                type: 'success',
            });
        }, 2000);

 
        



    }



    return (
        <ScrollView >
            <Input 
                placeholder="Numéro Orange Money"
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
                label="Numéro Orange Money"
                error={validationError.number}
                leftIcon={<Ionicons name="call-outline" size={24} color="black" />}
            />
            <Input 
                placeholder="Code OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                label="Code OTP"
                error={validationError.otp}
                maxLength={6}
                leftIcon={<Ionicons name="key-outline" size={24} color="black" />}
            />


                <View style={styles.footer}>
                    <Button
                        size="large"
                        onPress={handlePay}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? "Traitement en cours..." : "Payer " + totalPrice + " FCFA"}
                    </Button>
                </View>
        </ScrollView>
    )
}

export default OrangeMoney

const styles = StyleSheet.create({

    footer: {
        marginTop: 24,
        width: '100%',
        paddingHorizontal: 16,
    },

})