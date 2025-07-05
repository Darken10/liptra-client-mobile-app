import { Comment } from '@/src/types';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import CommentBull from './CommentBull';
import CommentInput from './CommentInput';

interface CommentSectionProps {
    comments: Comment[];
    /**
     * Indique si le composant est affiché dans un bottom sheet
     * @default false
     */
    inBottomSheet?: boolean;
}
const CommentSection = ({ comments, inBottomSheet = false }: CommentSectionProps) => {
  // Calculer la hauteur maximale pour le ScrollView des commentaires
  const windowHeight = Dimensions.get('window').height;
  const commentListHeight = inBottomSheet ? windowHeight * 0.6 : undefined;
  
  return (
    <View style={inBottomSheet ? styles.bottomSheetContainer : styles.container}>
      <Text style={styles.commentsTitle}>Commentaires</Text>
      <Text style={styles.commentsSubtitle}>
        {comments?.length || 0} commentaires
      </Text>

     <ScrollView 
        style={[styles.commentsContainer, inBottomSheet && { height: commentListHeight }]}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.commentsContentContainer}
     >
        {comments.map((comment) => (
            <CommentBull key={comment.id} comment={comment} />
        ))}
     </ScrollView>
     <View style={styles.commentInputContainer}>
        <CommentInput />
     </View>
    </View>
  )
}

export default CommentSection

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheetContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    commentsSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 8,
    },
    commentsContainer: {
        marginTop: 16,
    },
    commentsContentContainer: {
        paddingBottom: 16,
    },
    commentInputContainer: {
        marginTop: 16,
    },
})