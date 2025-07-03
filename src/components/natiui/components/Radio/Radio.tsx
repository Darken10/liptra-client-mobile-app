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

export interface RadioProps {
  /**
   * Indique si le bouton radio est sélectionné
   */
  selected: boolean;
  
  /**
   * Fonction appelée lorsque l'état change
   */
  onValueChange?: (selected: boolean) => void;
  
  /**
   * Label à afficher à côté du bouton radio
   */
  label?: string;
  
  /**
   * Position du label
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Indique si le bouton radio est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Taille du bouton radio
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Couleur du bouton radio lorsqu'il est sélectionné
   */
  activeColor?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le bouton radio
   */
  radioStyle?: ViewStyle;
}

/**
 * Composant Radio
 * 
 * Un bouton radio stylisé avec label optionnel
 */
export const Radio: React.FC<RadioProps> = ({
  selected,
  onValueChange,
  label,
  labelPosition = 'right',
  disabled = false,
  size = 'medium',
  activeColor,
  style,
  labelStyle,
  radioStyle,
}) => {
  const theme = useTheme();
  
  // Taille du bouton radio en fonction de la taille spécifiée
  const getRadioSize = (): number => {
    const sizeMap = {
      small: 16,
      medium: 20,
      large: 24,
    };
    
    return sizeMap[size];
  };
  
  // Taille du point intérieur en fonction de la taille du bouton radio
  const getDotSize = (): number => {
    const sizeMap = {
      small: 8,
      medium: 10,
      large: 12,
    };
    
    return sizeMap[size];
  };
  
  // Couleur active
  const effectiveActiveColor = activeColor || theme.colors.primary;
  
  // Tailles
  const radioSize = getRadioSize();
  const dotSize = getDotSize();
  
  // Style du bouton radio
  const circleStyle: ViewStyle = {
    width: radioSize,
    height: radioSize,
    borderRadius: radioSize / 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: selected ? effectiveActiveColor : theme.colors.border,
  };
  
  // Style du point intérieur
  const dotStyle: ViewStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: effectiveActiveColor,
  };
  
  // Gérer le changement d'état
  const handleToggle = () => {
    if (!disabled && onValueChange && !selected) {
      onValueChange(true);
    }
  };
  
  // Rendu du bouton radio
  const renderRadio = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleToggle}
      disabled={disabled}
      style={[
        circleStyle,
        { opacity: disabled ? 0.5 : 1 },
        radioStyle,
      ]}
    >
      {selected && <View style={dotStyle} />}
    </TouchableOpacity>
  );
  
  // Si pas de label, retourner simplement le bouton radio
  if (!label) {
    return renderRadio();
  }
  
  // Avec label, retourner le bouton radio et le label dans la bonne position
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
      {renderRadio()}
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

export default Radio;
