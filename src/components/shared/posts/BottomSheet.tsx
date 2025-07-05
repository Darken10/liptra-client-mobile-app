import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Importation correcte de useAnimatedGestureHandler depuis react-native-reanimated
import { useAnimatedGestureHandler } from 'react-native-reanimated';

const BottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Utilisation de useSharedValue pour les valeurs animées
  const translateY = useSharedValue(0);

  // Gestion du geste (PanGesture)
  const onGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      // Mise à jour de la valeur de translateY pendant le geste
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      // Lors du relâchement du geste, décide d'ouvrir ou de fermer le Bottom Sheet
      const threshold = 150; // Seuil pour décider si on ouvre ou ferme

      if (event.translationY < threshold) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }

      // Animation vers la position appropriée
      translateY.value = withTiming(isOpen ? 0 : 300, {
        duration: 250,
        easing: Easing.ease,
      });
    },
  });

  // Utilisation de useAnimatedStyle pour l'animation du BottomSheet
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: isOpen ? 300 : 100, // Hauteur dynamique
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <Text style={styles.toggleText}>
            {isOpen ? 'Fermer le Bottom Sheet' : 'Ouvrir le Bottom Sheet'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gestion du geste de glissement */}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
          <Text style={styles.sheetText}>Ceci est un Bottom Sheet</Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 18,
    color: '#007BFF',
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sheetText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BottomSheet;
