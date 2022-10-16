import { Alert, Pressable, Text, TextInput, View, ToastAndroid, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { storeData } from '../utils/storage';
import { useGlobalContext } from '../context/context';
import Icon from 'react-native-vector-icons/Ionicons';
import { convertToXTimeAgo } from '../utils/dateformat';
import { SheetManager } from "react-native-actions-sheet";
import NoteOptionsActionSheet from '../components/NoteOptionsActionSheet';
import moment from 'moment';
import NoteReminderModal from '../components/NoteReminderModal';
import ActionButton from '../components/ActionButton';
import { SharedElement } from 'react-navigation-shared-element';

const UpdateNote = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocussed = useIsFocused();
  const { notes, setNotes } = useGlobalContext();
  const [noteReminderModal, setNoteReminderModal] = useState(false);

  const noteId = route.params.id;
  const note = notes.find(note => note.id === noteId);
  const [formData, setFormData] = useState({ text: note.text });

  useEffect(() => {
    const backAction = () => {
      if (!isFocussed) return false;
      if (formData.text === "" || formData.text === note?.text) return false;
      Alert.alert("Your changes have not been saved.", "Do you want to save it?", [{ text: "Yes", onPress: updateNote }, { text: "No", onPress: navigation.goBack }], { cancelable: true });
      return true;
    }
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [isFocussed, formData, navigation, updateNote, note?.text]);


  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  }

  const updateNote = useCallback(async () => {
    try {
      if (formData.text === "") return;
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, text: formData.text, updatedAt: new Date() };
      })
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      navigation.navigate("Home");
      ToastAndroid.show("Note saved", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }, [formData, notes, setNotes, navigation, noteId]);


  const toggleBookmark = async () => {
    try {
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, isBookmarked: !note.isBookmarked };
      })
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const updatedAt = convertToXTimeAgo(note.updatedAt);
  const isReminderTimePassed = new Date(note.reminder?.dateTime).getTime() < new Date().getTime();


  return (
    <View style={{ flex: 1 }}>
      <SharedElement id={`note.${note.id}`} style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", paddingHorizontal: 15, paddingVertical: 10 }}>
            {note.labels?.map(label => (
              <Text key={label} style={{ margin: 5, padding: 5, backgroundColor: "#eee", color: "#666", borderRadius: 3, fontSize: 15 }}>{label}</Text>
            ))}
          </View>

          {note.reminder?.dateTime && (
            <Pressable onPress={() => setNoteReminderModal(true)} style={{ flexDirection: "row", alignSelf: "flex-start", margin: 10, marginTop: 0, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: "#eee", borderRadius: 3, }} android_ripple={{ color: "#bbb", radius: 200 }}>
              <Icon name="alarm-outline" size={20} color="gray" style={{ marginRight: 10 }} />
              <Text style={[{ color: "#666", fontSize: 15 }, isReminderTimePassed && { textDecorationLine: 'line-through' }]}>
                {moment(note.reminder.dateTime).format("lll")}
              </Text>
            </Pressable>
          )}

          <TextInput
            value={formData.text}
            onChangeText={text => handleChange("text", text)}
            multiline={true}
            style={{ paddingHorizontal: 20, paddingBottom: 100, fontSize: 16, color: "#555" }}
            placeholder="Your note"
          />
        </View>
      </SharedElement>


      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ddd", paddingVertical: 4, paddingHorizontal: 15 }}>
        <Text style={{ color: "#444" }}>Edited {updatedAt}</Text>
        <Pressable onPress={toggleBookmark} android_ripple={{ color: "#ccc", radius: 30 }}>
          <Icon name={note.isBookmarked ? "bookmark" : "bookmark-outline"} size={25} color="#444" style={{ padding: 5 }} />
        </Pressable>
        <Pressable onPress={() => SheetManager.show("noteOptionsActionSheet")} android_ripple={{ color: "#ccc", radius: 30 }}>
          <Icon name="ellipsis-vertical" size={25} color="#444" style={{ padding: 5 }} />
        </Pressable>
      </View>

      <ActionButton iconName='checkmark' onPress={updateNote} style={{ bottom: 50 }} isVisible={formData.text !== note?.text} />
      <NoteOptionsActionSheet {...{ noteId, formData }} />

      {note.reminder?.dateTime && (
        <NoteReminderModal {...{ noteReminderModal, setNoteReminderModal, noteId }} />
      )}
    </View>
  )
}


UpdateNote.sharedElements = route => {
  return [
    {
      id: `note.${route.params.id}`,
      animation: "fade"
    }
  ];
}

export default UpdateNote