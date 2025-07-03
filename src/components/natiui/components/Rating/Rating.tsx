import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface RatingProps {
  /**
   * Valeur actuelle de la note (entre 0 et maxValue)
   */
  value: number;
  
  /**
   * Fonction appelée lorsque la note change
   */
  onValueChange?: (value: number) => void;
  
  /**
   * Nombre maximum d'étoiles
   * @default 5
   */
  maxValue?: number;
  
  /**
   * Taille des étoiles
   * @default 24
   */
  size?: number;
  
  /**
   * Couleur des étoiles actives
   */
  activeColor?: string;
  
  /**
   * Couleur des étoiles inactives
   */
  inactiveColor?: string;
  
  /**
   * Espacement entre les étoiles
   * @default 4
   */
  spacing?: number;
  
  /**
   * Indique si les notes partielles sont autorisées
   * @default false
   */
  allowHalf?: boolean;
  
  /**
   * Indique si la note est en lecture seule
   * @default false
   */
  readonly?: boolean;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Nom de l'icône pour les étoiles
   * @default 'star'
   */
  iconName?: string;
  
  /**
   * Nom de l'icône pour les demi-étoiles
   * @default 'star-half'
   */
  halfIconName?: string;
  
  /**
   * Nom de l'icône pour les étoiles vides
   * @default 'star-outline'
   */
  emptyIconName?: string;
}

/**
 * Composant Rating
 * 
 * Un composant pour afficher et sélectionner des notes sous forme d'étoiles
 */
export const Rating: React.FC<RatingProps> = ({
  value,
  onValueChange,
  maxValue = 5,
  size = 24,
  activeColor,
  inactiveColor,
  spacing = 4,
  allowHalf = false,
  readonly = false,
  style,
  iconName = 'star',
  halfIconName = 'star-half',
  emptyIconName = 'star-outline',
}) => {
  const theme = useTheme();
  
  // Couleurs
  const effectiveActiveColor = activeColor || theme.colors.warning;
  const effectiveInactiveColor = inactiveColor || theme.colors.border;
  
  // Générer un tableau de valeurs pour les étoiles
  const stars = Array.from({ length: maxValue }, (_, i) => i + 1);
  
  // Gérer le clic sur une étoile
  const handlePress = (newValue: number) => {
    if (readonly || !onValueChange) return;
    
    // Si on clique sur la valeur actuelle, réinitialiser à 0
    if (Math.ceil(value) === newValue) {
      onValueChange(0);
      return;
    }
    
    onValueChange(newValue);
  };
  
  // Gérer le clic sur une demi-étoile
  const handleHalfPress = (newValue: number) => {
    if (readonly || !onValueChange || !allowHalf) return;
    
    // Si la valeur actuelle est déjà cette demi-étoile, réinitialiser à l'entier précédent
    if (value === newValue - 0.5) {
      onValueChange(Math.floor(value));
      return;
    }
    
    onValueChange(newValue - 0.5);
  };
  
  // Rendu d'une étoile
  const renderStar = (starValue: number) => {
    // Déterminer le type d'étoile à afficher
    const getIconName = () => {
      if (value >= starValue) {
        return iconName;
      } else if (allowHalf && value >= starValue - 0.5) {
        return halfIconName;
      }
      return emptyIconName;
    };
    
    // Déterminer la couleur de l'étoile
    const getIconColor = () => {
      if (value >= starValue || (allowHalf && value >= starValue - 0.5)) {
        return effectiveActiveColor;
      }
      return effectiveInactiveColor;
    };
    
    return (
      <View key={starValue} style={{ marginRight: starValue < maxValue ? spacing : 0 }}>
        {allowHalf ? (
          <View style={styles.starContainer}>
            {/* Zone de clic pour la demi-étoile gauche */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleHalfPress(starValue)}
              disabled={readonly}
              style={[styles.halfStar, { left: 0 }]}
            />
            
            {/* Zone de clic pour l'étoile complète */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handlePress(starValue)}
              disabled={readonly}
              style={[styles.halfStar, { right: 0 }]}
            />
            
            {/* Icône de l'étoile */}
            <Ionicons
              name={getIconName() as any}
              size={size}
              color={getIconColor()}
            />
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handlePress(starValue)}
            disabled={readonly}
          >
            <Ionicons
              name={getIconName() as any}
              size={size}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {stars.map(renderStar)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    position: 'relative',
  },
  halfStar: {
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    zIndex: 1,
  },
});

export default Rating;
