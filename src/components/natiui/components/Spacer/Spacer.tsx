import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface SpacerProps {
  /**
   * Espacement horizontal
   */
  horizontal?: number | keyof typeof spacingSizes;
  
  /**
   * Espacement vertical
   */
  vertical?: number | keyof typeof spacingSizes;
  
  /**
   * Espacement uniforme (appliqué à la fois horizontalement et verticalement)
   */
  size?: number | keyof typeof spacingSizes;
  
  /**
   * Style personnalisé
   */
  style?: ViewStyle;
}

// Tailles d'espacement prédéfinies
const spacingSizes = {
  'xs': 4,
  'sm': 8,
  'md': 16,
  'lg': 24,
  'xl': 32,
  '2xl': 40,
  '3xl': 48,
};

/**
 * Composant Spacer
 * 
 * Un composant pour gérer facilement les espacements dans la mise en page
 */
export const Spacer: React.FC<SpacerProps> = ({
  horizontal,
  vertical,
  size,
  style,
}) => {
  const theme = useTheme();
  
  // Fonction pour obtenir la valeur numérique d'un espacement
  const getSpacingValue = (value?: number | keyof typeof spacingSizes): number => {
    if (value === undefined) return 0;
    
    if (typeof value === 'number') {
      return value;
    }
    
    return spacingSizes[value] || theme.spacing[value] || 0;
  };
  
  // Calculer les dimensions
  const width = getSpacingValue(horizontal || size);
  const height = getSpacingValue(vertical || size);
  
  return <View style={[{ width, height }, style]} />;
};

export default Spacer;
