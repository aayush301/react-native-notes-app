import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import theme from '../style/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const SaveButton = ({ onPress, right, bottom }) => {
  return (
    <Pressable onPress={onPress} style={styles(right, bottom).buttonStyle} android_ripple={{ color: "#ccc", radius: 25 }}>
      <View>
        <Icon name="checkmark" size={25} color="white" />
      </View>
    </Pressable>
  )
}

export default SaveButton

const styles = (right, bottom) => StyleSheet.create({
  buttonStyle: {
    position: "absolute",
    bottom: bottom || 20,
    right: right || 20,
    width: 50,
    height: 50,
    backgroundColor: theme.PRIMARY_COLOR,
    color: 'white',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  }
})

