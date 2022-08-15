import { Alert, Pressable, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../utils/storage';
import { useGlobalContext } from '../context/context';
import theme from '../style/theme';

const AddNote = () => {
  const navigation = useNavigation();
  const { notes, setNotes } = useGlobalContext();

  const [formData, setFormData] = useState({
    text: ""
  });
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async () => {
    try {
      if (formData.text === "") return;
      const newNote = {
        id: Math.floor(Math.random() * 10000),
        text: formData.text,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const newNotesArr = [newNote, ...notes];
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      navigation.navigate("Home");
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <TextInput value={formData.text} onChangeText={text => handleChange("text", text)} multiline={true} style={{ padding: 20, fontSize: 16, color: "#555" }} placeholder="Your note" autoFocus />
      </View>

      <Pressable onPress={handleSubmit} android_ripple={{ color: "#ccc", radius: 200 }} style={{ backgroundColor: theme.PRIMARY_COLOR, paddingVertical: 15 }} disabled={formData.text === ""}>
        <Text style={{ textAlign: "center", color: "white", fontSize: 15 }}> Save note </Text>
      </Pressable>
    </View>
  )
}

export default AddNote