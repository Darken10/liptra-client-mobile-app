import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface SegmentOption {
  /**
   * Valeur de l'option
   */
  value: string;
  
  /**
   * Label de l'option
   */
  label: string;
  
  /**
   * Indique si l'option est désactivée
   */
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /**
   * Liste des options
   */
  options: SegmentOption[];
  
  /**
   * Valeur sélectionnée
   */
  value: string;
  
  /**
   * Fonction appelée lorsque la valeur change
   */
  onChange: (value: string) => void;
  
  /**
   * Taille du contrôle
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Couleur active
   */
  activeColor?: string;
  
  /**
   * Couleur du texte actif
   */
  activeTextColor?: string;
  
  /**
   * Couleur inactive
   */
  inactiveColor?: string;
  
  /**
   * Couleur du texte inactif
   */
  inactiveTextColor?: string;
  
  /**
   * Indique si le contrôle est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour les options
   */
  optionStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
}

/**
 * Composant SegmentedControl
 * 
 * Un contrôle segmenté pour sélectionner une option parmi plusieurs
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'medium',
  activeColor,
  activeTextColor,
  inactiveColor,
  inactiveTextColor,
  disabled = false,
  style,
  optionStyle,
  labelStyle,
}) => {
  const theme = useTheme();
  const [segmentWidths, setSegmentWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const selectedIndex = options.findIndex((option) => option.value === value);
  
  // Couleurs
  const effectiveActiveColor = activeColor || theme.colors.primary;
  const effectiveActiveTextColor = activeTextColor || theme.colors.white;
  const effectiveInactiveColor = inactiveColor || theme.colors.surface;
  const effectiveInactiveTextColor = inactiveTextColor || theme.colors.text;
  
  // Tailles en fonction de la taille spécifiée
  const getSizes = () => {
    const sizeMap = {
      small: {
        height: 28,
        fontSize: 12,
        paddingHorizontal: 8,
      },
      medium: {
        height: 36,
        fontSize: 14,
        paddingHorizontal: 12,
      },
      large: {
        height: 44,
        fontSize: 16,
        paddingHorizontal: 16,
      },
    };
    
    return sizeMap[size];
  };
  
  const sizes = getSizes();
  
  // Mettre à jour la position du sélecteur lorsque la valeur change
  useEffect(() => {
    if (selectedIndex !== -1 && segmentWidths.length > selectedIndex) {
      const position = segmentWidths
        .slice(0, selectedIndex)
        .reduce((acc, width) => acc + width, 0);
      
      Animated.timing(translateX, {
        toValue: position,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedIndex, segmentWidths, translateX]);
  
  // Gérer le changement de dimension du conteneur
  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  
  // Gérer le changement de dimension d'une option
  const onOptionLayout = (index: number, event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    
    setSegmentWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
  };
  
  // Largeur du sélecteur
  const selectedWidth = selectedIndex !== -1 ? segmentWidths[selectedIndex] || 0 : 0;
  
  return (
    <View
      style={[
        styles.container,
        {
          height: sizes.height,
          backgroundColor: effectiveInactiveColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onLayout={onContainerLayout}
    >
      {/* Sélecteur animé */}
      {selectedWidth > 0 && (
        <Animated.View
          style={[
            styles.selector,
            {
              width: selectedWidth,
              height: sizes.height - 4,
              backgroundColor: effectiveActiveColor,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
      
      {/* Options */}
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          activeOpacity={0.7}
          onPress={() => !disabled && !option.disabled && onChange(option.value)}
          onLayout={(e) => onOptionLayout(index, e)}
          style={[
            styles.option,
            {
              paddingHorizontal: sizes.paddingHorizontal,
              opacity: option.disabled ? 0.5 : 1,
            },
            optionStyle,
          ]}
          disabled={disabled || option.disabled}
        >
          <Text
            style={[
              styles.label,
              {
                fontSize: sizes.fontSize,
                color: option.value === value
                  ? effectiveActiveTextColor
                  : effectiveInactiveTextColor,
              },
              labelStyle,
            ]}
            numberOfLines={1}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 2,
    position: 'relative',
  },
  selector: {
    position: 'absolute',
    left: 2,
    top: 2,
    borderRadius: 6,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontWeight: '500',
  },
});

export default SegmentedControl;
