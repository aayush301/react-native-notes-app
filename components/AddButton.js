import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import theme from '../style/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const AddButton = () => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate("AddNote")} style={styles.buttonStyle} android_ripple={{ color: "#ccc", radius: 25 }}>
      <Icon name="add-outline" size={30} color="white" />
    </Pressable>
  )
}

export default AddButton

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

