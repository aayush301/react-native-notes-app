import { View, Text, Alert, ActivityIndicator, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getData, storeData } from '../utils/storage';
import theme from '../style/theme';
import NoteCard from '../components/NoteCard';
import ActionButton from '../components/ActionButton';
import { useGlobalContext } from '../context/context';

const FolderNotes = () => {
  const [folder, setFolder] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { folderId } = route.params;
  const [loading, setLoading] = useState(true);
  const { notes } = useGlobalContext();

  const fetchFolderWithNotes = useCallback(async () => {
    try {
      const folders = await getData("folders");
      const folder = folders.find(folder => folder.id === folderId);
      folder.notes = folder.notes.map(noteId => notes.find(note => note.id === noteId));
      setFolder(folder);
      navigation.setOptions({ title: folder.name });
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Folder couldn't be fetched");
    }
  }, [folderId, navigation, notes]);

  useEffect(() => {
    fetchFolderWithNotes();
  }, [fetchFolderWithNotes]);

  const handlePress = (noteId) => {
    navigation.navigate("UpdateNote", { noteId });
  }


  const getFlatList = folderNotes => {
    return <FlatList
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: 5, paddingBottom: 200 }}
      data={folderNotes}
      keyExtractor={note => note.id}
      renderItem={({ item: note }) => <NoteCard {...{ note, onPress: () => handlePress(note.id) }} />}
    />
  }

  const onNotesSelected = async selectedNotes => {
    try {
      setLoading(true);
      const folders = await getData("folders");
      const newFoldersArr = folders.map(folder => {
        if (folder.id !== folderId) return folder;
        return { ...folder, notes: selectedNotes };
      });
      await storeData("folders", newFoldersArr);
      fetchFolderWithNotes();
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Notes couldn't be added into folder");
    }
  }


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>

      {folder.notes.length === 0 && (
        <View style={{ marginTop: 200, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 16, color: "#555", paddingHorizontal: 20, textAlign: "center" }}>
            No notes in this folder.. {"\n\n"} Tap + icon to add notes in this folder
          </Text>
        </View>
      )}

      {folder.notes.length > 0 && (
        <>
          <Text style={{ color: theme.PRIMARY_COLOR, fontWeight: "600", fontSize: 15, paddingHorizontal: 10, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#efefef" }}>{folder.notes.length} note{folder.notes.length > 1 && 's'}</Text>
          {getFlatList(folder.notes)}
        </>
      )}

      <ActionButton onPress={() => navigation.navigate("NotesSelector", { onNotesSelected, unSelectableNotes: folder.notes.map(note => note.id) })} />
    </View>
  )
}

export default FolderNotes