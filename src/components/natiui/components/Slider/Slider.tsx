import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Text,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '../../theme';

export interface SliderProps {
  /**
   * Valeur actuelle du slider
   */
  value: number;
  
  /**
   * Fonction appelée lorsque la valeur change
   */
  onValueChange?: (value: number) => void;
  
  /**
   * Fonction appelée lorsque le slider est relâché
   */
  onSlidingComplete?: (value: number) => void;
  
  /**
   * Valeur minimale
   * @default 0
   */
  minimumValue?: number;
  
  /**
   * Valeur maximale
   * @default 1
   */
  maximumValue?: number;
  
  /**
   * Pas de progression
   * @default 0 (continu)
   */
  step?: number;
  
  /**
   * Couleur de la piste avant le curseur
   */
  minimumTrackColor?: string;
  
  /**
   * Couleur de la piste après le curseur
   */
  maximumTrackColor?: string;
  
  /**
   * Couleur du curseur
   */
  thumbColor?: string;
  
  /**
   * Taille du curseur
   * @default 16
   */
  thumbSize?: number;
  
  /**
   * Hauteur de la piste
   * @default 4
   */
  trackHeight?: number;
  
  /**
   * Indique si le slider est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Indique si la valeur doit être affichée
   * @default false
   */
  showValue?: boolean;
  
  /**
   * Format de la valeur affichée
   */
  valueFormatter?: (value: number) => string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour la valeur
   */
  valueStyle?: TextStyle;
}

/**
 * Composant Slider
 * 
 * Un slider pour sélectionner une valeur dans une plage
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  onSlidingComplete,
  minimumValue = 0,
  maximumValue = 1,
  step = 0,
  minimumTrackColor,
  maximumTrackColor,
  thumbColor,
  thumbSize = 16,
  trackHeight = 4,
  disabled = false,
  showValue = false,
  valueFormatter,
  style,
  valueStyle,
}) => {
  const theme = useTheme();
  
  // Couleurs
  const effectiveMinTrackColor = minimumTrackColor || theme.colors.primary;
  const effectiveMaxTrackColor = maximumTrackColor || theme.colors.border;
  const effectiveThumbColor = thumbColor || theme.colors.primary;
  
  // Refs et state
  const [trackWidth, setTrackWidth] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const panValue = useRef(new Animated.Value(0)).current;
  const lastValue = useRef(value);
  
  // Mettre à jour la position du curseur lorsque la valeur change
  useEffect(() => {
    if (!isSliding && trackWidth > 0) {
      const position = ((value - minimumValue) / (maximumValue - minimumValue)) * trackWidth;
      panValue.setValue(position);
      lastValue.current = value;
    }
  }, [value, trackWidth, minimumValue, maximumValue, isSliding, panValue]);
  
  // Gestionnaire de mouvement
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        setIsSliding(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (trackWidth <= 0) return;
        
        // Calculer la nouvelle position
        let newPosition = gestureState.moveX - thumbSize / 2;
        
        // Limiter la position dans les bornes
        newPosition = Math.max(0, Math.min(newPosition, trackWidth));
        
        // Mettre à jour la position
        panValue.setValue(newPosition);
        
        // Calculer la nouvelle valeur
        let newValue = (newPosition / trackWidth) * (maximumValue - minimumValue) + minimumValue;
        
        // Appliquer le pas si nécessaire
        if (step > 0) {
          newValue = Math.round(newValue / step) * step;
        }
        
        // Limiter la valeur dans les bornes
        newValue = Math.max(minimumValue, Math.min(newValue, maximumValue));
        
        // Notifier du changement si la valeur a changé
        if (newValue !== lastValue.current) {
          lastValue.current = newValue;
          onValueChange?.(newValue);
        }
      },
      onPanResponderRelease: () => {
        setIsSliding(false);
        onSlidingComplete?.(lastValue.current);
      },
    })
  ).current;
  
  // Gérer le changement de dimension de la piste
  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
    
    // Initialiser la position du curseur
    const position = ((value - minimumValue) / (maximumValue - minimumValue)) * width;
    panValue.setValue(position);
  };
  
  // Formater la valeur affichée
  const getFormattedValue = () => {
    if (valueFormatter) {
      return valueFormatter(value);
    }
    
    // Format par défaut: jusqu'à 2 décimales si nécessaire
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  };
  
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.trackContainer,
          { height: Math.max(trackHeight, thumbSize) },
          disabled && { opacity: 0.5 },
        ]}
        onLayout={handleTrackLayout}
        {...panResponder.panHandlers}
      >
        {/* Piste de fond */}
        <View
          style={[
            styles.track,
            {
              height: trackHeight,
              backgroundColor: effectiveMaxTrackColor,
              borderRadius: trackHeight / 2,
            },
          ]}
        />
        
        {/* Piste active */}
        <Animated.View
          style={[
            styles.activeTrack,
            {
              height: trackHeight,
              backgroundColor: effectiveMinTrackColor,
              borderRadius: trackHeight / 2,
              width: panValue,
            },
          ]}
        />
        
        {/* Curseur */}
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: effectiveThumbColor,
              transform: [{ translateX: Animated.subtract(panValue, thumbSize / 2) }],
            },
          ]}
        />
      </View>
      
      {/* Valeur affichée */}
      {showValue && (
        <Text
          style={[
            styles.value,
            { color: theme.colors.text },
            disabled && { color: theme.colors.textDisabled },
            valueStyle,
          ]}
        >
          {getFormattedValue()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  trackContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    position: 'absolute',
  },
  activeTrack: {
    position: 'absolute',
  },
  thumb: {
    position: 'absolute',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  value: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Slider;
