// components/Notification.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const Notification = ({ message, type, duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-150)); // Start even further up

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: isWeb ? -10 : -20, // Slide down a bit more for mobile
        duration: 150, // Faster animation
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -145, // Match the initial value for a clean exit
            duration: 150, // Faster animation
            useNativeDriver: true,
          }).start(() => {
            setIsVisible(false);
            if (onClose) {
              onClose();
            }
          });
        }, duration);
      });
    }
  }, [message, duration, onClose, slideAnim, isWeb]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#2E7D32'; // Verde profesional
      case 'error':
        return '#D32F2F'; // Rojo profesional
      default:
        return '#1976D2'; // Azul profesional
    }
  };

  const backgroundColor = getBackgroundColor();
  const textColor = 'white';

  if (!isVisible && !message) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        isWeb ? styles.containerWeb : {},
        { backgroundColor, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={[styles.text, isWeb ? styles.textWeb : {}, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

const baseMarginWeb = 0.35; // Even more margin for web (narrower)
const webWidthPercentage = 1 - (baseMarginWeb * 2);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -120, // Start even further above (adjust as needed)
    left: screenWidth * 0.1, // Default for mobile (80% width)
    right: screenWidth * 0.1,
    paddingVertical: 10, // Increased vertical padding for mobile (longer)
    paddingHorizontal: 15, // Increased horizontal padding for mobile (wider)
    borderRadius: 12, // More border radius
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, // Even less shadow opacity
    shadowRadius: 1,
    elevation: 0, // Even lower elevation
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.1)', // Even lighter border color
  },
  text: {
    fontSize: 12, // Increased font size for mobile
    fontWeight: 'bold',
  },
  containerWeb: {
    left: screenWidth * baseMarginWeb,
    right: screenWidth * baseMarginWeb,
    width: screenWidth * webWidthPercentage,
    paddingVertical: 10, // Slightly more vertical padding for web (longer)
    paddingHorizontal: 12,
    borderRadius: 12, // More border radius for web
  },
  textWeb: {
    fontSize: 12,
  },
});

export default Notification;