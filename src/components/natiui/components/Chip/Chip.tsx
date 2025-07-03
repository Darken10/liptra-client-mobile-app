import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface ChipProps {
  /**
   * Label du chip
   */
  label: string;
  
  /**
   * Icône à afficher à gauche du label
   */
  leftIcon?: string;
  
  /**
   * Icône à afficher à droite du label (généralement pour supprimer)
   */
  rightIcon?: string;
  
  /**
   * Fonction appelée lorsque le chip est pressé
   */
  onPress?: () => void;
  
  /**
   * Fonction appelée lorsque l'icône de droite est pressée
   */
  onRightIconPress?: () => void;
  
  /**
   * Indique si le chip est sélectionné
   * @default false
   */
  selected?: boolean;
  
  /**
   * Indique si le chip est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Variante du chip
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';
  
  /**
   * Taille du chip
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Couleur du chip
   */
  color?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
  
  /**
   * Taille des icônes
   */
  iconSize?: number;
  
  /**
   * Couleur des icônes
   */
  iconColor?: string;
}

/**
 * Composant Chip
 * 
 * Un élément compact pour représenter une entrée, un attribut ou une action
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  leftIcon,
  rightIcon,
  onPress,
  onRightIconPress,
  selected = false,
  disabled = false,
  variant = 'filled',
  size = 'medium',
  color,
  style,
  labelStyle,
  iconSize,
  iconColor,
}) => {
  const theme = useTheme();
  
  // Tailles en fonction de la taille spécifiée
  const getSizes = () => {
    const sizeMap = {
      small: {
        height: 24,
        paddingHorizontal: 8,
        fontSize: 12,
        iconSize: 14,
      },
      medium: {
        height: 32,
        paddingHorizontal: 12,
        fontSize: 14,
        iconSize: 16,
      },
      large: {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 16,
        iconSize: 18,
      },
    };
    
    return sizeMap[size];
  };
  
  const sizes = getSizes();
  const effectiveIconSize = iconSize || sizes.iconSize;
  
  // Couleurs
  const effectiveColor = color || theme.colors.primary;
  const effectiveIconColor = iconColor || (variant === 'filled' ? theme.colors.white : effectiveColor);
  
  // Styles en fonction de la variante et de l'état
  const getContainerStyle = (): ViewStyle => {
    if (variant === 'filled') {
      if (selected) {
        return {
          backgroundColor: effectiveColor,
          borderColor: effectiveColor,
        };
      }
      
      return {
        backgroundColor: theme.colors.backgroundLight,
        borderColor: theme.colors.backgroundLight,
      };
    }
    
    // Outlined
    if (selected) {
      return {
        backgroundColor: 'transparent',
        borderColor: effectiveColor,
      };
    }
    
    return {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
    };
  };
  
  // Style du texte en fonction de la variante et de l'état
  const getLabelStyle = (): TextStyle => {
    if (variant === 'filled') {
      if (selected) {
        return {
          color: theme.colors.white,
        };
      }
      
      return {
        color: theme.colors.text,
      };
    }
    
    // Outlined
    if (selected) {
      return {
        color: effectiveColor,
      };
    }
    
    return {
      color: theme.colors.text,
    };
  };
  
  // Gérer le clic sur l'icône de droite
  const handleRightIconPress = (e: any) => {
    e.stopPropagation();
    if (!disabled && onRightIconPress) {
      onRightIconPress();
    }
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.container,
        {
          height: sizes.height,
          paddingHorizontal: sizes.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
          borderWidth: 1,
          borderRadius: sizes.height / 2,
        },
        getContainerStyle(),
        style,
      ]}
    >
      {leftIcon && (
        <Ionicons
          name={leftIcon as any}
          size={effectiveIconSize}
          color={effectiveIconColor}
          style={styles.leftIcon}
        />
      )}
      
      <Text
        style={[
          styles.label,
          {
            fontSize: sizes.fontSize,
          },
          getLabelStyle(),
          labelStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      
      {rightIcon && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleRightIconPress}
          disabled={disabled || !onRightIconPress}
          style={styles.rightIconContainer}
        >
          <Ionicons
            name={rightIcon as any}
            size={effectiveIconSize}
            color={effectiveIconColor}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIconContainer: {
    marginLeft: 4,
  },
});

export default Chip;
