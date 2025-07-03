import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface TabItem {
  /**
   * Clé unique de l'onglet
   */
  key: string;
  
  /**
   * Label de l'onglet
   */
  label: string;
  
  /**
   * Icône de l'onglet (optionnelle)
   */
  icon?: string;
  
  /**
   * Badge à afficher sur l'onglet (optionnel)
   */
  badge?: number | string;
  
  /**
   * Indique si l'onglet est désactivé
   */
  disabled?: boolean;
}

export interface TabsProps {
  /**
   * Liste des onglets
   */
  tabs: TabItem[];
  
  /**
   * Clé de l'onglet actif
   */
  activeKey: string;
  
  /**
   * Fonction appelée lorsqu'un onglet est sélectionné
   */
  onChange: (key: string) => void;
  
  /**
   * Position de l'indicateur
   * @default 'bottom'
   */
  indicatorPosition?: 'top' | 'bottom';
  
  /**
   * Variante des onglets
   * @default 'default'
   */
  variant?: 'default' | 'fullWidth' | 'scrollable';
  
  /**
   * Couleur de l'indicateur
   */
  indicatorColor?: string;
  
  /**
   * Couleur du texte actif
   */
  activeColor?: string;
  
  /**
   * Couleur du texte inactif
   */
  inactiveColor?: string;
  
  /**
   * Position de l'icône
   * @default 'left'
   */
  iconPosition?: 'left' | 'top';
  
  /**
   * Taille de l'icône
   * @default 20
   */
  iconSize?: number;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour les onglets
   */
  tabStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le label
   */
  labelStyle?: TextStyle;
  
  /**
   * Style personnalisé pour l'indicateur
   */
  indicatorStyle?: ViewStyle;
}

/**
 * Composant Tabs
 * 
 * Un composant d'onglets pour naviguer entre différentes sections
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeKey,
  onChange,
  indicatorPosition = 'bottom',
  variant = 'default',
  indicatorColor,
  activeColor,
  inactiveColor,
  iconPosition = 'left',
  iconSize = 20,
  style,
  tabStyle,
  labelStyle,
  indicatorStyle,
}) => {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const [tabPositions, setTabPositions] = useState<{ [key: string]: number }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const indicatorWidthAnim = useRef(new Animated.Value(0)).current;
  
  // Couleurs
  const effectiveIndicatorColor = indicatorColor || theme.colors.primary;
  const effectiveActiveColor = activeColor || theme.colors.primary;
  const effectiveInactiveColor = inactiveColor || theme.colors.textSecondary;
  
  // Mettre à jour l'animation de l'indicateur lorsque l'onglet actif change
  useEffect(() => {
    if (tabWidths[activeKey] && tabPositions[activeKey] !== undefined) {
      Animated.parallel([
        Animated.timing(indicatorAnim, {
          toValue: tabPositions[activeKey],
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorWidthAnim, {
          toValue: tabWidths[activeKey],
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
      
      // Faire défiler jusqu'à l'onglet actif si scrollable
      if (variant === 'scrollable' && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: tabPositions[activeKey] - windowWidth / 4,
          animated: true,
        });
      }
    }
  }, [activeKey, tabWidths, tabPositions, indicatorAnim, indicatorWidthAnim, variant, windowWidth]);
  
  // Gérer le changement de dimension d'un onglet
  const handleTabLayout = (key: string, event: LayoutChangeEvent, index: number) => {
    const { width, x } = event.nativeEvent.layout;
    
    setTabWidths((prev) => ({
      ...prev,
      [key]: width,
    }));
    
    setTabPositions((prev) => ({
      ...prev,
      [key]: variant === 'scrollable' ? x : index * (windowWidth / tabs.length),
    }));
  };
  
  // Rendu d'un onglet
  const renderTab = (tab: TabItem, index: number) => {
    const isActive = tab.key === activeKey;
    const color = isActive ? effectiveActiveColor : effectiveInactiveColor;
    
    return (
      <TouchableOpacity
        key={tab.key}
        activeOpacity={0.7}
        onPress={() => !tab.disabled && onChange(tab.key)}
        style={[
          styles.tab,
          variant === 'fullWidth' && { flex: 1 },
          tab.disabled && styles.disabledTab,
          tabStyle,
        ]}
        onLayout={(e) => handleTabLayout(tab.key, e, index)}
        disabled={tab.disabled}
      >
        <View
          style={[
            styles.tabContent,
            {
              flexDirection: iconPosition === 'left' ? 'row' : 'column',
              opacity: tab.disabled ? 0.5 : 1,
            },
          ]}
        >
          {tab.icon && (
            <Ionicons
              name={tab.icon as any}
              size={iconSize}
              color={color}
              style={iconPosition === 'left' ? styles.leftIcon : styles.topIcon}
            />
          )}
          
          <Text
            style={[
              styles.label,
              { color },
              labelStyle,
            ]}
            numberOfLines={1}
          >
            {tab.label}
          </Text>
          
          {tab.badge !== undefined && (
            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.error },
                ]}
              >
                <Text style={styles.badgeText}>
                  {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Conteneur de tabs en fonction de la variante
  const renderTabsContainer = () => {
    if (variant === 'scrollable') {
      return (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollableContainer}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      );
    }
    
    return (
      <View style={styles.tabsContainer}>
        {tabs.map(renderTab)}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* Indicateur supérieur */}
      {indicatorPosition === 'top' && (
        <Animated.View
          style={[
            styles.indicator,
            {
              top: 0,
              backgroundColor: effectiveIndicatorColor,
              transform: [{ translateX: indicatorAnim }],
              width: indicatorWidthAnim,
            },
            indicatorStyle,
          ]}
        />
      )}
      
      {/* Onglets */}
      {renderTabsContainer()}
      
      {/* Indicateur inférieur */}
      {indicatorPosition === 'bottom' && (
        <Animated.View
          style={[
            styles.indicator,
            {
              bottom: 0,
              backgroundColor: effectiveIndicatorColor,
              transform: [{ translateX: indicatorAnim }],
              width: indicatorWidthAnim,
            },
            indicatorStyle,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  scrollableContainer: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledTab: {
    opacity: 0.5,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  leftIcon: {
    marginRight: 8,
  },
  topIcon: {
    marginBottom: 4,
  },
  indicator: {
    position: 'absolute',
    height: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Tabs;
