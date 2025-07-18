import { Comment } from '@/src/types';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import CommentBull from './CommentBull';
import CommentInput from './CommentInput';

interface CommentSectionProps {
    comments: Comment[];
    /**
     * Indique si le composant est affiché dans un bottom sheet
     * @default false
     */
    inBottomSheet?: boolean;
    /**
     * Fonction appelée lorsqu'un commentaire est ajouté
     */
    onAddComment?: (comment: string) => Promise<void>;
    /**
     * Fonction appelée lorsqu'un commentaire est supprimé
     */
    onDeleteComment?: (commentId: string) => Promise<void>;
    /**
     * Indique si l'ajout de commentaire est en cours
     */
    isAddingComment?: boolean;
    /**
     * ID de l'utilisateur courant pour identifier ses commentaires
     */
    currentUserId?: string;
}
const CommentSection = ({ 
  comments, 
  inBottomSheet = false, 
  onAddComment, 
  onDeleteComment,
  isAddingComment = false,
  currentUserId = '1' // Valeur par défaut pour les tests
}: CommentSectionProps) => {
  // Calculer la hauteur maximale pour le ScrollView des commentaires
  const windowHeight = Dimensions.get('window').height;
  const commentListHeight = inBottomSheet ? windowHeight * 0.67 : undefined;
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  
  // Gérer l'affichage du clavier
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        // Faire défiler vers le bas lorsque le clavier apparaît
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        // Synchroniser à nouveau après la fermeture du clavier
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }, 300);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  return (
    <KeyboardAvoidingView 
      style={inBottomSheet ? styles.bottomSheetContainer : styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      {!keyboardVisible && (
        <>
          <Text style={styles.commentsTitle}>Commentaires</Text>
          <Text style={styles.commentsSubtitle}>
            {comments?.length || 0} commentaires
          </Text>
        </>
      )}

     <ScrollView 
        ref={scrollViewRef}
        style={[styles.commentsContainer, inBottomSheet && { maxHeight: keyboardVisible && commentListHeight ? commentListHeight * 0.5 : commentListHeight }]}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.commentsContentContainer}
        showsVerticalScrollIndicator={true}
     >
      
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
              <CommentBull 
                key={comment.id} 
                comment={comment} 
                isCurrentUserComment={comment.author?.id == currentUserId}
                onDelete={async (commentId) => {
                  if (onDeleteComment) {
                    setDeletingCommentId(commentId);
                    try {
                      await onDeleteComment(commentId);
                    } catch (error) {
                      console.error('Error deleting comment:', error);
                    } finally {
                      setDeletingCommentId(null);
                    }
                  }
                }}
                isDeleting={deletingCommentId === comment.id}
              />
          ))
        ) : (
          <Text style={styles.noCommentsText}>Aucun commentaire pour le moment</Text>
        )}
     </ScrollView>
     <View style={[styles.commentInputContainer, keyboardVisible && styles.commentInputWithKeyboard]}>
        <CommentInput 
          onSubmit={(comment) => {
            if (onAddComment) {
              return onAddComment(comment).then(() => {
                // Faire défiler vers le bas après l'ajout d'un commentaire
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              });
            }
            return Promise.resolve();
          }}
          isLoading={isAddingComment}
        />
     </View>
    </KeyboardAvoidingView>
  )
}

export default CommentSection

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
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
        marginTop: 8,
        marginBottom: 8,
    },
    commentInputWithKeyboard: {
        marginTop: 8,
        marginBottom: 0,
        paddingBottom: 0,
    },
    noCommentsText: {
        fontSize: 14,
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 20,
    },
})