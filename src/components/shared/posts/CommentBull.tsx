import { Comment } from '@/src/types'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CustumAvatar from '../CustumAvatar'

interface CommentBullProps {
    comment: Comment;
    onDelete?: (commentId: string) => Promise<void>;
    isCurrentUserComment?: boolean;
    isDeleting?: boolean;
}

const CommentBull = ({ 
    comment, 
    onDelete, 
    isCurrentUserComment = false,
    isDeleting = false 
}: CommentBullProps) => {
    const handleDelete = () => {
        if (onDelete && !isDeleting) {
            onDelete(comment.id);
        }
    };

    return (
        <View style={styles.container}>
            <CustumAvatar source={comment.author?.avatar || ""} size="md" name={comment.author?.name || "Anonyme"} />
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.name}>{comment.author?.name || "Anonyme"}</Text>
                    <View style={styles.rightHeader}>
                        <Text style={styles.date}>{"il y a 2 min"}</Text>
                        {isCurrentUserComment && (
                            <TouchableOpacity 
                                onPress={handleDelete} 
                                style={styles.deleteButton}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="#EF4444" />
                                ) : (
                                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <Text style={styles.content}>{comment.content}</Text>
            </View>
        </View>
    )
}

export default CommentBull

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    contentContainer: {
        flex: 1,
        borderRightWidth: 4,
        borderRightColor: '#E5E7EB',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        marginLeft: 8,
        padding: 4,
    },
    name: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 14,
    },
    date: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'right',
    },
})