import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextStyle,
  ViewStyle,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface SelectOption {
  /**
   * Valeur de l'option
   */
  value: string;
  
  /**
   * Label de l'option
   */
  label: string;
  
  /**
   * Icône optionnelle pour l'option
   */
  icon?: string;
  
  /**
   * Indique si l'option est désactivée
   */
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * Valeur sélectionnée
   */
  value?: string;
  
  /**
   * Fonction appelée lorsque la valeur change
   */
  onValueChange?: (value: string) => void;
  
  /**
   * Liste des options
   */
  options: SelectOption[];
  
  /**
   * Placeholder affiché lorsqu'aucune valeur n'est sélectionnée
   */
  placeholder?: string;
  
  /**
   * Indique si le select est désactivé
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Indique si le select est en mode recherche
   * @default false
   */
  searchable?: boolean;
  
  /**
   * Placeholder pour la recherche
   */
  searchPlaceholder?: string;
  
  /**
   * Taille du select
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Variante du select
   * @default 'outlined'
   */
  variant?: 'outlined' | 'filled' | 'underlined';
  
  /**
   * Position du dropdown
   * @default 'bottom'
   */
  dropdownPosition?: 'top' | 'bottom' | 'auto';
  
  /**
   * Texte affiché lorsqu'aucune option n'est disponible
   */
  emptyText?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Style personnalisé pour le texte
   */
  textStyle?: TextStyle;
  
  /**
   * Style personnalisé pour le dropdown
   */
  dropdownStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour les options
   */
  optionStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour le texte des options
   */
  optionTextStyle?: TextStyle;
}

/**
 * Composant Select
 * 
 * Un sélecteur de valeur parmi une liste d'options
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Sélectionner...',
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Rechercher...',
  size = 'medium',
  variant = 'outlined',
  dropdownPosition = 'bottom',
  emptyText = 'Aucune option disponible',
  style,
  textStyle,
  dropdownStyle,
  optionStyle,
  optionTextStyle,
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectLayout, setSelectLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const selectRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
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
  
  // Ouvrir le dropdown
  const openDropdown = () => {
    if (disabled) return;
    
    // Mesurer la position du select
    selectRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setSelectLayout({ x: pageX, y: pageY, width, height });
      setModalVisible(true);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };
  
  // Fermer le dropdown
  const closeDropdown = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSearchQuery('');
    });
  };
  
  // Sélectionner une option
  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    
    if (onValueChange) {
      onValueChange(option.value);
    }
    
    closeDropdown();
  };
  
  // Filtrer les options en fonction de la recherche
  const filteredOptions = searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;
  
  // Trouver l'option sélectionnée
  const selectedOption = options.find((option) => option.value === value);
  
  // Déterminer la position du dropdown
  const getDropdownPosition = () => {
    const { height: windowHeight } = Dimensions.get('window');
    const { y, height } = selectLayout;
    const dropdownHeight = Math.min(300, filteredOptions.length * 48 + (searchable ? 56 : 0));
    
    // Espace disponible en bas
    const bottomSpace = windowHeight - (y + height);
    
    // Si la position est auto, déterminer la meilleure position
    if (dropdownPosition === 'auto') {
      if (bottomSpace < dropdownHeight && y > dropdownHeight) {
        return 'top';
      }
      return 'bottom';
    }
    
    return dropdownPosition;
  };
  
  const position = getDropdownPosition();
  
  // Styles du dropdown en fonction de la position
  const dropdownPositionStyle = {
    top: position === 'bottom' ? selectLayout.y + selectLayout.height + 4 : undefined,
    bottom: position === 'top' ? windowHeight - selectLayout.y + 4 : undefined,
    left: selectLayout.x,
    width: selectLayout.width,
    maxHeight: 300,
  };
  
  // Rendu d'une option
  const renderOption = ({ item }: { item: SelectOption }) => {
    const isSelected = item.value === value;
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => selectOption(item)}
        disabled={item.disabled}
        style={[
          styles.option,
          {
            backgroundColor: isSelected ? theme.colors.surfaceVariant : 'transparent',
            opacity: item.disabled ? 0.5 : 1,
          },
          optionStyle,
        ]}
      >
        {item.icon && (
          <Ionicons
            name={item.icon as any}
            size={sizes.iconSize}
            color={theme.colors.text}
            style={styles.optionIcon}
          />
        )}
        
        <Text
          style={[
            styles.optionText,
            {
              fontSize: sizes.fontSize,
              color: theme.colors.text,
            },
            optionTextStyle,
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
        
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={sizes.iconSize}
            color={theme.colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  const windowHeight = Dimensions.get('window').height;
  
  return (
    <>
      <View ref={selectRef} style={[styles.container, style]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openDropdown}
          disabled={disabled}
          style={[
            styles.select,
            {
              height: sizes.height,
              borderRadius: 8,
              opacity: disabled ? 0.5 : 1,
            },
            variantStyles.container,
            style,
          ]}
        >
          <View style={styles.selectContent}>
            {selectedOption?.icon && (
              <Ionicons
                name={selectedOption.icon as any}
                size={sizes.iconSize}
                color={theme.colors.text}
                style={styles.selectIcon}
              />
            )}
            
            <Text
              style={[
                styles.selectText,
                {
                  fontSize: sizes.fontSize,
                  color: selectedOption
                    ? theme.colors.text
                    : theme.colors.textSecondary,
                },
                textStyle,
              ]}
              numberOfLines={1}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
          </View>
          
          <Ionicons
            name="chevron-down"
            size={sizes.iconSize}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      
      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeDropdown}
          style={styles.modalOverlay}
        >
          <Animated.View
            style={[
              styles.dropdown,
              dropdownPositionStyle,
              { opacity: fadeAnim },
              dropdownStyle,
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View>
                {/* Barre de recherche */}
                {searchable && (
                  <View style={styles.searchContainer}>
                    <Ionicons
                      name="search"
                      size={20}
                      color={theme.colors.textSecondary}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={[
                        styles.searchInput,
                        { color: theme.colors.text },
                      ]}
                      placeholder={searchPlaceholder}
                      placeholderTextColor={theme.colors.textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoFocus
                    />
                    {searchQuery ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={theme.colors.textSecondary}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}
                
                {/* Liste des options */}
                {filteredOptions.length > 0 ? (
                  <ScrollView style={{ maxHeight: 300 }}>
                    {filteredOptions.map((option) => renderOption({ item: option }))}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text
                      style={[
                        styles.emptyText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {emptyText}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// Ajout du composant TextInput pour la recherche
const TextInput = Platform.select({
  ios: require('react-native').TextInput,
  android: require('react-native').TextInput,
  default: require('react-native').TextInput,
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  selectContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectIcon: {
    marginRight: 8,
  },
  selectText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    flex: 1,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});

export default Select;
