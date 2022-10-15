import { View, Text, Alert, ToastAndroid, ScrollView, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { getData, storeData } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../style/theme';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { convertToXTimeAgo } from '../utils/dateformat';
import { useGlobalContext } from '../context/context';
import Modal from '../components/Modal';


const TrashNoteCard = ({ note, setNoteModalId }) => {
  return (
    <Pressable
      onPress={() => setNoteModalId(note.id)}
      android_ripple={{ color: "#bbb", radius: 200 }}
      style={styles.noteCard}
      delayLongPress={100}
    >
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
          {note.color && (
            <View style={{ marginHorizontal: 5, borderRadius: 500, width: 10, height: 10, backgroundColor: note.color }}></View>
          )}
          <Text style={{ flex: 1, color: "#999", fontSize: 13 }}>{convertToXTimeAgo(note.updatedAt)}</Text>
          {note.isBookmarked && (
            <Icon name={"bookmark"} size={17} color="#888" style={{ marginHorizontal: 5 }} />
          )}
          {note.isPinned && (
            <Icon name={"pin"} size={17} color="#888" style={{ marginHorizontal: 5 }} />
          )}
        </View>

        {note.labels.length > 0 && (
          <ScrollView horizontal contentContainerStyle={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
            {note.labels?.map(label => (
              <Text key={label} style={{ marginRight: 10, padding: 5, backgroundColor: "#eee", color: "#666", borderRadius: 3, fontSize: 13 }}>{label}</Text>
            ))}
          </ScrollView>
        )}

        {note.reminder?.dateTime && (
          <Text>+ Reminder</Text>
        )}

        <Text numberOfLines={5} style={{ color: "#555", fontSize: 15, marginTop: 10 }}> {note.text} </Text>
      </View>
    </Pressable>
  );
}


const Trash = () => {
  const [trashNotes, setTrashNotes] = useState([]);
  const { notes, setNotes } = useGlobalContext();
  const [noteModalId, setNoteModalId] = useState(null);

  useFocusEffect(useCallback(() => {
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
  }, []));

  const deleteNotePermanently = async noteId => {
    try {
      const newTrashNotesArr = trashNotes.filter(trashNote => trashNote.id !== noteId);
      await storeData("trashNotes", newTrashNotesArr);
      setTrashNotes(newTrashNotesArr);
      setNoteModalId(null);
      ToastAndroid.show("Note permanently deleted", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const emptyTrash = async () => {
    try {
      await storeData("trashNotes", []);
      setTrashNotes([]);
      ToastAndroid.show("Trash is empty now", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const handleEmptyTrashRequest = () => {
    Alert.alert(
      "Are you sure you want to empty the trash?", "You won't be able to restore these notes later.",
      [{ text: "Cancel" }, { text: "OK", onPress: emptyTrash }],
      { cancelable: true }
    );
  }


  const restoreNote = async noteId => {
    try {
      const note = trashNotes.find(note => note.id === noteId);
      const newNotesArr = [...notes, note];
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);

      const newTrashNotesArr = trashNotes.filter(trashNote => trashNote.id !== noteId);
      await storeData("trashNotes", newTrashNotesArr);
      setTrashNotes(newTrashNotesArr);
      setNoteModalId(null);
      ToastAndroid.show("Note restored", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const restoreAllNotes = async () => {
    try {
      const newNotesArr = [...notes, ...trashNotes];
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      await storeData("trashNotes", []);
      setTrashNotes([]);
      ToastAndroid.show("All notes restored", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const handleRestoreRequest = () => {
    Alert.alert(
      "Restore all notes", null,
      [{ text: "Cancel" }, { text: "OK", onPress: restoreAllNotes }],
      { cancelable: true }
    );
  }


  return (
    <View>
      {trashNotes.length === 0 && (
        <View style={{ marginTop: 200, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 16 }}>
            Trash is empty
          </Text>
        </View>
      )}

      {trashNotes.length > 0 && (
        <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, marginHorizontal: 20 }}>
            <Text style={{ color: theme.PRIMARY_COLOR, fontWeight: "600", fontSize: 15 }}>{trashNotes.length} note{trashNotes.length > 1 && 's'} in trash</Text>
            <Pressable
              onPress={handleRestoreRequest}
              style={{ marginLeft: "auto", backgroundColor: "#ddd", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 3 }}
              android_ripple={{ color: "#bbb", radius: 200 }}
            >
              <Text>Restore</Text>
            </Pressable>
            <Pressable
              onPress={handleEmptyTrashRequest}
              style={{ marginLeft: 5, backgroundColor: "#cc0000", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 3 }}
              android_ripple={{ color: "#ff0000", radius: 200 }}
            >
              <Text style={{ color: "white" }}>Empty</Text>
            </Pressable>
          </View>

          <FlatList
            contentContainerStyle={{ paddingBottom: 200 }}
            data={trashNotes}
            keyExtractor={note => note.id}
            renderItem={({ item: note }) => <TrashNoteCard {...{ note, setNoteModalId }} />}
          />
        </>

      )}

      <Modal visible={noteModalId !== null} onRequestClose={() => setNoteModalId(null)}>
        <View>
          <Pressable
            onPress={() => restoreNote(noteModalId)}
            style={{ paddingVertical: 10 }}
            android_ripple={{ color: "#bbb", radius: 200 }}>
            <Text style={{ color: "blue", textAlign: "center" }}>Restore</Text>
          </Pressable>

          <Pressable
            onPress={() => deleteNotePermanently(noteModalId)}
            style={{ paddingVertical: 10 }}
            android_ripple={{ color: "#bbb", radius: 200 }}>
            <Text style={{ color: "red", textAlign: "center" }}>Delete permanently</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  )
}

export default Trash

const styles = StyleSheet.create({
  noteCard: {
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 3,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#e4e4e4",
  }
})