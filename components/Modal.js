import { View, Modal as RNModal, Pressable, StyleSheet } from 'react-native'
import React from 'react'

const Modal = ({ children, visible, onRequestClose, style = {} }) => {
  return (
    <RNModal animationType="fade" transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <Pressable style={styles.centeredView} onPress={e => e.target == e.currentTarget && onRequestClose()}>
        <View style={[styles.modalView, style]}>
          {children}
        </View>
      </Pressable>
    </RNModal>
  )
}

export default Modal


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
})