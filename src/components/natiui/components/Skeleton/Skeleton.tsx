import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ViewStyle,
  Easing,
} from 'react-native';
import { useTheme } from '../../theme';

export interface SkeletonProps {
  /**
   * Type de squelette
   * @default 'rectangle'
   */
  type?: 'rectangle' | 'circle' | 'text';
  
  /**
   * Largeur du squelette
   */
  width?: number | string;
  
  /**
   * Hauteur du squelette
   */
  height?: number | string;
  
  /**
   * Rayon de bordure
   */
  borderRadius?: number;
  
  /**
   * Couleur du squelette
   */
  color?: string;
  
  /**
   * Couleur de l'animation
   */
  highlightColor?: string;
  
  /**
   * Indique si l'animation est active
   * @default true
   */
  animation?: boolean;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
}

/**
 * Composant Skeleton
 * 
 * Un placeholder animé pour indiquer le chargement du contenu
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'rectangle',
  width,
  height,
  borderRadius,
  color,
  highlightColor,
  animation = true,
  style,
}) => {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Couleurs
  const effectiveColor = color || theme.colors.backgroundLight;
  const effectiveHighlightColor = highlightColor || theme.colors.background;
  
  // Dimensions par défaut en fonction du type
  const getDefaultDimensions = () => {
    switch (type) {
      case 'circle':
        return {
          width: width || 50,
          height: height || 50,
          borderRadius: borderRadius !== undefined ? borderRadius : 25,
        };
      case 'text':
        return {
          width: width || '100%',
          height: height || 16,
          borderRadius: borderRadius !== undefined ? borderRadius : 4,
        };
      default:
        return {
          width: width || '100%',
          height: height || 100,
          borderRadius: borderRadius !== undefined ? borderRadius : 4,
        };
    }
  };
  
  const dimensions = getDefaultDimensions();
  
  // Animation de pulse
  useEffect(() => {
    if (animation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
    
    return () => {
      animatedValue.setValue(0);
    };
  }, [animation, animatedValue]);
  
  // Couleur animée
  const backgroundColor = animation
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [effectiveColor, effectiveHighlightColor],
      })
    : effectiveColor;
  
  return (
    <Animated.View
      style={[
        styles.container,
        dimensions,
        { backgroundColor },
        style,
      ]}
    />
  );
};

/**
 * Composant SkeletonGroup
 * 
 * Un groupe de squelettes pour créer des mises en page complexes
 */
export interface SkeletonGroupProps {
  /**
   * Contenu du groupe
   */
  children: React.ReactNode;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.group, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  group: {
    width: '100%',
  },
});

export default Skeleton;
