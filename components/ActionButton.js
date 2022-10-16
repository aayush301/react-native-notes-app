import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import theme from '../style/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActionButton = ({ style = {}, onPress, iconName = "add-outline", isVisible = true }) => {
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(isVisible ? 1 : 0, { duration: 200 }) }]
  }), [isVisible]);

  return (
    <AnimatedPressable onPress={onPress} style={[styles.buttonStyle, style, animatedStyles]} android_ripple={{ color: "#ccc", radius: 25 }}>
      <Icon name={iconName} size={30} color="white" />
    </AnimatedPressable>
  )
}

export default ActionButton

const styles = StyleSheet.create({
  buttonStyle: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: theme.PRIMARY_COLOR,
    color: 'white',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  }
})

