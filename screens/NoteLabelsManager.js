import { View, Text, TextInput, Pressable, Alert, ToastAndroid, BackHandler, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import theme from '../style/theme';
import { useGlobalContext } from '../context/context';
import { storeData } from '../utils/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import ActionButton from '../components/ActionButton';

const NoteLabelsManager = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const { notes, setNotes, labels, setLabels } = useGlobalContext();
  const [labelInput, setlabelInput] = useState("");

  const noteId = route.params.noteId;
  const note = notes.find(note => note.id === noteId);
  const [tempMarkedLabels, setTempMarkedLabels] = useState(note.labels);

  useEffect(() => {
    setTempMarkedLabels(note.labels);
  }, [note.labels]);

  const filteredLabels = labelInput === "" ? labels : labels.filter(label => label.includes(labelInput));
  const reorderedLabels = [...filteredLabels.filter(label => note.labels.includes(label)), ...filteredLabels.filter(label => !note.labels.includes(label))];


  const areLabelsModified = (() => {
    if (tempMarkedLabels.length !== note.labels.length) return true;
    return tempMarkedLabels.some(tempMarkedLabel => !note.labels.includes(tempMarkedLabel));
  })();


  useEffect(() => {
    const backAction = () => {
      if (!areLabelsModified) return false;
      Alert.alert("Discard changes", "", [{ text: "Cancel" }, { text: "Discard", onPress: navigation.goBack }], { cancelable: true });
      return true;
    }
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [areLabelsModified, navigation]);



  const handleLabelInputChange = (text) => {
    setlabelInput(text);
  }


  const createAndAddLabel = async () => {
    try {
      if (labelInput === "") return;
      const newLabelsArr = [...labels, labelInput];
      await storeData("labels", newLabelsArr);
      setLabels(newLabelsArr);

      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, labels: [...(note.labels || []), labelInput] };
      });
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      ToastAndroid.show("Label added", ToastAndroid.SHORT);
      setlabelInput("");
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error is there!!");
    }
  }


  const changeLabelsOfNote = async () => {
    try {
      const newNotesArr = notes.map(note => {
        if (note.id !== noteId) return note;
        return { ...note, labels: tempMarkedLabels };
      });
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      setlabelInput("");
      navigation.goBack();
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error is there!!");
    }
  }


  const toggleTempLabelForNote = label => {
    if (tempMarkedLabels.includes(label)) setTempMarkedLabels(tempMarkedLabels.filter(tempLabel => tempLabel !== label));
    else setTempMarkedLabels([...tempMarkedLabels, label]);
  }


  return (
    <View style={{ height: '100%' }}>
      <TextInput autoFocus value={labelInput} onChangeText={handleLabelInputChange} placeholder='Search or create label...' style={{ color: "#666", fontWeight: "500", fontSize: 17, backgroundColor: "white", paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', }} />

      <Text style={{ color: "#666", margin: 10 }}>{labels.length} total, {tempMarkedLabels.length} selected</Text>

      {labelInput !== "" && !labels.includes(labelInput) && (
        <Pressable onPress={createAndAddLabel} style={{ margin: 20 }}>
          <Text style={{ color: theme.PRIMARY_COLOR, fontWeight: "500" }}>+ Create and add label `{labelInput}`</Text>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 65, flexDirection: "row", flexWrap: "wrap" }} keyboardShouldPersistTaps="always">
        {reorderedLabels.map(label => (
          <Pressable key={label}
            onPress={() => toggleTempLabelForNote(label)}
            style={{ margin: 10, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 3, backgroundColor: tempMarkedLabels.includes(label) ? "#0193fe" : "#dff6ff" }}
            android_ripple={{ color: theme.PRIMARY_COLOR, radius: 200 }}
          >
            <Text style={{ color: tempMarkedLabels.includes(label) ? "white" : theme.PRIMARY_COLOR, fontSize: 17 }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ActionButton iconName="checkmark-circle" onPress={changeLabelsOfNote} isVisible={areLabelsModified} />
    </View>
  )
}

export default NoteLabelsManager
