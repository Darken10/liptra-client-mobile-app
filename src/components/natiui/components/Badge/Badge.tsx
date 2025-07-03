import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export type BadgeVariant = 'filled' | 'outlined';
export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgeStatus = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  /**
   * Contenu textuel du badge
   */
  label?: string;
  
  /**
   * Variante visuelle du badge
   * @default 'filled'
   */
  variant?: BadgeVariant;
  
  /**
   * Taille du badge
   * @default 'medium'
   */
  size?: BadgeSize;
  
  /**
   * Statut du badge, affecte sa couleur
   * @default 'default'
   */
  status?: BadgeStatus;
  
  /**
   * Nom de l'icône à afficher dans le badge (utilise expo/vector-icons/Ionicons)
   */
  icon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Indique si le badge est affiché comme un point sans contenu
   * @default false
   */
  dot?: boolean;
  
  /**
   * Couleur personnalisée du badge (remplace le statut)
   */
  color?: string;
  
  /**
   * Style personnalisé pour le conteneur du badge
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le texte du badge
   */
  textStyle?: TextStyle;
}

/**
 * Composant Badge
 * 
 * Un badge pour afficher des statuts, notifications ou étiquettes
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'filled',
  size = 'medium',
  status = 'default',
  icon,
  dot = false,
  color,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  
  // Obtenir la couleur en fonction du statut
  const getStatusColor = (): string => {
    if (color) return color;
    
    const statusColors: Record<BadgeStatus, string> = {
      default: theme.colors.primary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.info,
    };
    
    return statusColors[status];
  };
  
  // Styles de base pour le badge
  const getBadgeStyle = (): ViewStyle => {
    const statusColor = getStatusColor();
    
    // Styles de base
    const baseStyle: ViewStyle = {
      borderRadius: 100, // Forme arrondie
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
    
    // Styles pour le point
    if (dot) {
      return {
        ...baseStyle,
        width: size === 'small' ? 8 : size === 'medium' ? 10 : 12,
        height: size === 'small' ? 8 : size === 'medium' ? 10 : 12,
        backgroundColor: statusColor,
      };
    }
    
    // Styles de taille
    const sizeStyles: Record<BadgeSize, ViewStyle> = {
      small: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        minWidth: 20,
        height: 20,
      },
      medium: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        minWidth: 24,
        height: 24,
      },
      large: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        minWidth: 28,
        height: 28,
      },
    };
    
    // Styles de variante
    const variantStyles: Record<BadgeVariant, ViewStyle> = {
      filled: {
        backgroundColor: statusColor,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: statusColor,
      },
    };
    
    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };
  
  // Styles pour le texte du badge
  const getTextStyle = (): TextStyle => {
    const statusColor = getStatusColor();
    
    const baseStyle: TextStyle = {
      textAlign: 'center',
      fontWeight: '500',
    };
    
    // Styles de taille
    const sizeStyles: Record<BadgeSize, TextStyle> = {
      small: {
        fontSize: 10,
      },
      medium: {
        fontSize: 12,
      },
      large: {
        fontSize: 14,
      },
    };
    
    // Styles de variante
    const variantStyles: Record<BadgeVariant, TextStyle> = {
      filled: {
        color: theme.colors.white,
      },
      outlined: {
        color: statusColor,
      },
    };
    
    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };
  
  // Taille de l'icône en fonction de la taille du badge
  const getIconSize = (): number => {
    return size === 'small' ? 10 : size === 'medium' ? 12 : 14;
  };
  
  // Si c'est juste un point, on retourne un simple View
  if (dot) {
    return <View style={[getBadgeStyle(), style]} />;
  }
  
  return (
    <View style={[getBadgeStyle(), style]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={variant === 'filled' ? theme.colors.white : getStatusColor()}
          style={label ? { marginRight: 4 } : undefined}
        />
      ) : null}
      
      {label ? (
        <Text style={[getTextStyle(), textStyle]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

export default Badge;
