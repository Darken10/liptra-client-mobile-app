import { Comment } from '@/src/types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CustumAvatar from '../CustumAvatar'

const CommentBull = ({ comment }: { comment: Comment }) => {
    return (
        <View style={styles.container}>
            <CustumAvatar source={comment.author.avatar || ""} size="md" name={comment.author.name} />
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.name}>{comment.author.name}</Text>
                    <Text style={styles.date}>{"il y a 2 min"}</Text>
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