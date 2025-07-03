import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  /**
   * Source de l'image
   */
  source?: ImageSourcePropType;
  
  /**
   * Texte à afficher lorsqu'il n'y a pas d'image (initiales)
   */
  label?: string;
  
  /**
   * Nom de l'icône à afficher lorsqu'il n'y a pas d'image (utilise expo/vector-icons/Ionicons)
   */
  icon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Taille de l'avatar
   * @default 'md'
   */
  size?: AvatarSize;
  
  /**
   * Forme de l'avatar
   * @default 'circle'
   */
  shape?: AvatarShape;
  
  /**
   * Couleur de fond de l'avatar (utilisée lorsqu'il n'y a pas d'image)
   */
  backgroundColor?: string;
  
  /**
   * Couleur du texte ou de l'icône
   */
  color?: string;
  
  /**
   * Style personnalisé pour le conteneur de l'avatar
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour l'image
   */
  imageStyle?: ImageStyle;
  
  /**
   * Style personnalisé pour le texte
   */
  textStyle?: TextStyle;
  
  /**
   * Indique si un badge de statut doit être affiché
   */
  showStatus?: boolean;
  
  /**
   * Couleur du badge de statut
   * @default 'success'
   */
  statusColor?: string;
}

/**
 * Composant Avatar
 * 
 * Un avatar pour afficher une image de profil, des initiales ou une icône
 */
export const Avatar: React.FC<AvatarProps> = ({
  source,
  label,
  icon,
  size = 'md',
  shape = 'circle',
  backgroundColor,
  color,
  style,
  imageStyle,
  textStyle,
  showStatus = false,
  statusColor,
}) => {
  const theme = useTheme();
  
  // Taille de l'avatar en fonction de la taille spécifiée
  const getSize = (): number => {
    const sizeMap: Record<AvatarSize, number> = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 56,
      xl: 72,
    };
    
    return sizeMap[size];
  };
  
  // Taille du texte en fonction de la taille de l'avatar
  const getTextSize = (): number => {
    const sizeMap: Record<AvatarSize, number> = {
      xs: 10,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    };
    
    return sizeMap[size];
  };
  
  // Taille de l'icône en fonction de la taille de l'avatar
  const getIconSize = (): number => {
    const sizeMap: Record<AvatarSize, number> = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 28,
      xl: 36,
    };
    
    return sizeMap[size];
  };
  
  // Taille du badge de statut en fonction de la taille de l'avatar
  const getStatusSize = (): number => {
    const sizeMap: Record<AvatarSize, number> = {
      xs: 6,
      sm: 8,
      md: 10,
      lg: 12,
      xl: 14,
    };
    
    return sizeMap[size];
  };
  
  // Style de base pour l'avatar
  const avatarSize = getSize();
  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: shape === 'circle' ? avatarSize / 2 : theme.spacing.xs,
    backgroundColor: backgroundColor || theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };
  
  // Rendu du contenu de l'avatar
  const renderContent = () => {
    // Si une image est fournie, on l'affiche
    if (source) {
      return (
        <Image
          source={source}
          style={[
            {
              width: avatarSize,
              height: avatarSize,
            },
            imageStyle,
          ]}
          resizeMode="cover"
        />
      );
    }
    
    // Si un label est fourni, on affiche les initiales
    if (label) {
      // Extraire les initiales (première lettre de chaque mot)
      const initials = label
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      
      return (
        <Text
          style={[
            {
              color: color || theme.colors.white,
              fontSize: getTextSize(),
              fontWeight: '600',
            },
            textStyle,
          ]}
        >
          {initials}
        </Text>
      );
    }
    
    // Si une icône est fournie, on l'affiche
    if (icon) {
      return (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={color || theme.colors.white}
        />
      );
    }
    
    // Par défaut, on affiche une icône d'utilisateur
    return (
      <Ionicons
        name="person"
        size={getIconSize()}
        color={color || theme.colors.white}
      />
    );
  };
  
  return (
    <View style={[avatarStyle, style]}>
      {renderContent()}
      
      {/* Badge de statut */}
      {showStatus && (
        <View
          style={[
            styles.statusBadge,
            {
              width: getStatusSize(),
              height: getStatusSize(),
              borderRadius: getStatusSize() / 2,
              backgroundColor: statusColor || theme.colors.success,
              borderWidth: size === 'xs' ? 1 : 2,
              borderColor: theme.colors.surface,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statusBadge: {
    position: 'absolute',
    bottom: '7%',
    right: '7%',
  },
});

export default Avatar;
