import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ViewStyle,
  TextStyle,
  Platform,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface DatePickerProps {
  /**
   * Date sélectionnée
   */
  value?: Date;
  
  /**
   * Fonction appelée lorsque la date change
   */
  onValueChange?: (date: Date) => void;
  
  /**
   * Format d'affichage de la date
   * @default 'DD/MM/YYYY'
   */
  displayFormat?: string;
  
  /**
   * Date minimale sélectionnable
   */
  minDate?: Date;
  
  /**
   * Date maximale sélectionnable
   */
  maxDate?: Date;
  
  /**
   * Placeholder affiché lorsqu'aucune date n'est sélectionnée
   */
  placeholder?: string;
  
  /**
   * Indique si le sélecteur est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Indique si le sélecteur est en lecture seule
   * @default false
   */
  readonly?: boolean;
  
  /**
   * Taille du sélecteur
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Variante du sélecteur
   * @default 'outlined'
   */
  variant?: 'outlined' | 'filled' | 'underlined';
  
  /**
   * Mode du sélecteur
   * @default 'date'
   */
  mode?: 'date' | 'time' | 'datetime';
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le texte
   */
  textStyle?: TextStyle;
  
  /**
   * Style personnalisé pour l'icône
   */
  iconStyle?: ViewStyle;
  
  /**
   * Nom de l'icône
   * @default 'calendar'
   */
  iconName?: string;
}

/**
 * Composant DatePicker
 * 
 * Un sélecteur de date et/ou heure
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onValueChange,
  displayFormat = 'DD/MM/YYYY',
  minDate,
  maxDate,
  placeholder = 'Sélectionner une date',
  disabled = false,
  readonly = false,
  size = 'medium',
  variant = 'outlined',
  mode = 'date',
  style,
  textStyle,
  iconStyle,
  iconName = 'calendar',
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(value);
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  // Tailles en fonction de la taille spécifiée
  const getSizes = () => {
    const sizeMap = {
      small: {
        height: 36,
        fontSize: 12,
        paddingHorizontal: 8,
        iconSize: 16,
      },
      medium: {
        height: 44,
        fontSize: 14,
        paddingHorizontal: 12,
        iconSize: 20,
      },
      large: {
        height: 52,
        fontSize: 16,
        paddingHorizontal: 16,
        iconSize: 24,
      },
    };
    
    return sizeMap[size];
  };
  
  const sizes = getSizes();
  
  // Styles en fonction de la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          container: {
            backgroundColor: theme.colors.surface,
            borderWidth: 0,
          },
          focused: {
            backgroundColor: theme.colors.surfaceVariant,
            borderWidth: 0,
          },
        };
      case 'underlined':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            borderBottomWidth: 1,
            borderRadius: 0,
            borderColor: theme.colors.border,
          },
          focused: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            borderBottomWidth: 2,
            borderRadius: 0,
            borderColor: theme.colors.primary,
          },
        };
      default:
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          focused: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.primary,
          },
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  // Ouvrir le sélecteur
  const openPicker = () => {
    if (disabled || readonly) return;
    
    setTempDate(value);
    
    if (Platform.OS === 'ios') {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setModalVisible(true);
    }
  };
  
  // Fermer le sélecteur
  const closePicker = () => {
    if (Platform.OS === 'ios') {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    } else {
      setModalVisible(false);
    }
  };
  
  // Confirmer la sélection
  const confirmSelection = () => {
    if (tempDate && onValueChange) {
      onValueChange(tempDate);
    }
    closePicker();
  };
  
  // Gérer le changement de date
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      closePicker();
      if (event.type === 'set' && selectedDate && onValueChange) {
        onValueChange(selectedDate);
      }
    } else {
      setTempDate(selectedDate);
    }
  };
  
  // Formater la date pour l'affichage
  const formatDate = (date?: Date): string => {
    if (!date) return placeholder;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    switch (mode) {
      case 'time':
        return `${hours}:${minutes}`;
      case 'datetime':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };
  
  // Déterminer le mode du DateTimePicker
  const getPickerMode = () => {
    switch (mode) {
      case 'time':
        return 'time';
      case 'datetime':
        return Platform.OS === 'ios' ? 'datetime' : 'date';
      default:
        return 'date';
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={openPicker}
        disabled={disabled || readonly}
        style={[
          styles.picker,
          {
            height: sizes.height,
            borderRadius: 8,
            opacity: disabled ? 0.5 : 1,
          },
          variantStyles.container,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: sizes.fontSize,
              color: value
                ? theme.colors.text
                : theme.colors.textSecondary,
            },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        
        <Ionicons
          name={iconName as any}
          size={sizes.iconSize}
          color={theme.colors.text}
          style={[styles.icon, iconStyle]}
        />
      </TouchableOpacity>
      
      {/* Picker Modal pour iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          onRequestClose={closePicker}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={closePicker}
            style={styles.modalOverlay}
          >
            <Animated.View
              style={[
                styles.modalContent,
                { opacity: fadeAnim },
              ]}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={closePicker}
                  style={styles.modalButton}
                >
                  <Text style={{ color: theme.colors.textSecondary }}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Sélectionner une date
                </Text>
                
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={confirmSelection}
                  style={styles.modalButton}
                >
                  <Text style={{ color: theme.colors.primary }}>
                    Confirmer
                  </Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={tempDate || new Date()}
                mode={getPickerMode() as any}
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minDate}
                maximumDate={maxDate}
                textColor={theme.colors.text}
              />
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
      
      {/* Picker pour Android */}
      {Platform.OS === 'android' && modalVisible && (
        <DateTimePicker
          value={value || new Date()}
          mode={getPickerMode() as any}
          display="default"
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  text: {
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalButton: {
    padding: 4,
  },
});

export default DatePicker;
