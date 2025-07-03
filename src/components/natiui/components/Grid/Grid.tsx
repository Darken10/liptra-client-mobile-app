import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ViewProps,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../theme';

export interface GridProps extends ViewProps {
  /**
   * Contenu de la grille
   */
  children: React.ReactNode;
  
  /**
   * Espacement entre les éléments
   * @default 8
   */
  spacing?: number;
  
  /**
   * Nombre de colonnes
   * @default 12
   */
  columns?: number;
  
  /**
   * Alignement horizontal des éléments
   * @default 'flex-start'
   */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  
  /**
   * Alignement vertical des éléments
   * @default 'flex-start'
   */
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: StyleProp<ViewStyle>;
}

export interface GridItemProps extends ViewProps {
  /**
   * Contenu de l'élément
   */
  children: React.ReactNode;
  
  /**
   * Nombre de colonnes occupées par l'élément
   * @default 12
   */
  xs?: number;
  
  /**
   * Nombre de colonnes occupées par l'élément sur un écran de taille moyenne
   */
  sm?: number;
  
  /**
   * Nombre de colonnes occupées par l'élément sur un écran de taille large
   */
  md?: number;
  
  /**
   * Nombre de colonnes occupées par l'élément sur un écran de taille très large
   */
  lg?: number;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Composant Grid
 * 
 * Une grille responsive pour organiser le contenu
 */
export const Grid: React.FC<GridProps> = ({
  children,
  spacing = 8,
  columns = 12,
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  style,
  ...rest
}) => {
  // Appliquer l'espacement aux enfants
  const childrenWithSpacing = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        style: [
          child.props.style,
          { margin: spacing / 2 },
        ],
      });
    }
    return child;
  });
  
  return (
    <View
      style={[
        styles.container,
        {
          margin: -spacing / 2,
          justifyContent,
          alignItems,
        },
        style,
      ]}
      {...rest}
    >
      {childrenWithSpacing}
    </View>
  );
};

/**
 * Composant GridItem
 * 
 * Un élément de grille responsive
 */
export const GridItem: React.FC<GridItemProps> = ({
  children,
  xs = 12,
  sm,
  md,
  lg,
  style,
  ...rest
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  
  // Déterminer la taille de l'écran
  const getScreenSize = () => {
    if (width >= theme.breakpoints.lg) return 'lg';
    if (width >= theme.breakpoints.md) return 'md';
    if (width >= theme.breakpoints.sm) return 'sm';
    return 'xs';
  };
  
  // Déterminer le nombre de colonnes en fonction de la taille de l'écran
  const getColumnSize = () => {
    const screenSize = getScreenSize();
    
    switch (screenSize) {
      case 'lg':
        return lg || md || sm || xs;
      case 'md':
        return md || sm || xs;
      case 'sm':
        return sm || xs;
      default:
        return xs;
    }
  };
  
  const columnSize = getColumnSize();
  const flexBasisValue = (columnSize / 12) * 100;
  const flexBasis = `${flexBasisValue}%` as any;
  
  return (
    <View
      style={[
        {
          flexBasis,
          maxWidth: flexBasis,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

/**
 * Composant Row
 * 
 * Une ligne de grille
 */
export interface RowProps extends ViewProps {
  /**
   * Contenu de la ligne
   */
  children: React.ReactNode;
  
  /**
   * Espacement entre les éléments
   * @default 8
   */
  spacing?: number;
  
  /**
   * Alignement horizontal des éléments
   * @default 'flex-start'
   */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  
  /**
   * Alignement vertical des éléments
   * @default 'center'
   */
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: StyleProp<ViewStyle>;
}

export const Row: React.FC<RowProps> = ({
  children,
  spacing = 8,
  justifyContent = 'flex-start',
  alignItems = 'center',
  style,
  ...rest
}) => {
  // Appliquer l'espacement aux enfants
  const childrenWithSpacing = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        style: [
          child.props.style,
          { marginHorizontal: spacing / 2 },
        ],
      });
    }
    return child;
  });
  
  return (
    <View
      style={[
        styles.row,
        {
          marginHorizontal: -spacing / 2,
          justifyContent,
          alignItems,
        },
        style,
      ]}
      {...rest}
    >
      {childrenWithSpacing}
    </View>
  );
};

/**
 * Composant Col
 * 
 * Une colonne de grille
 */
export interface ColProps extends ViewProps {
  /**
   * Contenu de la colonne
   */
  children: React.ReactNode;
  
  /**
   * Largeur de la colonne (0-1)
   */
  width?: number;
  
  /**
   * Largeur de la colonne sur un écran de taille moyenne
   */
  smWidth?: number;
  
  /**
   * Largeur de la colonne sur un écran de taille large
   */
  mdWidth?: number;
  
  /**
   * Largeur de la colonne sur un écran de taille très large
   */
  lgWidth?: number;
  
  /**
   * Espacement entre les éléments
   * @default 8
   */
  spacing?: number;
  
  /**
   * Alignement horizontal des éléments
   * @default 'flex-start'
   */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  
  /**
   * Alignement vertical des éléments
   * @default 'flex-start'
   */
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: StyleProp<ViewStyle>;
}

export const Col: React.FC<ColProps> = ({
  children,
  width,
  smWidth,
  mdWidth,
  lgWidth,
  spacing = 8,
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  style,
  ...rest
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const theme = useTheme();
  
  // Déterminer la taille de l'écran
  const getScreenSize = () => {
    if (screenWidth >= theme.breakpoints.lg) return 'lg';
    if (screenWidth >= theme.breakpoints.md) return 'md';
    if (screenWidth >= theme.breakpoints.sm) return 'sm';
    return 'xs';
  };
  
  // Déterminer la largeur en fonction de la taille de l'écran
  const getColumnWidth = () => {
    const screenSize = getScreenSize();
    
    switch (screenSize) {
      case 'lg':
        return lgWidth || mdWidth || smWidth || width;
      case 'md':
        return mdWidth || smWidth || width;
      case 'sm':
        return smWidth || width;
      default:
        return width;
    }
  };
  
  const columnWidth = getColumnWidth();
  
  // Appliquer l'espacement aux enfants
  const childrenWithSpacing = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        style: [
          child.props.style,
          { marginVertical: spacing / 2 },
        ],
      });
    }
    return child;
  });
  
  return (
    <View
      style={[
        styles.col,
        {
          marginVertical: -spacing / 2,
          justifyContent,
          alignItems,
          flex: columnWidth !== undefined ? undefined : 1,
          width: columnWidth !== undefined ? `${columnWidth * 100}%` : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {childrenWithSpacing}
    </View>
  );
};

/**
 * Composant Container
 * 
 * Un conteneur avec une largeur maximale
 */
export interface ContainerProps extends ViewProps {
  /**
   * Contenu du conteneur
   */
  children: React.ReactNode;
  
  /**
   * Taille maximale du conteneur
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Rembourrage horizontal
   * @default 16
   */
  paddingX?: number;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: StyleProp<ViewStyle>;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  paddingX = 16,
  style,
  ...rest
}) => {
  const theme = useTheme();
  
  // Déterminer la largeur maximale
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm':
        return theme.breakpoints.sm;
      case 'md':
        return theme.breakpoints.md;
      case 'lg':
        return theme.breakpoints.lg;
      case 'xl':
        return theme.breakpoints.xl;
      case 'full':
        return '100%' as any;
      default:
        return theme.breakpoints.lg;
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: getMaxWidth(),
          paddingHorizontal: paddingX,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  col: {
    flexDirection: 'column',
  },
});

export default {
  Grid,
  GridItem,
  Row,
  Col,
  Container,
};
