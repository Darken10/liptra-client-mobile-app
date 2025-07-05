import { List, ListItem } from '@natiui/components'
import { colors } from '@natiui/index'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const MenuSettings = ({visible, onClose}: {visible: boolean, onClose: () => void}) => {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => { onClose()}} style={styles.closeButton}>
        <Text style={styles.title}>Fermer</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <List>
          <ListItem
            title="Paramètres"
            leftIcon="person"
            onPress={() => {}}
          />
          <ListItem
            title="Paramètres"
            leftIcon="person"
            onPress={() => {}}
          />
          <ListItem
            title="Paramètres"
            leftIcon="person"
            onPress={() => {}}
          />
          <ListItem
            title="Paramètres"
            leftIcon="person"
            onPress={() => {}}
          />
        </List>
      </View>
    </View>
  )
}

export default MenuSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '75%',
        left: 0,
        zIndex: 1000,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginHorizontal: 16,
        marginTop: 16,
    },
    content: {
        flex: 1,
        marginHorizontal: 6,
        marginTop: 30,

    },
    closeButton: {
        top: 16,
        right: 16,
    },
  })