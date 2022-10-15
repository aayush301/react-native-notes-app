import { View, Text, TextInput, Pressable, ToastAndroid, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/context';
import theme from '../style/theme';
import { storeData } from '../utils/storage';
import Modal from '../components/Modal';

const LabelsManager = () => {
  const [labelSearchInput, setlabelSearchInput] = useState("");
  const { notes, setNotes, labels, setLabels } = useGlobalContext();

  const [modalLabel, setModalLabel] = useState(null);
  const [editLabelInput, setEditLabelInput] = useState("");

  useEffect(() => {
    if (modalLabel) setEditLabelInput(modalLabel);
  }, [modalLabel]);

  const filteredLabels = labelSearchInput === "" ? labels : labels.filter(label => label.includes(labelSearchInput));

  const createLabel = async () => {
    try {
      if (labelSearchInput === "") return;
      const newLabelsArr = [...labels, labelSearchInput];
      await storeData("labels", newLabelsArr);
      setLabels(newLabelsArr);
      ToastAndroid.show("Label added", ToastAndroid.SHORT);
      setlabelSearchInput("");
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const saveLabel = async () => {
    try {
      if (!editLabelInput) return;
      if (modalLabel === editLabelInput) {
        setModalLabel(null);
        return;
      }

      const newLabelsArr = labels.map(label => {
        if (label !== modalLabel) return label;
        return editLabelInput;
      });
      await storeData("labels", newLabelsArr);
      setLabels(newLabelsArr);

      const newNotesArr = notes.map(note => {
        if (!note.labels) return note;
        note.labels = note.labels.map(label => {
          if (label !== modalLabel) return label;
          return editLabelInput;
        });
        return note;
      });
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);

      ToastAndroid.show("Label changed", ToastAndroid.SHORT);
      setModalLabel(null);
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const deleteLabel = async () => {
    try {
      const newLabelsArr = labels.filter(label => label !== modalLabel);
      await storeData("labels", newLabelsArr);
      setLabels(newLabelsArr);

      const newNotesArr = notes.map(note => {
        if (!note.labels) return note;
        note.labels = note.labels.filter(label => label !== modalLabel);
        return note;
      });
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);

      ToastAndroid.show("Label deleted from all such notes", ToastAndroid.SHORT);
      setModalLabel(null);
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error is there!!");
    }
  }

  return (
    <View style={{ height: '100%' }}>
      <TextInput autoFocus
        value={labelSearchInput}
        onChangeText={text => setlabelSearchInput(text)}
        placeholder='Search or create label...'
        style={{ color: "#666", fontWeight: "500", fontSize: 17, backgroundColor: "white", paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', borderTopColor: "#ddd", borderTopWidth: 1 }}
      />

      <Text style={{ color: "#666", margin: 10 }}>{labels.length} total</Text>

      {labelSearchInput !== "" && !labels.includes(labelSearchInput) && (
        <Pressable onPress={createLabel} style={{ margin: 20 }}>
          <Text style={{ color: theme.PRIMARY_COLOR, fontWeight: "500" }}>+ Create label `{labelSearchInput}`</Text>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 65, }} keyboardShouldPersistTaps="always">
        {filteredLabels.map(label => (
          <Pressable key={label}
            onPress={() => setModalLabel(label)}
            style={{ margin: 10, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 3, backgroundColor: "#0193fe" }}
            android_ripple={{ color: theme.PRIMARY_COLOR, radius: 200 }}
          >
            <Text style={{ color: "white", fontSize: 17 }}> {label} </Text>
          </Pressable>
        ))}
      </ScrollView>



      <Modal visible={modalLabel !== null} onRequestClose={() => setModalLabel(null)}>
        <View style={{ paddingHorizontal: 10, paddingTop: 15, paddingBottom: 10, }}>

          <TextInput
            style={{ marginBottom: 10, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: "#ddd", fontSize: 17, color: "#555" }}
            placeholder='Label..'
            value={editLabelInput}
            onChangeText={text => setEditLabelInput(text)} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Pressable
              disabled={!editLabelInput}
              onPress={saveLabel}
              style={{ paddingHorizontal: 15, paddingVertical: 10 }}
              android_ripple={{ color: "#bbb", radius: 200 }}
            >
              <Text style={{ textAlign: "center", fontSize: 16 }}>Save</Text>
            </Pressable>

            <Pressable
              onPress={deleteLabel}
              style={{ paddingHorizontal: 15, paddingVertical: 10 }}
              android_ripple={{ color: "#bbb", radius: 200 }}
            >
              <Text style={{ textAlign: "center", color: "red", fontSize: 16 }}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default LabelsManager
