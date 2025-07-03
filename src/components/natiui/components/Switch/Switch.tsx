import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { useTheme } from '../../theme';

export interface SwitchProps {
  /**
   * Indique si le switch est activé
   */
  value: boolean;
  
  /**
   * Fonction appelée lorsque la valeur change
   */
  onValueChange?: (value: boolean) => void;
  
  /**
   * Indique si le switch est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Taille du switch
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Couleur du switch lorsqu'il est activé
   */
  activeColor?: string;
  
  /**
   * Couleur du switch lorsqu'il est désactivé
   */
  inactiveColor?: string;
  
  /**
   * Couleur du cercle du switch
   */
  thumbColor?: string;
  
  /**
   * Label à afficher à côté du switch
   */
  label?: string;
  
  /**
   * Position du label
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Style personnalisé pour le conteneur du switch
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
}

/**
 * Composant Switch
 * 
 * Un interrupteur à bascule pour activer/désactiver une option
 */
export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  activeColor,
  inactiveColor,
  thumbColor,
  label,
  labelPosition = 'right',
  style,
  labelStyle,
}) => {
  const theme = useTheme();
  
  // Animation pour la position du cercle
  const thumbAnim = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  
  // Mettre à jour l'animation lorsque la valeur change
  React.useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, thumbAnim]);
  
  // Dimensions du switch en fonction de la taille
  const getSwitchDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: 36,
          height: 20,
          thumbSize: 16,
          thumbOffset: 2,
        };
      case 'large':
        return {
          width: 56,
          height: 32,
          thumbSize: 28,
          thumbOffset: 2,
        };
      case 'medium':
      default:
        return {
          width: 46,
          height: 26,
          thumbSize: 22,
          thumbOffset: 2,
        };
    }
  };
  
  const { width, height, thumbSize, thumbOffset } = getSwitchDimensions();
  
  // Couleurs
  const effectiveActiveColor = activeColor || theme.colors.primary;
  const effectiveInactiveColor = inactiveColor || theme.colors.disabled;
  const effectiveThumbColor = thumbColor || theme.colors.white;
  
  // Position interpolée du cercle
  const translateX = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbOffset, width - thumbSize - thumbOffset],
  });
  
  // Couleur de fond interpolée
  const backgroundColor = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [effectiveInactiveColor, effectiveActiveColor],
  });
  
  // Gérer le changement de valeur
  const handleToggle = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };
  
  // Rendu du switch
  const renderSwitch = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleToggle}
      disabled={disabled}
      style={[
        styles.switchContainer,
        {
          width,
          height,
          borderRadius: height / 2,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor,
            borderRadius: height / 2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: effectiveThumbColor,
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
  
  // Si pas de label, retourner simplement le switch
  if (!label) {
    return renderSwitch();
  }
  
  // Avec label, retourner le switch et le label dans la bonne position
  return (
    <View
      style={[
        styles.container,
        { flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row' },
      ]}
    >
      {renderSwitch()}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleToggle}
        disabled={disabled}
      >
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchContainer: {
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
  },
});

export default Switch;
