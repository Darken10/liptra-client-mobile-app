import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator as RNActivityIndicator,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { useTheme } from '../../theme';

export interface ActivityIndicatorProps {
  /**
   * Taille de l'indicateur
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Couleur de l'indicateur
   */
  color?: string;
  
  /**
   * Texte à afficher sous l'indicateur
   */
  label?: string;
  
  /**
   * Indique si l'indicateur est animé
   * @default true
   */
  animating?: boolean;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
}

/**
 * Composant ActivityIndicator
 * 
 * Un indicateur de chargement circulaire
 */
export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  size = 'medium',
  color,
  label,
  animating = true,
  style,
  labelStyle,
}) => {
  const theme = useTheme();
  
  // Taille de l'indicateur en fonction de la taille spécifiée
  const getIndicatorSize = (): number | 'small' | 'large' => {
    const sizeMap = {
      small: 'small',
      medium: 'large',
      large: 40,
    };
    
    return sizeMap[size];
  };
  
  // Couleur de l'indicateur
  const effectiveColor = color || theme.colors.primary;
  
  return (
    <View style={[styles.container, style]}>
      <RNActivityIndicator
        size={getIndicatorSize()}
        color={effectiveColor}
        animating={animating}
      />
      
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.colors.textSecondary },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default ActivityIndicator;
