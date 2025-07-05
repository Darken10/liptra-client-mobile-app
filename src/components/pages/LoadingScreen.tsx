import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { colors } from '../natiui'

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Chargement...</Text>
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})