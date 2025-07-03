import React from 'react';
import {
  StyleSheet,
  View,
  Modal as RNModal,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ModalProps {
  /**
   * Indique si la modal est visible
   */
  visible: boolean;
  
  /**
   * Fonction appelée lorsque l'utilisateur demande à fermer la modal
   */
  onClose: () => void;
  
  /**
   * Contenu à afficher dans la modal
   */
  children: React.ReactNode;
  
  /**
   * Titre de la modal
   */
  title?: string;
  
  /**
   * Contenu à afficher dans l'en-tête de la modal (remplace le titre)
   */
  headerContent?: React.ReactNode;
  
  /**
   * Contenu à afficher dans le pied de la modal
   */
  footerContent?: React.ReactNode;
  
  /**
   * Indique si la modal peut être fermée en cliquant en dehors
   * @default true
   */
  closeOnBackdropPress?: boolean;
  
  /**
   * Indique si la modal affiche un bouton de fermeture
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Indique si la modal doit prendre toute la hauteur de l'écran
   * @default false
   */
  fullHeight?: boolean;
  
  /**
   * Indique si le contenu de la modal est scrollable
   * @default true
   */
  scrollable?: boolean;
  
  /**
   * Indique si la modal doit s'adapter au clavier
   * @default true
   */
  avoidKeyboard?: boolean;
  
  /**
   * Style personnalisé pour le conteneur de la modal
   */
  containerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour l'en-tête de la modal
   */
  headerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le contenu de la modal
   */
  contentStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le pied de la modal
   */
  footerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le titre
   */
  titleStyle?: TextStyle;
  
  /**
   * Animation de la modal
   * @default 'slide'
   */
  animationType?: 'none' | 'slide' | 'fade';
  
  /**
   * Couleur de l'overlay de la modal
   */
  backdropColor?: string;
}

/**
 * Composant Modal
 * 
 * Une modal pour afficher du contenu par-dessus l'écran actuel
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  title,
  headerContent,
  footerContent,
  closeOnBackdropPress = true,
  showCloseButton = true,
  fullHeight = false,
  scrollable = true,
  avoidKeyboard = true,
  containerStyle,
  headerStyle,
  contentStyle,
  footerStyle,
  titleStyle,
  animationType = 'slide',
  backdropColor,
}) => {
  const theme = useTheme();
  
  // Rendu de l'en-tête par défaut (titre)
  const renderDefaultHeader = () => {
    return (
      <View style={[styles.header, headerStyle]}>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text },
            titleStyle,
          ]}
        >
          {title}
        </Text>
        
        {showCloseButton && (
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // Conteneur de la modal
  const modalContainer = (
    <View
      style={[
        styles.modalContainer,
        {
          backgroundColor: theme.colors.surface,
          maxHeight: fullHeight ? SCREEN_HEIGHT * 0.9 : SCREEN_HEIGHT * 0.7,
        },
        containerStyle,
      ]}
    >
      {/* En-tête personnalisé ou par défaut */}
      {headerContent || (title && renderDefaultHeader())}
      
      {/* Contenu principal */}
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      )}
      
      {/* Pied de modal */}
      {footerContent && (
        <View style={[styles.footer, footerStyle]}>
          {footerContent}
        </View>
      )}
    </View>
  );
  
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[
          styles.backdrop,
          { backgroundColor: backdropColor || 'rgba(0, 0, 0, 0.5)' },
        ]}
        activeOpacity={1}
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <TouchableOpacity activeOpacity={1}>
          {avoidKeyboard ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              pointerEvents="box-none"
              style={styles.keyboardAvoidingView}
            >
              {modalContainer}
            </KeyboardAvoidingView>
          ) : (
            modalContainer
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  content: {
    padding: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
});

export default Modal;
