import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { useTheme } from '../../theme';

export interface ProgressBarProps {
  /**
   * Valeur de progression (entre 0 et 1)
   */
  progress: number;
  
  /**
   * Hauteur de la barre de progression
   * @default 8
   */
  height?: number;
  
  /**
   * Couleur de la barre de progression
   */
  color?: string;
  
  /**
   * Couleur de fond de la barre de progression
   */
  backgroundColor?: string;
  
  /**
   * Indique si la progression est indéterminée
   * @default false
   */
  indeterminate?: boolean;
  
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
 * Composant ProgressBar
 * 
 * Une barre de progression pour visualiser l'avancement d'une opération
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  backgroundColor,
  indeterminate = false,
  showValue = false,
  valueFormatter,
  style,
  valueStyle,
}) => {
  const theme = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const indeterminateAnim = useRef(new Animated.Value(0)).current;
  
  // Couleurs
  const effectiveColor = color || theme.colors.primary;
  const effectiveBackgroundColor = backgroundColor || theme.colors.backgroundLight;
  
  // Animer la progression lorsqu'elle change
  useEffect(() => {
    if (!indeterminate) {
      Animated.timing(progressAnim, {
        toValue: Math.max(0, Math.min(progress, 1)),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, indeterminate, progressAnim]);
  
  // Animation indéterminée
  useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(indeterminateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(indeterminateAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      indeterminateAnim.setValue(0);
    }
    
    return () => {
      indeterminateAnim.setValue(0);
    };
  }, [indeterminate, indeterminateAnim]);
  
  // Formater la valeur affichée
  const getFormattedValue = () => {
    if (valueFormatter) {
      return valueFormatter(progress);
    }
    
    // Format par défaut: pourcentage
    return `${Math.round(progress * 100)}%`;
  };
  
  // Largeur animée pour le mode indéterminé
  const indeterminateWidth = indeterminateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['10%', '70%', '10%'],
  });
  
  // Position animée pour le mode indéterminé
  const indeterminatePosition = indeterminateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: effectiveBackgroundColor,
            borderRadius: height / 2,
          },
        ]}
      >
        {indeterminate ? (
          <Animated.View
            style={[
              styles.fill,
              {
                height,
                backgroundColor: effectiveColor,
                borderRadius: height / 2,
                width: indeterminateWidth,
                left: indeterminatePosition,
              },
            ]}
          />
        ) : (
          <Animated.View
            style={[
              styles.fill,
              {
                height,
                backgroundColor: effectiveColor,
                borderRadius: height / 2,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        )}
      </View>
      
      {showValue && !indeterminate && (
        <Text
          style={[
            styles.value,
            { color: theme.colors.text },
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
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
  },
  value: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
});

export default ProgressBar;
