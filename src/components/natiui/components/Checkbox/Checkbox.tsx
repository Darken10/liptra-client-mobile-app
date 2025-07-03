import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface CheckboxProps {
  /**
   * Indique si la case est cochée
   */
  checked: boolean;
  
  /**
   * Fonction appelée lorsque l'état change
   */
  onValueChange?: (checked: boolean) => void;
  
  /**
   * Label à afficher à côté de la case à cocher
   */
  label?: string;
  
  /**
   * Position du label
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Indique si la case à cocher est désactivée
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Taille de la case à cocher
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Couleur de la case à cocher lorsqu'elle est cochée
   */
  activeColor?: string;
  
  /**
   * Couleur de l'icône de coche
   */
  checkColor?: string;
  
  /**
   * Forme de la case à cocher
   * @default 'square'
   */
  shape?: 'square' | 'circle';
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
  
  /**
   * Style personnalisé pour la case à cocher
   */
  checkboxStyle?: ViewStyle;
}

/**
 * Composant Checkbox
 * 
 * Une case à cocher stylisée avec label optionnel
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onValueChange,
  label,
  labelPosition = 'right',
  disabled = false,
  size = 'medium',
  activeColor,
  checkColor,
  shape = 'square',
  style,
  labelStyle,
  checkboxStyle,
}) => {
  const theme = useTheme();
  
  // Taille de la case à cocher en fonction de la taille spécifiée
  const getCheckboxSize = (): number => {
    const sizeMap = {
      small: 16,
      medium: 20,
      large: 24,
    };
    
    return sizeMap[size];
  };
  
  // Taille de l'icône en fonction de la taille de la case à cocher
  const getIconSize = (): number => {
    const sizeMap = {
      small: 12,
      medium: 16,
      large: 20,
    };
    
    return sizeMap[size];
  };
  
  // Couleurs
  const effectiveActiveColor = activeColor || theme.colors.primary;
  const effectiveCheckColor = checkColor || theme.colors.white;
  
  // Style de la case à cocher
  const checkboxSize = getCheckboxSize();
  const boxStyle: ViewStyle = {
    width: checkboxSize,
    height: checkboxSize,
    borderRadius: shape === 'circle' ? checkboxSize / 2 : 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: checked ? effectiveActiveColor : 'transparent',
    borderColor: checked ? effectiveActiveColor : theme.colors.border,
  };
  
  // Gérer le changement d'état
  const handleToggle = () => {
    if (!disabled && onValueChange) {
      onValueChange(!checked);
    }
  };
  
  // Rendu de la case à cocher
  const renderCheckbox = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleToggle}
      disabled={disabled}
      style={[
        boxStyle,
        { opacity: disabled ? 0.5 : 1 },
        checkboxStyle,
      ]}
    >
      {checked && (
        <Ionicons
          name={shape === 'circle' ? 'checkmark-circle' : 'checkmark'}
          size={getIconSize()}
          color={effectiveCheckColor}
        />
      )}
    </TouchableOpacity>
  );
  
  // Si pas de label, retourner simplement la case à cocher
  if (!label) {
    return renderCheckbox();
  }
  
  // Avec label, retourner la case à cocher et le label dans la bonne position
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleToggle}
      disabled={disabled}
      style={[
        styles.container,
        { flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row' },
        style,
      ]}
    >
      {renderCheckbox()}
      <Text
        style={[
          styles.label,
          {
            color: disabled ? theme.colors.textDisabled : theme.colors.text,
            marginLeft: labelPosition === 'right' ? 8 : 0,
            marginRight: labelPosition === 'left' ? 8 : 0,
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
});

export default Checkbox;
