import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  /**
   * Label affiché au-dessus du champ
   */
  label?: string;
  
  /**
   * Message d'erreur à afficher sous le champ
   */
  error?: string;
  
  /**
   * Message d'aide à afficher sous le champ
   */
  helperText?: string;
  
  /**
   * Indique si le champ est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Nom de l'icône à afficher à gauche du champ (utilise expo/vector-icons/Ionicons)
   */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Nom de l'icône à afficher à droite du champ (utilise expo/vector-icons/Ionicons)
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Fonction appelée lorsqu'on clique sur l'icône de droite
   */
  onRightIconPress?: () => void;
  
  /**
   * Style personnalisé pour le conteneur du champ
   */
  containerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le champ de saisie
   */
  inputStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le message d'aide ou d'erreur
   */
  helperTextStyle?: TextStyle;
  
  /**
   * Taille des icônes
   * @default 20
   */
  iconSize?: number;
  
  /**
   * Couleur des icônes
   */
  iconColor?: string;
}

/**
 * Composant Input
 * 
 * Un champ de saisie avec support pour label, icônes et messages d'erreur
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  helperTextStyle,
  iconSize = 20,
  iconColor,
  secureTextEntry,
  ...rest
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  
  // Gestion de l'affichage/masquage du mot de passe
  const isPassword = secureTextEntry !== undefined;
  const effectiveSecureTextEntry = isPassword ? !isPasswordVisible : false;
  
  // Couleur de l'icône
  const effectiveIconColor = iconColor || (error
    ? theme.colors.error
    : isFocused
      ? theme.colors.primary
      : theme.colors.textSecondary);
  
  // Gestion des bordures et couleurs en fonction de l'état
  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };
  
  // Rendu du message d'aide ou d'erreur
  const renderHelperText = () => {
    const message = error || helperText;
    if (!message) return null;
    
    return (
      <Text
        style={[
          styles.helperText,
          { color: error ? theme.colors.error : theme.colors.textSecondary },
          helperTextStyle,
        ]}
      >
        {message}
      </Text>
    );
  };
  
  // Rendu de l'icône de visibilité du mot de passe
  const renderPasswordIcon = () => {
    if (!isPassword) return null;
    
    return (
      <TouchableOpacity
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        style={styles.iconContainer}
      >
        <Ionicons
          name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
          size={iconSize}
          color={effectiveIconColor}
        />
      </TouchableOpacity>
    );
  };
  
  // Rendu de l'icône de droite (si ce n'est pas un champ de mot de passe)
  const renderRightIcon = () => {
    if (isPassword || !rightIcon) return null;
    
    return (
      <TouchableOpacity
        onPress={onRightIconPress}
        style={styles.iconContainer}
        disabled={!onRightIconPress}
      >
        <Ionicons
          name={rightIcon}
          size={iconSize}
          color={effectiveIconColor}
        />
      </TouchableOpacity>
    );
  };
  
  // Rendu de l'icône de gauche
  const renderLeftIcon = () => {
    if (!leftIcon) return null;
    
    return (
      <View style={styles.iconContainer}>
        <Ionicons
          name={leftIcon}
          size={iconSize}
          color={effectiveIconColor}
        />
      </View>
    );
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.colors.textSecondary },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      
      {/* Champ de saisie avec icônes */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? theme.colors.disabledBackground : theme.colors.background,
          },
        ]}
      >
        {renderLeftIcon()}
        
        <TextInput
          style={[
            styles.input,
            { color: disabled ? theme.colors.textDisabled : theme.colors.text },
            leftIcon && { paddingLeft: 0 },
            (rightIcon || isPassword) && { paddingRight: 0 },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textDisabled}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={effectiveSecureTextEntry}
          {...rest}
        />
        
        {renderPasswordIcon() || renderRightIcon()}
      </View>
      
      {/* Message d'aide ou d'erreur */}
      {renderHelperText()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  iconContainer: {
    padding: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Input;
