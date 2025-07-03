import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps {
  /**
   * Orientation du séparateur
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  
  /**
   * Variante visuelle du séparateur
   * @default 'solid'
   */
  variant?: DividerVariant;
  
  /**
   * Texte à afficher au milieu du séparateur
   */
  label?: string;
  
  /**
   * Épaisseur du séparateur
   * @default 1
   */
  thickness?: number;
  
  /**
   * Couleur du séparateur
   */
  color?: string;
  
  /**
   * Style personnalisé pour le conteneur du séparateur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le texte du séparateur
   */
  labelStyle?: TextStyle;
  
  /**
   * Espacement autour du séparateur
   * @default { vertical: 8, horizontal: 0 }
   */
  spacing?: {
    vertical?: number;
    horizontal?: number;
  };
}

/**
 * Composant Divider
 * 
 * Un séparateur visuel pour diviser le contenu
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  thickness = 1,
  color,
  style,
  labelStyle,
  spacing = { vertical: 8, horizontal: 0 },
}) => {
  const theme = useTheme();
  
  // Couleur par défaut du séparateur
  const dividerColor = color || theme.colors.border;
  
  // Style de bordure en fonction de la variante
  const getBorderStyle = () => {
    switch (variant) {
      case 'dashed':
        return 'dashed';
      case 'dotted':
        return 'dotted';
      case 'solid':
      default:
        return 'solid';
    }
  };
  
  // Style de base pour le séparateur
  const dividerStyle: ViewStyle = {
    backgroundColor: variant === 'solid' ? dividerColor : 'transparent',
    borderStyle: getBorderStyle(),
    ...(variant !== 'solid' && {
      borderColor: dividerColor,
      ...(orientation === 'horizontal'
        ? { borderBottomWidth: thickness }
        : { borderLeftWidth: thickness }),
    }),
    ...(orientation === 'horizontal'
      ? {
          height: variant === 'solid' ? thickness : 0,
          marginVertical: spacing.vertical,
          marginHorizontal: spacing.horizontal,
        }
      : {
          width: variant === 'solid' ? thickness : 0,
          marginHorizontal: spacing.vertical,
          marginVertical: spacing.horizontal,
          alignSelf: 'stretch',
        }),
  };
  
  // Si pas de label, on retourne simplement le séparateur
  if (!label || orientation === 'vertical') {
    return <View style={[dividerStyle, style]} />;
  }
  
  // Avec label, on retourne un séparateur avec texte au milieu
  return (
    <View style={[styles.container, style]}>
      <View style={[dividerStyle, styles.leftDivider]} />
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
            marginHorizontal: theme.spacing.sm,
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      <View style={[dividerStyle, styles.rightDivider]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  leftDivider: {
    flex: 1,
  },
  rightDivider: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Divider;
