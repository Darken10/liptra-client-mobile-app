import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NotificationBadgeProps = {
  size?: number;
  color?: string;
};

const NotificationBadge = ({ 
  size = 24, 
  color = '#3B82F6' 
}: NotificationBadgeProps) => {
  /* const { unreadCount } = useNotificationContext(); */
  const unreadCount = 10
  
  const handlePress = () => {
    router.push('/modals/notifications');
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      accessibilityLabel={`${unreadCount} notifications non lues`}
    >
      <Ionicons name="notifications" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationBadge;
