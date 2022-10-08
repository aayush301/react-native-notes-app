import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import scheduleReminderNotification from '../Notifications/scheduleReminderNotification';
import moment from 'moment/moment';
import { useGlobalContext } from '../context/context';
import { storeData } from '../utils/storage';
import { cancelNotification } from '../Notifications/cancelNotification';

const NoteReminderModal = ({ noteReminderModal, setNoteReminderModal, noteId }) => {
  const { notes, setNotes } = useGlobalContext();
  const [dateTimePickerMode, setDateTimePickerMode] = useState(null);
  const [inputDateTime, setInputDateTime] = useState(new Date());
  const note = notes.find(note => note.id === noteId);
  const newOrEditMode = note.reminder?.dateTime ? "edit" : "new";

  useEffect(() => {
    if (!noteReminderModal) return;
    if (newOrEditMode === "edit") {
      setInputDateTime(new Date(note.reminder?.dateTime));
    }
    else {
      setInputDateTime(new Date());
    }
  }, [noteReminderModal, note, newOrEditMode]);


  const onDateTimeInputChange = (e, selectedDate) => {
    const currentDate = selectedDate;
    setDateTimePickerMode(null);
    setInputDateTime(currentDate);
  };

  const setReminderForNote = async () => {
    try {
      const notifId = await scheduleReminderNotification({ note, dateTime: inputDateTime });
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, reminder: { dateTime: inputDateTime, notifId } };
      });
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      setNoteReminderModal(false);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const deleteReminderForNote = async () => {
    try {
      await cancelNotification(note.reminder.notifId);
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, reminder: undefined };
      });
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      setNoteReminderModal(false);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }


  return (
    <>
      <Modal animationType="fade" transparent={true} visible={noteReminderModal} onRequestClose={() => setNoteReminderModal(!noteReminderModal)}>
        <Pressable style={styles.centeredView} onPress={e => e.target == e.currentTarget && setNoteReminderModal(false)}>
          <View style={styles.modalView}>
            <Text style={{ marginVertical: 10, fontSize: 20, color: "#666" }}>Set Reminder</Text>

            <Pressable onPress={() => setDateTimePickerMode("date")} style={{ width: "90%", paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }} android_ripple={{ color: "#bbb", radius: 150 }}>
              <Text>{moment(inputDateTime).format("LL")}</Text>
            </Pressable>

            <Pressable onPress={() => setDateTimePickerMode("time")} style={{ width: "90%", paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }} android_ripple={{ color: "#bbb", radius: 150 }}>
              <Text>{moment(inputDateTime).format("LT")}</Text>
            </Pressable>

            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end", marginTop: 10, marginBottom: 5, paddingRight: 20 }}>
              {newOrEditMode === "edit" && (
                <Pressable onPress={deleteReminderForNote} style={{ padding: 10 }} android_ripple={{ color: "#bbb", radius: 60 }}>
                  <Text style={{ color: "blue", fontSize: 15 }}>Delete</Text>
                </Pressable>
              )}

              <Pressable onPress={() => setNoteReminderModal(false)} style={{ padding: 10 }} android_ripple={{ color: "#bbb", radius: 60 }}>
                <Text style={{ color: "blue", fontSize: 15 }}>Cancel</Text>
              </Pressable>

              <Pressable onPress={setReminderForNote} style={{ padding: 10 }} android_ripple={{ color: "#bbb", radius: 60 }}>
                <Text style={{ color: "blue", fontSize: 15 }}>Set</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {dateTimePickerMode && (
        <RNDateTimePicker
          value={inputDateTime}
          mode={dateTimePickerMode}
          onChange={onDateTimeInputChange}
        />
      )}
    </>
  )
}

export default NoteReminderModal

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    alignItems: "center",
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