import { View, Text, StyleSheet, ScrollView, Pressable, ToastAndroid, Alert, Share } from 'react-native'
import React, { useState } from 'react'
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Icon from 'react-native-vector-icons/Ionicons';
import { getData, storeData } from '../utils/storage';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/context';
import NoteReminderModal from './NoteReminderModal';
import { addMessage } from '@ouroboros/react-native-snackbar';

const NoteOptionsActionSheet = ({ noteId, formData }) => {
  const navigation = useNavigation();
  const { notes, setNotes } = useGlobalContext();
  const [noteReminderModal, setNoteReminderModal] = useState(false);

  const note = notes.find(note => note.id === noteId);
  const noteColors = ["lightseagreen", "skyblue", "lightcoral", "lightpink", "lightgreen", "lightblue", "orange", "palegreen"];
  const newOrEditMode = note.reminder?.dateTime ? "edit" : "new";

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

  const restoreNote = async () => {
    try {
      const trashNotes = await getData("trashNotes");
      const note = trashNotes.find(note => note.id === noteId);
      const newNotesArr = [...notes];
      await storeData("notes", newNotesArr);

      const newTrashNotesArr = trashNotes.filter(trashNote => trashNote.id !== note.id);
      await storeData("trashNotes", newTrashNotesArr);
      setNotes(newNotesArr);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }


  const moveNoteToTrash = async () => {
    try {
      const trashNotes = (await getData("trashNotes")) || [];
      const newTrashNotesArr = [...trashNotes, note];
      await storeData("trashNotes", newTrashNotesArr);

      const newNotesArr = notes.filter(note => note.id !== noteId);
      await storeData("notes", newNotesArr);
      navigation.navigate("Home");
      setNotes(newNotesArr);

      addMessage({
        text: "Note moved to trash",
        duration: 5000,
        action: {
          text: "Undo",
          onPress: restoreNote
        }
      });

    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }


  const cloneNote = async () => {
    try {
      const newNote = {
        ...note,
        id: Math.floor(Math.random() * 10000),
        text: formData.text,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      <ActionSheet containerStyle={{ padding: 0 }} id="noteOptionsActionSheet" useBottomSafeAreaPadding={false} defaultOverlayOpacity={0.1} openAnimationConfig={{ friction: 20, tension: 250 }} gestureEnabled indicatorStyle={{ height: 5 }}>
        <View>

          {/* Colors */}
          <ScrollView horizontal contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}>
            <Pressable onPress={() => changeNoteColor(null)} style={{ marginHorizontal: 5, borderRadius: 50, width: 35, height: 35, backgroundColor: "white", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "black" }}>
              <View style={{ position: "absolute", height: "100%", width: 1, backgroundColor: "black", transform: [{ rotate: "-30deg" }] }}></View>
              {!note.color && (
                <Icon name="checkmark" size={25} color="black" />
              )}
            </Pressable>

            {noteColors.map(color => (
              <Pressable onPress={() => changeNoteColor(color)} key={color} style={{ marginHorizontal: 5, borderRadius: 50, width: 35, height: 35, backgroundColor: color, justifyContent: "center", alignItems: "center" }}>
                {note.color === color && (
                  <Icon name="checkmark" size={25} color="black" />
                )}
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ borderColor: "#eee", borderBottomWidth: 1 }} />

          {/* Labels */}
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
            { onPress: moveNoteToTrash, iconName: "trash-outline", title: "Delete" },
            { onPress: cloneNote, iconName: "copy-outline", title: "Make a copy" },
            { onPress: togglePin, iconName: note.isPinned ? "pin" : "pin-outline", title: note.isPinned ? "Unpin" : "Pin" },
            { onPress: showAddReminderModal, iconName: "alarm-outline", title: newOrEditMode === "edit" ? "Edit reminder" : "Add a reminder" },
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
