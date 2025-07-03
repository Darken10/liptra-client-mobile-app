import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface FormFieldProps {
  /**
   * Label du champ
   */
  label?: string;
  
  /**
   * Message d'aide
   */
  helperText?: string;
  
  /**
   * Message d'erreur
   */
  errorText?: string;
  
  /**
   * Indique si le champ est requis
   * @default false
   */
  required?: boolean;
  
  /**
   * Indique si le champ est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Indique si le champ est en lecture seule
   * @default false
   */
  readonly?: boolean;
  
  /**
   * Contenu du champ (généralement un Input)
   */
  children: React.ReactNode;
  
  /**
   * Texte d'information supplémentaire
   */
  infoText?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le texte d'aide
   */
  helperTextStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le texte d'erreur
   */
  errorTextStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le conteneur du champ
   */
  fieldContainerStyle?: ViewStyle;
}

/**
 * Composant FormField
 * 
 * Un conteneur pour les champs de formulaire avec label, message d'aide et erreur
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  errorText,
  required = false,
  disabled = false,
  readonly = false,
  children,
  infoText,
  style,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  fieldContainerStyle,
}) => {
  const theme = useTheme();
  const [showInfo, setShowInfo] = useState(false);
  
  // Gérer l'affichage de l'info
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  return (
    <View
      style={[
        styles.container,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              { color: theme.colors.text },
              labelStyle,
            ]}
          >
            {label}
            {required && <Text style={{ color: theme.colors.error }}> *</Text>}
          </Text>
          
          {/* Bouton d'info */}
          {infoText && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleInfo}
              style={styles.infoButton}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Texte d'info */}
      {showInfo && infoText && (
        <Text
          style={[
            styles.infoText,
            { color: theme.colors.textSecondary },
          ]}
        >
          {infoText}
        </Text>
      )}
      
      {/* Champ */}
      <View style={[styles.fieldContainer, fieldContainerStyle]}>
        {children}
      </View>
      
      {/* Message d'erreur ou d'aide */}
      {errorText ? (
        <Text
          style={[
            styles.helperText,
            { color: theme.colors.error },
            errorTextStyle,
          ]}
        >
          {errorText}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.helperText,
            { color: theme.colors.textSecondary },
            helperTextStyle,
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoButton: {
    marginLeft: 4,
    padding: 2,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 8,
  },
  fieldContainer: {
    width: '100%',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormField;
