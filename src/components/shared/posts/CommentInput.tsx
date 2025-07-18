import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native'
import Input from '../Input'

interface CommentInputProps {
  onSubmit: (comment: string) => Promise<void>;
  isLoading?: boolean;
}

const CommentInput = ({ onSubmit, isLoading = false }: CommentInputProps) => {
  const [comment, setComment] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <MaterialIcons name="add-comment" size={18} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          placeholder="Ajouter un commentaire"
          style={styles.textInput}
          multiline={false}
          value={comment}
          onChangeText={setComment}
          maxLength={500}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={() => {
            if (comment.trim() && !isLoading) {
              onSubmit(comment.trim())
                .then(() => setComment(''))
                .catch(err => console.error('Error submitting comment:', err));
            }
          }}
          disabled={isLoading || !comment.trim()}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Ionicons 
              name="send-outline" 
              size={20} 
              color={comment.trim() ? "#3B82F6" : "#6B7280"} 
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CommentInput

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F9FAFB',
    },
    leftIcon: {
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 4,
        maxHeight: 80,
    },
    sendButton: {
        padding: 4,
        marginLeft: 4,
    },
})