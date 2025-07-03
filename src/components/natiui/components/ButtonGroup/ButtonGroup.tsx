import React, { ReactElement, Children, cloneElement } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface ButtonGroupProps {
  /**
   * Les boutons enfants
   */
  children: ReactElement | ReactElement[];
  
  /**
   * Orientation du groupe de boutons
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
  
  /**
   * Espacement entre les boutons
   * @default 8
   */
  spacing?: number;
  
  /**
   * Alignement des boutons
   * @default 'center'
   */
  align?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  
  /**
   * Taille des boutons
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Variante des boutons
   */
  variant?: 'filled' | 'outlined' | 'text';
  
  /**
   * Indique si les boutons sont désactivés
   */
  disabled?: boolean;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
}

/**
 * Composant ButtonGroup
 * 
 * Un groupe de boutons avec un espacement et une orientation configurables
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = 'horizontal',
  spacing = 8,
  align = 'center',
  size,
  variant,
  disabled,
  style,
}) => {
  const theme = useTheme();
  
  // Cloner les enfants pour leur appliquer les props communes
  const renderChildren = () => {
    return Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }
      
      // Appliquer les props communes à tous les boutons
      return cloneElement(child, {
        ...(size !== undefined && { size }),
        ...(variant !== undefined && { variant }),
        ...(disabled !== undefined && { disabled }),
        style: [
          child.props?.style,
          direction === 'horizontal' ? { marginRight: spacing } : { marginBottom: spacing },
          // Supprimer la marge du dernier élément
          Children.count(children) > 1 && 
          child === Children.toArray(children)[Children.count(children) - 1] && 
          (direction === 'horizontal' ? { marginRight: 0 } : { marginBottom: 0 }),
        ],
      } as React.ComponentProps<typeof child.type>);
    });
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          justifyContent: align,
        },
        style,
      ]}
    >
      {renderChildren()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ButtonGroup;
