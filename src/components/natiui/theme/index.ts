/**
 * Système de thème pour NatiUI
 * 
 * Combine tous les aspects du design system (couleurs, typographie, espacement, breakpoints)
 * et fournit un contexte de thème pour l'application
 */
import React, { createContext, useContext } from 'react';

import colors, { Colors } from './colors';
import typography, { Typography } from './typography';
import spacing, { Spacing } from './spacing';
import breakpoints, { Breakpoints } from './breakpoints';

// Structure du thème
export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
}

// Thème par défaut
export const defaultTheme: Theme = {
  colors,
  typography,
  spacing,
  breakpoints,
};

// Contexte de thème
const ThemeContext = createContext<Theme>(defaultTheme);

// Hook pour utiliser le thème
export const useTheme = () => useContext(ThemeContext);

// Propriétés du ThemeProvider
interface ThemeProviderProps {
  theme?: Theme;
  children: React.ReactNode;
}

// Composant ThemeProvider
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = defaultTheme,
  children,
}) => {
  return (
    React.createElement(ThemeContext.Provider, { value: theme },
      children
    )
  );
};

// Exports individuels
export { colors, typography, spacing };

// Export par défaut
export default {
  defaultTheme,
  ThemeProvider,
  useTheme,
};
