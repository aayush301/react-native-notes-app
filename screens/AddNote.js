import { Alert, BackHandler, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../utils/storage';
import { useGlobalContext } from '../context/context';
import ActionButton from '../components/ActionButton';

const AddNote = () => {
  const navigation = useNavigation();
  const { notes, setNotes } = useGlobalContext();

  const [formData, setFormData] = useState({
    text: ""
  });


  useEffect(() => {
    const backAction = () => {
      if (formData.text === "") return false;
      Alert.alert("Your note has not been saved.", "Do you want to save it?", [{ text: "Yes", onPress: saveNote }, { text: "No", onPress: navigation.goBack }], { cancelable: true });
      return true;
    }
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [formData, navigation, saveNote]);



  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  }

  const saveNote = useCallback(async () => {
    try {
      if (formData.text === "") return;
      const newNote = {
        id: Math.floor(Math.random() * 10000),
        text: formData.text,
        createdAt: new Date(),
        updatedAt: new Date(),
        labels: []
      }
      const newNotesArr = [newNote, ...notes];
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      navigation.navigate("Home");
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }, [formData, navigation, notes, setNotes]);


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <TextInput value={formData.text} onChangeText={text => handleChange("text", text)} multiline={true} style={{ padding: 20, fontSize: 16, color: "#555" }} placeholder="Your note" autoFocus />
      </View>

      <ActionButton iconName='checkmark' onPress={saveNote} isVisible={formData.text !== ""} />
    </View>
  )
}

export default AddNote