import React, { useState, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

export interface AccordionProps {
  /**
   * Titre de l'accordéon
   */
  title: string;
  
  /**
   * Contenu de l'accordéon
   */
  children: React.ReactNode;
  
  /**
   * Icône à afficher à gauche du titre
   */
  leftIcon?: string;
  
  /**
   * Icône personnalisée pour l'indicateur d'expansion
   * @default 'chevron-down'
   */
  expandIcon?: string;
  
  /**
   * Indique si l'accordéon est initialement ouvert
   * @default false
   */
  defaultExpanded?: boolean;
  
  /**
   * Indique si l'accordéon est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Fonction appelée lorsque l'état d'expansion change
   */
  onExpandChange?: (expanded: boolean) => void;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour l'en-tête
   */
  headerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le titre
   */
  titleStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le contenu
   */
  contentStyle?: ViewStyle;
  
  /**
   * Variante de l'accordéon
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'filled';
}

/**
 * Composant Accordion
 * 
 * Un panneau déroulant pour afficher du contenu de manière compacte
 */
export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  leftIcon,
  expandIcon = 'chevron-down',
  defaultExpanded = false,
  disabled = false,
  onExpandChange,
  style,
  headerStyle,
  titleStyle,
  contentStyle,
  variant = 'default',
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const rotateAnimation = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  
  // Gérer l'expansion/réduction
  const toggleExpand = () => {
    if (disabled) return;
    
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: newExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue: newExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (onExpandChange) {
      onExpandChange(newExpanded);
    }
  };
  
  // Mesurer la hauteur du contenu
  const onContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };
  
  // Animation de rotation pour l'icône
  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  // Hauteur animée du contenu
  const height = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });
  
  // Styles en fonction de la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          container: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            overflow: 'hidden' as 'hidden',
          },
          header: {
            backgroundColor: 'transparent',
          },
        };
      case 'filled':
        return {
          container: {
            borderRadius: 8,
            overflow: 'hidden' as 'hidden',
          },
          header: {
            backgroundColor: theme.colors.surface,
          },
        };
      default:
        return {
          container: {},
          header: {
            borderBottomWidth: expanded ? 0 : 1,
            borderBottomColor: theme.colors.border,
          },
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  return (
    <View
      style={[
        styles.container,
        variantStyles.container,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        disabled={disabled}
        style={[
          styles.header,
          variantStyles.header,
          headerStyle,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={theme.colors.text}
            style={styles.leftIcon}
          />
        )}
        
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
        
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name={expandIcon as any}
            size={20}
            color={theme.colors.text}
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View style={{ height, overflow: 'hidden' }}>
        <View
          style={[styles.content, contentStyle]}
          onLayout={onContentLayout}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftIcon: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
});

export default Accordion;
