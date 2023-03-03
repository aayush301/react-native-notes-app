import { View, Text, Alert, ActivityIndicator, FlatList, Pressable, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getData, storeData } from '../utils/storage';
import theme from '../style/theme';
import NoteCard from '../components/NoteCard';
import ActionButton from '../components/ActionButton';
import { useGlobalContext } from '../context/context';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/Ionicons';

const FolderNotes = () => {
  const [folder, setFolder] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { folderId } = route.params;
  const [loading, setLoading] = useState(true);
  const { notes } = useGlobalContext();
  const [folderNameEditMode, setFolderNameEditMode] = useState(false);
  const [folderNameEditInput, setFolderNameEditInput] = useState('');
  const folderNameRef = useRef(null);

  useEffect(() => {
    setFolderNameEditInput(folder.name);
  }, [folder]);

  const fetchFolderWithNotes = useCallback(async () => {
    try {
      const folders = await getData("folders");
      const folder = folders.find(folder => folder.id === folderId);
      folder.notes = folder.notes.map(noteId => notes.find(note => note.id === noteId));
      setFolder(folder);
      setFolderNameEditInput(folder.name);
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Folder couldn't be fetched");
    }
  }, [folderId, notes]);


  useEffect(() => {
    fetchFolderWithNotes();
  }, [fetchFolderWithNotes]);

  const handlePress = (noteId) => {
    navigation.navigate("UpdateNote", { id: noteId });
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


  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);

  const handleFolderNameFocus = () => {
    setFolderNameEditMode(true);
  }

  const handleBackClick = () => {
    if (folderNameEditMode) {
      setFolderNameEditInput(folder.name);
      setFolderNameEditMode(false);
    }
    else {
      navigation.goBack();
    }
  }

  const changeFolderName = async () => {
    try {
      if (folderNameEditInput === folder.name) return;
      const folders = await getData("folders");
      const newFoldersArr = folders.map(folder => {
        if (folder.id !== folderId) return folder;
        return { ...folder, name: folderNameEditInput };
      });
      await storeData("folders", newFoldersArr);
      setFolderNameEditMode(false);
      setFolder({ ...folder, name: folderNameEditInput });
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Couldn't change folder name");
    }
  }

  useEffect(() => {
    if (folderNameEditMode === false) folderNameRef?.current?.blur();
  }, [folderNameEditMode]);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      {/* Header */}
      <View style={{ height: headerHeight, paddingTop: insets.top, flexDirection: "row", alignItems: "center", backgroundColor: "white", borderBottomWidth: 2, borderBottomColor: "#eee" }}>
        <Pressable style={{ margin: 10, width: 40, height: 40, justifyContent: "center", alignItems: "center" }} onPress={handleBackClick} android_ripple={{ color: "#ccc", radius: 20 }}>
          <Icon name="arrow-back" size={22} color="#888" />
        </Pressable>

        <TextInput
          ref={folderNameRef}
          style={{ flex: 1, fontSize: 17, color: "#666" }}
          placeholder='Folder name...'
          value={folderNameEditInput}
          onChangeText={value => setFolderNameEditInput(value)}
          onFocus={handleFolderNameFocus}
          onSubmitEditing={changeFolderName}
        />
        {folderNameEditMode && (
          <Pressable style={{ margin: 10, width: 40, height: 40, justifyContent: "center", alignItems: "center" }} disabled={folderNameEditInput === ""} onPress={changeFolderName} android_ripple={{ color: "#ccc", radius: 20 }}>
            <Icon name="checkmark-outline" size={22} color="#555" />
          </Pressable>
        )}
      </View>


      {/* Body */}
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
    </View>
  )
}

export default FolderNotes