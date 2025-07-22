import { PaymentMethodItemType } from '@/src/constants/payementMethodeList';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface PaymentMethodCardProps {
    method: PaymentMethodItemType;
    onPress: () => void;
}
const PaymentMethodCard = ({ method, onPress }: PaymentMethodCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.methodImageContainer}>
            <Image source={method.image} style={styles.methodImage} />
        </View>
      <View style={styles.methodNameContainer}>
        <Text style={styles.methodName}>{method.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default PaymentMethodCard

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 8,
        elevation: 1,
    },
    methodImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    methodNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    methodName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    methodImage: {
        width: 50,
        height: 50,
    },
})