import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Dimensions,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { useTheme } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  /**
   * Indique si le bottom sheet est visible
   */
  visible: boolean;
  
  /**
   * Fonction appelée lorsque le bottom sheet est fermé
   */
  onClose: () => void;
  
  /**
   * Contenu du bottom sheet
   */
  children: React.ReactNode;
  
  /**
   * Titre du bottom sheet
   */
  title?: string;
  
  /**
   * Hauteur du bottom sheet (en pourcentage de la hauteur de l'écran)
   * @default 50
   */
  height?: number;
  
  /**
   * Hauteur minimale du bottom sheet (en pourcentage de la hauteur de l'écran)
   * @default 25
   */
  minHeight?: number;
  
  /**
   * Hauteur maximale du bottom sheet (en pourcentage de la hauteur de l'écran)
   * @default 90
   */
  maxHeight?: number;
  
  /**
   * Indique si le bottom sheet peut être fermé en appuyant sur l'overlay
   * @default true
   */
  closeOnOverlayPress?: boolean;
  
  /**
   * Indique si le bottom sheet peut être fermé en glissant vers le bas
   * @default true
   */
  closeOnDragDown?: boolean;
  
  /**
   * Indique si le bottom sheet peut être redimensionné en glissant
   * @default true
   */
  enableResize?: boolean;
  
  /**
   * Indique si le bottom sheet doit afficher une poignée de glissement
   * @default true
   */
  showDragHandle?: boolean;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le titre
   */
  titleStyle?: TextStyle;
  
  /**
   * Style personnalisé pour la poignée
   */
  dragHandleStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour l'overlay
   */
  overlayStyle?: ViewStyle;
}

/**
 * Composant BottomSheet
 * 
 * Un panneau coulissant depuis le bas de l'écran
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  title,
  height = 50,
  minHeight = 25,
  maxHeight = 90,
  closeOnOverlayPress = true,
  closeOnDragDown = true,
  enableResize = true,
  showDragHandle = true,
  style,
  titleStyle,
  dragHandleStyle,
  overlayStyle,
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  
  // Calculer les hauteurs en pixels
  const initialHeight = (height / 100) * SCREEN_HEIGHT;
  const minHeightPx = (minHeight / 100) * SCREEN_HEIGHT;
  const maxHeightPx = (maxHeight / 100) * SCREEN_HEIGHT;
  
  // Gérer l'ouverture/fermeture du bottom sheet
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT - initialHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, translateY, overlayOpacity, initialHeight]);
  
  // Gestionnaire de mouvement
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableResize,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dy } = gestureState;
        return enableResize && Math.abs(dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        const newPosition = SCREEN_HEIGHT - initialHeight + dy;
        
        // Limiter la position dans les bornes
        if (newPosition >= SCREEN_HEIGHT - maxHeightPx && newPosition <= SCREEN_HEIGHT - minHeightPx) {
          translateY.setValue(newPosition);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        
        // Si la vitesse est élevée vers le bas ou le déplacement est important vers le bas
        if ((vy > 0.5 || dy > initialHeight / 2) && closeOnDragDown) {
          onClose();
          return;
        }
        
        // Sinon, revenir à la position initiale
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT - initialHeight,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;
  
  // Gérer le clic sur l'overlay
  const handleOverlayPress = () => {
    if (closeOnOverlayPress) {
      onClose();
    }
  };
  
  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <Animated.View
            style={[
              styles.overlay,
              {
                backgroundColor: theme.colors.black,
                opacity: overlayOpacity,
              },
              overlayStyle,
            ]}
          />
        </TouchableWithoutFeedback>
        
        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: theme.colors.background,
              transform: [{ translateY }],
            },
            style,
          ]}
          {...panResponder.panHandlers}
        >
          {/* Poignée */}
          {showDragHandle && (
            <View style={styles.dragHandleContainer}>
              <View
                style={[
                  styles.dragHandle,
                  { backgroundColor: theme.colors.border },
                  dragHandleStyle,
                ]}
              />
            </View>
          )}
          
          {/* Titre */}
          {title && (
            <Text
              style={[
                styles.title,
                { color: theme.colors.text },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}
          
          {/* Contenu */}
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 16,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default BottomSheet;
