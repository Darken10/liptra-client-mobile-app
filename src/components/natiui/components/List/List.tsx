import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface ListItemProps {
  /**
   * Titre principal de l'élément
   */
  title: string;
  
  /**
   * Description ou sous-titre de l'élément
   */
  subtitle?: string;
  
  /**
   * Nom de l'icône à afficher à gauche (utilise expo/vector-icons/Ionicons)
   */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Nom de l'icône à afficher à droite (utilise expo/vector-icons/Ionicons)
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Contenu personnalisé à afficher à gauche
   */
  leftContent?: React.ReactNode;
  
  /**
   * Contenu personnalisé à afficher à droite
   */
  rightContent?: React.ReactNode;
  
  /**
   * Fonction appelée lors du clic sur l'élément
   */
  onPress?: () => void;
  
  /**
   * Indique si l'élément est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Style personnalisé pour le conteneur de l'élément
   */
  style?: ViewStyle;
  
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
 * Composant ListItem
 * 
 * Un élément de liste avec titre, sous-titre et icônes
 */
export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  leftContent,
  rightContent,
  onPress,
  disabled = false,
  style,
  titleStyle,
  subtitleStyle,
  iconSize = 20,
  iconColor,
}) => {
  const theme = useTheme();
  
  // Rendu du contenu de gauche
  const renderLeftContent = () => {
    if (leftContent) return leftContent;
    
    if (leftIcon) {
      return (
        <View style={styles.iconContainer}>
          <Ionicons
            name={leftIcon}
            size={iconSize}
            color={iconColor || theme.colors.primary}
          />
        </View>
      );
    }
    
    return null;
  };
  
  // Rendu du contenu de droite
  const renderRightContent = () => {
    if (rightContent) return rightContent;
    
    if (rightIcon) {
      return (
        <View style={styles.iconContainer}>
          <Ionicons
            name={rightIcon}
            size={iconSize}
            color={iconColor || theme.colors.textSecondary}
          />
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      {/* Contenu de gauche */}
      {renderLeftContent()}
      
      {/* Contenu central (titre et sous-titre) */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.textSecondary },
              subtitleStyle,
            ]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Contenu de droite */}
      {renderRightContent()}
    </TouchableOpacity>
  );
};

export interface ListProps {
  /**
   * Éléments de la liste
   */
  children: React.ReactNode;
  
  /**
   * Titre de la section
   */
  title?: string;
  
  /**
   * Indique si la liste doit avoir des séparateurs entre les éléments
   * @default true
   */
  showDividers?: boolean;
  
  /**
   * Indique si la liste doit avoir une bordure
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Style personnalisé pour le conteneur de la liste
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le titre de la section
   */
  titleStyle?: TextStyle;
}

/**
 * Composant List
 * 
 * Une liste d'éléments avec titre de section optionnel
 */
export const List: React.FC<ListProps> = ({
  children,
  title,
  showDividers = true,
  bordered = false,
  style,
  titleStyle,
}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.listContainer, style]}>
      {/* Titre de la section */}
      {title && (
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.textSecondary },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
      
      {/* Conteneur de la liste */}
      <View
        style={[
          styles.list,
          {
            backgroundColor: theme.colors.surface,
            ...(bordered && {
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.spacing.xs,
              overflow: 'hidden',
            }),
          },
        ]}
      >
        {/* Éléments de la liste avec séparateurs */}
        {React.Children.map(children, (child, index) => {
          const isLast = index === React.Children.count(children) - 1;
          
          return (
            <>
              {child}
              {showDividers && !isLast && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.borderLight },
                  ]}
                />
              )}
            </>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
  },
  list: {
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default {
  List,
  ListItem,
};
