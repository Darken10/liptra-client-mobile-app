import { Avatar } from '@/src/components/natiui/components/Avatar'
import { AvatarSize } from '@natiui/components/Avatar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CustumAvatar = ({source, size, name}: {source: string, size: AvatarSize, name: string}) => {
  return (
    <>
    {source ? (
                    <Avatar
                        source={{ uri: source }}
                        size={size}
                        style={styles.authorAvatar}
                    />
                ) : (
                    <View style={[styles.authorAvatar, styles.authorAvatarPlaceholder]}>
                        <Text style={styles.authorAvatarText}>
                            {name.charAt(0)}
                        </Text>
                    </View>
                )}
    </>
  )
}

export default CustumAvatar

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      authorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
      },
      authorAvatarPlaceholder: {
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
      },
      authorAvatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      },
      authorName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
      },
})