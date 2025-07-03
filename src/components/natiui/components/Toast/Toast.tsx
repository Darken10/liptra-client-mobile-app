import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  /**
   * Message à afficher
   */
  message: string;
  
  /**
   * Type du toast
   * @default 'info'
   */
  type?: ToastType;
  
  /**
   * Durée d'affichage en ms
   * @default 3000
   */
  duration?: number;
  
  /**
   * Position du toast
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
  
  /**
   * Fonction appelée lorsque le toast est fermé
   */
  onClose?: () => void;
  
  /**
   * Indique si le toast est visible
   * @default false
   */
  visible: boolean;
  
  /**
   * Action à afficher (bouton)
   */
  action?: {
    label: string;
    onPress: () => void;
  };
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le message
   */
  messageStyle?: TextStyle;
}

/**
 * Composant Toast
 * 
 * Un message temporaire qui apparaît en haut ou en bas de l'écran
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'bottom',
  onClose,
  visible,
  action,
  style,
  messageStyle,
}) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -20 : 20)).current;
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Configuration en fonction du type
  const getToastConfig = () => {
    const configs = {
      info: {
        backgroundColor: theme.colors.info,
        icon: 'information-circle-outline',
      },
      success: {
        backgroundColor: theme.colors.success,
        icon: 'checkmark-circle-outline',
      },
      warning: {
        backgroundColor: theme.colors.warning,
        icon: 'warning-outline',
      },
      error: {
        backgroundColor: theme.colors.error,
        icon: 'alert-circle-outline',
      },
    };
    
    return configs[type];
  };
  
  const config = getToastConfig();
  
  // Animations d'entrée et de sortie
  const animateIn = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Fermer automatiquement après la durée spécifiée
    if (duration > 0) {
      timeout.current = setTimeout(() => {
        animateOut();
      }, duration);
    }
  };
  
  const animateOut = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -20 : 20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) {
        onClose();
      }
    });
  };
  
  // Gérer l'affichage et la fermeture du toast
  useEffect(() => {
    if (visible) {
      animateIn();
    } else {
      animateOut();
    }
    
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [visible]);
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          [position]: 16,
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={config.icon as any}
          size={20}
          color="white"
          style={styles.icon}
        />
        
        <Text
          style={[
            styles.message,
            messageStyle,
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>
      </View>
      
      <View style={styles.actions}>
        {action && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              action.onPress();
              if (timeout.current) {
                clearTimeout(timeout.current);
              }
            }}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={animateOut}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Créer un gestionnaire de toasts
export type ToastOptions = Omit<ToastProps, 'visible' | 'onClose'>;

interface ToastInstance {
  show: (options: ToastOptions) => void;
  hide: () => void;
}

let toastInstance: ToastInstance | null = null;

export const createToast = (): ToastInstance => {
  return {
    show: (options: ToastOptions) => {
      // Cette fonction sera implémentée par le ToastProvider
    },
    hide: () => {
      // Cette fonction sera implémentée par le ToastProvider
    },
  };
};

export const toast = (): ToastInstance => {
  if (!toastInstance) {
    toastInstance = createToast();
  }
  
  return toastInstance;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 9999,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast;
