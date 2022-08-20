import { Alert, Pressable, Text, TextInput, View, ToastAndroid, Share, StyleSheet, ScrollView, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { storeData } from '../utils/storage';
import { useGlobalContext } from '../context/context';
import Icon from 'react-native-vector-icons/Ionicons';
import { convertToXTimeAgo } from '../utils/dateformat';
import * as Clipboard from 'expo-clipboard';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import SaveButton from '../components/SaveButton';

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

  useEffect(() => {
    const backAction = () => {
      if (formData.text === "" || formData.text === note.text) return false;
      Alert.alert("Your changes have not been saved.", "Do you want to save it?", [{ text: "Yes", onPress: updateNote }, { text: "No", onPress: navigation.goBack }], { cancelable: true });
      return true;
    }
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [formData, navigation, updateNote, note.text]);



  const noteColors = ["white", "lightseagreen", "skyblue", "lightcoral", "lightpink", "lightgreen", "lightblue", "orange", "palegreen"];


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


  const onDeleteConfirm = async () => {
    try {
      const newNotesArr = notes.filter(note => note.id !== noteId);
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      navigation.navigate("Home");
      ToastAndroid.show("Note deleted successfully", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const handleDeleteNoteRequest = () => {
    Alert.alert("Are you sure you want to delete?", "This will delete this note.", [{ text: "Cancel" }, { text: "OK", onPress: onDeleteConfirm }], { cancelable: true });
  }

  const shareNote = async () => {
    await Share.share({ message: formData.text });
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(formData.text);
    ToastAndroid.show("Note's text copied", ToastAndroid.SHORT);
  };

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

  const togglePin = async () => {
    try {
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, isPinned: !note.isPinned };
      })
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const cloneNote = async () => {
    try {
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
      ToastAndroid.show("Note cloned successfully", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const changeNoteColor = async color => {
    try {
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, color };
      })
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
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

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ddd", paddingVertical: 4, paddingHorizontal: 15 }}>
        <Text style={{ color: "#444" }}>Edited {updatedAt}</Text>
        <Pressable onPress={toggleBookmark} android_ripple={{ color: "#ccc", radius: 30 }}>
          <Icon name={note.isBookmarked ? "bookmark" : "bookmark-outline"} size={25} color="#444" style={{ padding: 5 }} />
        </Pressable>
        <Pressable onPress={() => SheetManager.show("mysheet")} android_ripple={{ color: "#ccc", radius: 30 }}>
          <Icon name="ellipsis-vertical" size={25} color="#444" style={{ padding: 5 }} />
        </Pressable>
      </View>


      <SaveButton onPress={updateNote} bottom={50} />

      <ActionSheet id="mysheet" defaultOverlayOpacity={0.1} openAnimationSpeed={50} gestureEnabled indicatorStyle={{ height: 5 }}>
        <View>
          <ScrollView horizontal contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5, borderBottomColor: "#eee", borderBottomWidth: 1 }}>
            {noteColors.map(color => (
              <Pressable onPress={() => changeNoteColor(color)} key={color} style={{ marginHorizontal: 5, borderRadius: 50, width: 35, height: 35, backgroundColor: color, justifyContent: "center", alignItems: "center", ...(color === "white" && { borderWidth: 1, borderColor: "#eee" }) }}>
                {note.color === color && (
                  <Icon name="checkmark" size={25} color="black" />
                )}
              </Pressable>
            ))}
          </ScrollView>

          {[
            { onPress: copyToClipboard, iconName: "clipboard-outline", title: "Copy to Clipboard" },
            { onPress: shareNote, iconName: "share-social-outline", title: "Share" },
            { onPress: handleDeleteNoteRequest, iconName: "trash-outline", title: "Delete" },
            { onPress: cloneNote, iconName: "copy-outline", title: "Make a copy" },
            { onPress: togglePin, iconName: note.isPinned ? "pin" : "pin-outline", title: note.isPinned ? "Unpin" : "Pin" },
          ]
            .map(({ onPress, iconName, title }) => (
              <Pressable key={title} onPress={onPress} style={styles.sheetItem} android_ripple={{ color: "#999", radius: 200 }}>
                <Icon name={iconName} size={25} color="gray" style={{ marginRight: 15 }} />
                <Text color="gray">{title}</Text>
              </Pressable>
            ))}
        </View>
      </ActionSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  }
});

export default UpdateNote