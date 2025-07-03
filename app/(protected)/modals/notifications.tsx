import { Button, colors } from '@/src/components/natiui'
import NotificationsPage from '@/src/components/pages/notifications/NotificationsPage'
import PageHeader from '@/src/components/shared/header'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const NotificationsScreen = () => {
  return (
    <View>
      <PageHeader title={'Notifcations'} 
      startActions={
        <Button onPress={()=>router.back()} >
          <Ionicons name="arrow-back-sharp" size={24} color={colors.white} />
        </Button>
      }       
      />
      <NotificationsPage />
    </View>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({})