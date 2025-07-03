import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Contenu à afficher dans la carte
   */
  children: React.ReactNode;
  
  /**
   * Titre de la carte
   */
  title?: string;
  
  /**
   * Sous-titre de la carte
   */
  subtitle?: string;
  
  /**
   * Contenu à afficher dans l'en-tête de la carte (remplace title et subtitle)
   */
  headerContent?: React.ReactNode;
  
  /**
   * Contenu à afficher dans le pied de la carte
   */
  footerContent?: React.ReactNode;
  
  /**
   * Nom de l'icône à afficher à gauche du titre (utilise expo/vector-icons/Ionicons)
   */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Nom de l'icône à afficher à droite du titre (utilise expo/vector-icons/Ionicons)
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Fonction appelée lorsqu'on clique sur l'icône de droite
   */
  onRightIconPress?: () => void;
  
  /**
   * Indique si la carte est interactive (touchable)
   * @default false
   */
  touchable?: boolean;
  
  /**
   * Indique si la carte doit avoir une ombre
   * @default true
   */
  elevated?: boolean;
  
  /**
   * Indique si la carte doit avoir une bordure
   * @default false
   */
  outlined?: boolean;
  
  /**
   * Style personnalisé pour le conteneur de la carte
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le contenu de la carte
   */
  contentStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour l'en-tête de la carte
   */
  headerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le pied de la carte
   */
  footerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le titre
   */
  titleStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le sous-titre
   */
  subtitleStyle?: TextStyle;
  
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
 * Composant Card
 * 
 * Une carte pour afficher du contenu avec en-tête et pied optionnels
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerContent,
  footerContent,
  leftIcon,
  rightIcon,
  onRightIconPress,
  touchable = false,
  elevated = true,
  outlined = false,
  style,
  contentStyle,
  headerStyle,
  footerStyle,
  titleStyle,
  subtitleStyle,
  iconSize = 20,
  iconColor,
  ...rest
}) => {
  const theme = useTheme();
  
  // Styles de base pour la carte
  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    ...(elevated && styles.elevated),
    ...(outlined && {
      borderWidth: 1,
      borderColor: theme.colors.border,
    }),
  };
  
  // Rendu de l'en-tête par défaut (titre et sous-titre)
  const renderDefaultHeader = () => {
    if (!title && !subtitle && !leftIcon && !rightIcon) return null;
    
    return (
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerLeft}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={iconSize}
              color={iconColor || theme.colors.primary}
              style={styles.leftIcon}
            />
          )}
          
          <View>
            {title && (
              <Text
                style={[
                  styles.title,
                  { color: theme.colors.text },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            )}
            
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.textSecondary },
                  subtitleStyle,
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={iconSize}
              color={iconColor || theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // Contenu de la carte
  const cardContent = (
    <>
      {/* En-tête personnalisé ou par défaut */}
      {headerContent || renderDefaultHeader()}
      
      {/* Contenu principal */}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
      
      {/* Pied de carte */}
      {footerContent && (
        <View style={[styles.footer, footerStyle]}>
          {footerContent}
        </View>
      )}
    </>
  );
  
  // Rendu conditionnel selon si la carte est touchable ou non
  if (touchable) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        activeOpacity={0.7}
        {...rest}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={[cardStyle, style]}>
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
});

export default Card;
