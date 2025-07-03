import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NotificationToastProps = {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onDismiss: () => void;
  duration?: number;
};

const NotificationToast = ({
  title,
  message,
  type,
  onDismiss,
  duration = 5000
}: NotificationToastProps) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Obtenir l'icône et la couleur en fonction du type de notification
  const getNotificationIcon = () => {
    switch (type) {
      case 'info':
        return { name: 'information-circle', color: '#3B82F6' };
      case 'success':
        return { name: 'checkmark-circle', color: '#10B981' };
      case 'warning':
        return { name: 'warning', color: '#F59E0B' };
      case 'error':
        return { name: 'alert-circle', color: '#EF4444' };
      default:
        return { name: 'information-circle', color: '#3B82F6' };
    }
  };
  
  const { name, color } = getNotificationIcon();
  
  useEffect(() => {
    // Afficher la notification
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
    
    // Masquer la notification après la durée spécifiée
    const timer = setTimeout(() => {
      hideNotification();
    }, duration);
    
    return () => clearTimeout(timer);
  }, []);
  
  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      onDismiss();
    });
  };
  
  const handlePress = () => {
    hideNotification();
    // Naviguer vers la page des notifications
    router.push('/modals/notifications');
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }], opacity }
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={name as any} size={24} color={color} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message} numberOfLines={2}>{message}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={hideNotification}
        >
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
  },
  closeButton: {
    padding: 8,
  },
});

export default NotificationToast;
