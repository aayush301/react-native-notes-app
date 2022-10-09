import { View, Text, Alert, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { getData, storeData } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const Trash = () => {
  // const handleDeleteNoteRequest = () => {
  //   Alert.alert("Are you sure you want to delete?", "This will delete this note.", [{ text: "Cancel" }, { text: "OK", onPress: onDeleteConfirm }], { cancelable: true });
  // }

  const [trashNotes, setTrashNotes] = useState([]);
  useFocusEffect(() => {
    const fetchTrash = async () => {
      try {
        const trashNotes = (await getData("trashNotes")) || [];
        setTrashNotes(trashNotes);
      }
      catch (err) {
        Alert.alert("Error", "Some error is there!!");
      }
    }
    fetchTrash();
  });

  const emptyTrash = async () => {
    try {
      await storeData("trashNotes", []);
      setTrashNotes(trashNotes);
      ToastAndroid.show("Trash is empty now", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  return (
    <View>
      <Pressable onPress={emptyTrash}><Text>Empty Trash</Text></Pressable>
      {trashNotes.map(note => (
        <Text>{note.text}</Text>
      ))}
    </View>
  )
}

export default Trash