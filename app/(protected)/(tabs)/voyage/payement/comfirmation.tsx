import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Comfirmation = () => {
    const params = useLocalSearchParams();

    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comfirmation</Text>
      
    </View>
  )
}

export default Comfirmation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
})