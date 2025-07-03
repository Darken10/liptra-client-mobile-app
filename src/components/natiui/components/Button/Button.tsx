import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type ButtonVariant = 'filled' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Contenu textuel du bouton
   */
  children: string | React.ReactNode;
  
  /**
   * Variante visuelle du bouton
   * @default 'filled'
   */
  variant?: ButtonVariant;
  
  /**
   * Taille du bouton
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * Indique si le bouton est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Indique si le bouton affiche un indicateur de chargement
   * @default false
   */
  loading?: boolean;
  
  /**
   * Nom de l'icône à afficher avant le texte (utilise expo/vector-icons/Ionicons)
   */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Nom de l'icône à afficher après le texte (utilise expo/vector-icons/Ionicons)
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Style personnalisé pour le conteneur du bouton
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le texte du bouton
   */
  textStyle?: TextStyle;
  
  /**
   * Taille des icônes
   * @default Dépend de la taille du bouton
   */
  iconSize?: number;
  
  /**
   * Couleur des icônes
   * @default Dépend de la variante du bouton
   */
  iconColor?: string;
}

/**
 * Composant Button
 * 
 * Un bouton interactif avec plusieurs variantes et tailles
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  iconSize,
  iconColor,
  ...rest
}) => {
  const theme = useTheme();
  
  // Déterminer les styles en fonction de la variante et de la taille
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
    
    // Styles de taille
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        minHeight: 32,
      },
      medium: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        minHeight: 40,
      },
      large: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 48,
      },
    };
    
    // Styles de variante
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      filled: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      text: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingHorizontal: theme.spacing.sm,
      },
    };
    
    // Style désactivé
    const disabledStyle: ViewStyle = {
      opacity: 0.6,
    };
    
    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled ? disabledStyle : {}),
    };
  };
  
  // Déterminer le style du texte
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.button,
      textAlign: 'center',
    };
    
    // Styles de taille
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      small: {
        fontSize: theme.typography.fontSize.sm,
      },
      medium: {
        fontSize: theme.typography.fontSize.md,
      },
      large: {
        fontSize: theme.typography.fontSize.lg,
      },
    };
    
    // Styles de variante
    const variantStyles: Record<ButtonVariant, TextStyle> = {
      filled: {
        color: theme.colors.white,
      },
      outlined: {
        color: theme.colors.primary,
      },
      text: {
        color: theme.colors.primary,
      },
    };
    
    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };
  
  // Déterminer la taille de l'icône
  const getIconSize = (): number => {
    if (iconSize) return iconSize;
    
    const sizeMap: Record<ButtonSize, number> = {
      small: 16,
      medium: 18,
      large: 20,
    };
    
    return sizeMap[size];
  };
  
  // Déterminer la couleur de l'icône
  const getIconColor = (): string => {
    if (iconColor) return iconColor;
    
    const variantMap: Record<ButtonVariant, string> = {
      filled: theme.colors.white,
      outlined: theme.colors.primary,
      text: theme.colors.primary,
    };
    
    return variantMap[variant];
  };
  
  const iconSizeValue = getIconSize();
  const iconColorValue = getIconColor();
  
  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'filled' ? theme.colors.white : theme.colors.primary}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={iconSizeValue}
              color={iconColorValue}
              style={styles.leftIcon}
            />
          )}
          
          <Text style={[getTextStyle(), textStyle]}>
            {children}
          </Text>
          
          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={iconSizeValue}
              color={iconColorValue}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;
