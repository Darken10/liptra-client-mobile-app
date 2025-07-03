/**
 * Système d'espacement pour NatiUI
 * 
 * Définit un système d'espacement cohérent pour les marges et paddings
 */

export const spacing = {
  // Espacements de base
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 56,
  '5xl': 64,
  
  // Espacements spécifiques
  gutter: 16, // Espacement standard entre les éléments
  screenPadding: 16, // Padding standard des écrans
  
  // Fonction utilitaire pour calculer des espacements personnalisés
  multiply: (factor: number, size: keyof typeof spacingValues = 'md'): number => {
    const spacingValues = {
      none: 0,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 40,
      '3xl': 48,
      '4xl': 56,
      '5xl': 64,
    };
    
    return spacingValues[size] * factor;
  },
};

export type Spacing = typeof spacing;

export default spacing;
