import React from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  ViewProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';

export interface BoxProps extends ViewProps {
  /**
   * Contenu du Box
   */
  children?: React.ReactNode;
  
  /**
   * Padding pour tous les côtés
   */
  p?: number;
  
  /**
   * Padding horizontal (gauche et droite)
   */
  px?: number;
  
  /**
   * Padding vertical (haut et bas)
   */
  py?: number;
  
  /**
   * Padding haut
   */
  pt?: number;
  
  /**
   * Padding droite
   */
  pr?: number;
  
  /**
   * Padding bas
   */
  pb?: number;
  
  /**
   * Padding gauche
   */
  pl?: number;
  
  /**
   * Margin pour tous les côtés
   */
  m?: number;
  
  /**
   * Margin horizontal (gauche et droite)
   */
  mx?: number;
  
  /**
   * Margin vertical (haut et bas)
   */
  my?: number;
  
  /**
   * Margin haut
   */
  mt?: number;
  
  /**
   * Margin droite
   */
  mr?: number;
  
  /**
   * Margin bas
   */
  mb?: number;
  
  /**
   * Margin gauche
   */
  ml?: number;
  
  /**
   * Largeur du Box
   */
  width?: number | string;
  
  /**
   * Hauteur du Box
   */
  height?: number | string;
  
  /**
   * Couleur de fond
   */
  bg?: string;
  
  /**
   * Rayon de bordure
   */
  borderRadius?: number;
  
  /**
   * Épaisseur de bordure
   */
  borderWidth?: number;
  
  /**
   * Couleur de bordure
   */
  borderColor?: string;
  
  /**
   * Alignement horizontal du contenu
   */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  
  /**
   * Alignement vertical du contenu
   */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  
  /**
   * Direction du contenu
   */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  
  /**
   * Valeur flex
   */
  flex?: number;
  
  /**
   * Ombre
   * @default 'none'
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Composant Box
 * 
 * Un conteneur flexible avec des styles personnalisables
 */
export const Box: React.FC<BoxProps> = ({
  children,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  width,
  height,
  bg,
  borderRadius,
  borderWidth,
  borderColor,
  justifyContent,
  alignItems,
  flexDirection,
  flex,
  shadow = 'none',
  style,
  ...rest
}) => {
  const theme = useTheme();
  
  // Construire les styles de padding
  const paddingStyles: ViewStyle = {};
  if (p !== undefined) paddingStyles.padding = p;
  if (px !== undefined) paddingStyles.paddingHorizontal = px;
  if (py !== undefined) paddingStyles.paddingVertical = py;
  if (pt !== undefined) paddingStyles.paddingTop = pt;
  if (pr !== undefined) paddingStyles.paddingRight = pr;
  if (pb !== undefined) paddingStyles.paddingBottom = pb;
  if (pl !== undefined) paddingStyles.paddingLeft = pl;
  
  // Construire les styles de margin
  const marginStyles: ViewStyle = {};
  if (m !== undefined) marginStyles.margin = m;
  if (mx !== undefined) marginStyles.marginHorizontal = mx;
  if (my !== undefined) marginStyles.marginVertical = my;
  if (mt !== undefined) marginStyles.marginTop = mt;
  if (mr !== undefined) marginStyles.marginRight = mr;
  if (mb !== undefined) marginStyles.marginBottom = mb;
  if (ml !== undefined) marginStyles.marginLeft = ml;
  
  // Construire les styles de dimension
  const dimensionStyles: ViewStyle = {};
  if (width !== undefined) dimensionStyles.width = width as any;
  if (height !== undefined) dimensionStyles.height = height as any;
  if (flex !== undefined) dimensionStyles.flex = flex;
  
  // Construire les styles de bordure
  const borderStyles: ViewStyle = {};
  if (borderRadius !== undefined) borderStyles.borderRadius = borderRadius;
  if (borderWidth !== undefined) borderStyles.borderWidth = borderWidth;
  if (borderColor !== undefined) borderStyles.borderColor = borderColor;
  
  // Construire les styles de layout
  const layoutStyles: ViewStyle = {};
  if (justifyContent !== undefined) layoutStyles.justifyContent = justifyContent;
  if (alignItems !== undefined) layoutStyles.alignItems = alignItems;
  if (flexDirection !== undefined) layoutStyles.flexDirection = flexDirection;
  
  // Construire les styles d'apparence
  const appearanceStyles: ViewStyle = {};
  if (bg !== undefined) appearanceStyles.backgroundColor = bg;
  
  // Styles d'ombre
  const getShadowStyle = () => {
    switch (shadow) {
      case 'sm':
        return styles.shadowSm;
      case 'md':
        return styles.shadowMd;
      case 'lg':
        return styles.shadowLg;
      default:
        return {};
    }
  };
  
  return (
    <View
      style={[
        paddingStyles,
        marginStyles,
        dimensionStyles,
        borderStyles,
        layoutStyles,
        appearanceStyles,
        getShadowStyle(),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default Box;
