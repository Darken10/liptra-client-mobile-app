/**
 * Système de couleurs pour NatiUI
 * 
 * Inclut des couleurs sémantiques et une palette de base
 */

export const palette = {
  // Couleurs primaires
  blue50: '#E3F2FD',
  blue100: '#BBDEFB',
  blue200: '#90CAF9',
  blue300: '#64B5F6',
  blue400: '#42A5F5',
  blue500: '#2196F3',
  blue600: '#1E88E5',
  blue700: '#1976D2',
  blue800: '#1565C0',
  blue900: '#0D47A1',

  // Couleurs secondaires
  teal50: '#E0F2F1',
  teal100: '#B2DFDB',
  teal200: '#80CBC4',
  teal300: '#4DB6AC',
  teal400: '#26A69A',
  teal500: '#009688',
  teal600: '#00897B',
  teal700: '#00796B',
  teal800: '#00695C',
  teal900: '#004D40',

  // Gris
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Couleurs de statut
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // Autres
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const colors = {
  // Couleurs sémantiques
  primary: palette.blue500,
  primaryLight: palette.blue300,
  primaryDark: palette.blue700,
  
  secondary: palette.teal500,
  secondaryLight: palette.teal300,
  secondaryDark: palette.teal700,
  
  // Couleurs de fond
  background: palette.white,
  surface: palette.white,
  surfaceVariant: palette.gray50,
  
  // Couleurs de texte
  text: palette.gray900,
  textSecondary: palette.gray700,
  textDisabled: palette.gray500,
  textInverse: palette.white,
  
  // Couleurs de bordure
  border: palette.gray300,
  borderLight: palette.gray200,
  
  // États des composants
  disabled: palette.gray300,
  disabledBackground: palette.gray100,
  
  // Couleurs de statut
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
  
  // Couleurs d'interaction
  ripple: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Couleurs de base
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
};

export type Colors = typeof colors;

export default colors;
