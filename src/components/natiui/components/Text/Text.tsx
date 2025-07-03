import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'subtitle1' 
  | 'subtitle2' 
  | 'body1' 
  | 'body2' 
  | 'button' 
  | 'caption' 
  | 'overline';

export interface TextProps extends RNTextProps {
  /**
   * Variante de typographie
   * @default 'body1'
   */
  variant?: TextVariant;
  
  /**
   * Contenu textuel
   */
  children: React.ReactNode;
  
  /**
   * Couleur du texte
   */
  color?: string;
  
  /**
   * Alignement du texte
   */
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  
  /**
   * Poids de la police
   */
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  
  /**
   * Style du texte
   */
  italic?: boolean;
  
  /**
   * Décoration du texte
   */
  decoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  
  /**
   * Transformation du texte
   */
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  
  /**
   * Nombre maximum de lignes
   */
  numberOfLines?: number;
}

/**
 * Composant Text
 * 
 * Un composant de texte qui respecte le système de typographie
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  children,
  color,
  align,
  weight,
  italic,
  decoration,
  transform,
  style,
  numberOfLines,
  ...rest
}) => {
  const theme = useTheme();
  
  // Obtenir le style de base pour la variante
  const getVariantStyle = (): TextStyle => {
    return theme.typography[variant] || theme.typography.body1;
  };
  
  // Construire le style final
  const textStyle: TextStyle = {
    ...getVariantStyle(),
    ...(color && { color }),
    ...(align && { textAlign: align }),
    ...(weight && { fontWeight: weight }),
    ...(italic && { fontStyle: 'italic' }),
    ...(decoration && { textDecorationLine: decoration }),
    ...(transform && { textTransform: transform }),
  };
  
  return (
    <RNText
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default Text;
