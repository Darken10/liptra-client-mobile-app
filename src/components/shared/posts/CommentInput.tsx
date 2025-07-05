import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Input from '../Input'

const CommentInput = () => {
  return (
    <View>
      <Input placeholder="Ajouter un commentaire" 
      leftIcon={<MaterialIcons name="add-comment" size={20} color="#6B7280" />}
      rightIcon={
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="send-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      }
      multiline
       />
    </View>
  )
}

export default CommentInput

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
})