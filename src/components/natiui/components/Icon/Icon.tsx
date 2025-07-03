import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';

export type IconSet = 'ionicons' | 'material' | 'fontawesome' | 'material-community' | 'feather';

export interface IconProps {
  /**
   * Nom de l'icône
   */
  name: string;
  
  /**
   * Ensemble d'icônes à utiliser
   * @default 'ionicons'
   */
  set?: IconSet;
  
  /**
   * Taille de l'icône
   * @default 24
   */
  size?: number;
  
  /**
   * Couleur de l'icône
   */
  color?: string;
  
  /**
   * Style personnalisé pour le conteneur de l'icône
   */
  style?: ViewStyle;
}

/**
 * Composant Icon
 * 
 * Un wrapper pour les icônes de @expo/vector-icons
 */
export const Icon: React.FC<IconProps> = ({
  name,
  set = 'ionicons',
  size = 24,
  color,
  style,
}) => {
  const theme = useTheme();
  
  // Couleur par défaut
  const iconColor = color || theme.colors.text;
  
  // Rendu de l'icône en fonction de l'ensemble choisi
  switch (set) {
    case 'material':
      return (
        <MaterialIcons
          name={name as keyof typeof MaterialIcons.glyphMap}
          size={size}
          color={iconColor}
          style={style}
        />
      );
      
    case 'fontawesome':
      return (
        <FontAwesome
          name={name as keyof typeof FontAwesome.glyphMap}
          size={size}
          color={iconColor}
          style={style}
        />
      );
      
    case 'material-community':
      return (
        <MaterialCommunityIcons
          name={name as keyof typeof MaterialCommunityIcons.glyphMap}
          size={size}
          color={iconColor}
          style={style}
        />
      );
      
    case 'feather':
      return (
        <Feather
          name={name as keyof typeof Feather.glyphMap}
          size={size}
          color={iconColor}
          style={style}
        />
      );
      
    case 'ionicons':
    default:
      return (
        <Ionicons
          name={name as keyof typeof Ionicons.glyphMap}
          size={size}
          color={iconColor}
          style={style}
        />
      );
  }
};

export default Icon;
