import { View, Text, StyleSheet, ScrollView, Pressable, ToastAndroid, Alert, Share } from 'react-native'
import React, { useState } from 'react'
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Icon from 'react-native-vector-icons/Ionicons';
import { storeData } from '../utils/storage';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/context';
import NoteReminderModal from './NoteReminderModal';

const NoteOptionsActionSheet = ({ noteId, formData }) => {
  const navigation = useNavigation();
  const { notes, setNotes } = useGlobalContext();
  const [noteReminderModal, setNoteReminderModal] = useState(false);

  const note = notes.find(note => note.id === noteId);
  const noteColors = ["white", "lightseagreen", "skyblue", "lightcoral", "lightpink", "lightgreen", "lightblue", "orange", "palegreen"];

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

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(formData.text);
    ToastAndroid.show("Note's text copied", ToastAndroid.SHORT);
  }

  const shareNote = async () => {
    await Share.share({ message: formData.text });
  }

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

  const cloneNote = async () => {
    try {
      const newNote = {
        id: Math.floor(Math.random() * 10000),
        text: formData.text,
        createdAt: new Date(),
        updatedAt: new Date(),
        labels: note.labels
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

  const showAddReminderModal = () => {
    SheetManager.hide("noteOptionsActionSheet");
    setNoteReminderModal(true);
  }



  return (
    <>
      <ActionSheet containerStyle={{ padding: 0 }} id="noteOptionsActionSheet" useBottomSafeAreaPadding={false} defaultOverlayOpacity={0.1} openAnimationConfig={{ friction: 20 }} gestureEnabled indicatorStyle={{ height: 5 }}>
        <View>
          <ScrollView horizontal contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}>
            {noteColors.map(color => (
              <Pressable onPress={() => changeNoteColor(color)} key={color} style={{ marginHorizontal: 5, borderRadius: 50, width: 35, height: 35, backgroundColor: color, justifyContent: "center", alignItems: "center", ...(color === "white" && { borderWidth: 1, borderColor: "#eee" }) }}>
                {note.color === color && (
                  <Icon name="checkmark" size={25} color="black" />
                )}
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ borderColor: "#eee", borderBottomWidth: 1 }} />

          <ScrollView horizontal contentContainerStyle={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 5, paddingVertical: 10 }}>
            {note.labels?.map(label => (
              <Text key={label} style={{ margin: 5, padding: 5, backgroundColor: "#eee", color: "#666", borderRadius: 3, fontSize: 15 }}>{label}</Text>
            ))}
            <Pressable onPress={() => { SheetManager.hide("noteOptionsActionSheet"); navigation.navigate("NoteLabels", { noteId }); }} style={{ marginLeft: 14, backgroundColor: "#eee", paddingVertical: 5, paddingHorizontal: 8, borderRadius: 3 }} android_ripple={{ color: "#bbb", radius: 200 }} >
              <Text style={{ fontWeight: "500", color: "#666", fontSize: 15 }}>+ Manage labels</Text>
            </Pressable>
          </ScrollView>

          <View style={{ borderColor: "#eee", borderBottomWidth: 1 }} />

          {[
            { onPress: copyToClipboard, iconName: "clipboard-outline", title: "Copy to Clipboard" },
            { onPress: shareNote, iconName: "share-social-outline", title: "Share" },
            { onPress: handleDeleteNoteRequest, iconName: "trash-outline", title: "Delete" },
            { onPress: cloneNote, iconName: "copy-outline", title: "Make a copy" },
            { onPress: togglePin, iconName: note.isPinned ? "pin" : "pin-outline", title: note.isPinned ? "Unpin" : "Pin" },
            { onPress: showAddReminderModal, iconName: "alarm-outline", title: "Add a reminder" },
          ]
            .map(({ onPress, iconName, title }) => (
              <Pressable key={title} onPress={onPress} style={styles.sheetItem} android_ripple={{ color: "#999", radius: 200 }}>
                <Icon name={iconName} size={25} color="gray" style={{ marginRight: 15 }} />
                <Text color="gray">{title}</Text>
              </Pressable>
            ))}
        </View>
      </ActionSheet>

      <NoteReminderModal {...{ noteReminderModal, setNoteReminderModal, noteId }} />
    </>
  )
}

export default NoteOptionsActionSheet

const styles = StyleSheet.create({
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  }
});
