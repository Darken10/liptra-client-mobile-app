/**
 * Breakpoints pour le système de responsive design
 * 
 * Définit les points de rupture pour adapter l'interface à différentes tailles d'écran
 */

export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const breakpoints: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export default breakpoints;
