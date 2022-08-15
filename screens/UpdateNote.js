import { Alert, Pressable, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { storeData } from '../utils/storage';
import { useGlobalContext } from '../context/context';
import Icon from 'react-native-vector-icons/Ionicons';
import { convertToXTimeAgo } from '../utils/dateformat';
import theme from '../style/theme';

const UpdateNote = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const noteId = route.params.id;
  const { notes, setNotes } = useGlobalContext();
  const [note, setNote] = useState({});
  const [formData, setFormData] = useState({
    text: ""
  });

  useEffect(() => {
    setNote(notes.find(note => note.id === noteId));
  }, [notes, noteId]);

  useEffect(() => {
    setFormData({ text: note.text || "" });
  }, [note]);


  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async () => {
    try {
      if (formData.text === "") return;
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, text: formData.text, updatedAt: new Date() };
      })
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      navigation.navigate("Home");
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const handleDelete = async () => {
    try {
      const newNotesArr = notes.filter(note => note.id !== noteId);
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      navigation.navigate("Home");
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const updatedAt = convertToXTimeAgo(note.updatedAt);


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <TextInput value={formData.text} onChangeText={text => handleChange("text", text)} multiline={true} autoFocus style={{ padding: 20, fontSize: 16, color: "#555" }} placeholder="Your note" />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.PRIMARY_COLOR, paddingVertical: 10, paddingHorizontal: 15 }}>
        <Pressable onPress={handleDelete} android_ripple={{ color: "#ccc", radius: 15 }}>
          <Icon name="trash" size={20} color="white" />
        </Pressable>
        <Text style={{ color: "white" }}>Edited {updatedAt}</Text>
        <Pressable onPress={handleSubmit} android_ripple={{ color: "#ccc", radius: 15 }}>
          <Icon name="checkmark" size={25} color="white" />
        </Pressable>
      </View>
    </View>
  )
}

export default UpdateNote