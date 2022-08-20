import { BackHandler, FlatList, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/context';
import theme from '../style/theme';
import { useEffect } from 'react';
import React from 'react';
import NoteCard from './NoteCard';


const Notes = ({ selectedNotes, setSelectedNotes, filteredNotes, isSearchMode, setIsSearchMode, searchValue }) => {
  const { notes } = useGlobalContext();
  const navigation = useNavigation();

  useEffect(() => {
    setSelectedNotes([]);
  }, [notes, setSelectedNotes]);


  useEffect(() => {
    const backAction = () => {
      if (selectedNotes.length > 0) {
        setSelectedNotes([]);
        return true;
      }
      if (isSearchMode) {
        setIsSearchMode(false);
        return true;
      }
      return false;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [selectedNotes, setSelectedNotes, isSearchMode, setIsSearchMode]);


  const handlePress = (id) => {
    if (selectedNotes.length == 0) {
      navigation.navigate("UpdateNote", { id });
    }
    else {
      if (selectedNotes.includes(id)) {
        setSelectedNotes(selectedNotes.filter(selectedNoteId => selectedNoteId !== id));
      }
      else {
        setSelectedNotes([...selectedNotes, id]);
      }
    }
  }

  const handleLongPress = (id) => {
    if (selectedNotes.includes(id)) return;
    setSelectedNotes([...selectedNotes, id]);
  }



  const getFlatList = notes => {
    const notesCopy = [...notes.filter(note => note.isPinned), ...notes.filter(note => !note.isPinned)];
    return <FlatList
      keyboardShouldPersistTaps="handled"
      data={notesCopy}
      keyExtractor={note => note.id}
      renderItem={({ item: note }) => <NoteCard note={note} {...{ handlePress, handleLongPress }} isAddedInSelection={selectedNotes.includes(note.id)} />}
    />
  }


  return (
    <View>
      {notes.length === 0 ? (
        <View style={{ marginTop: 200, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 16 }}>
            No note.. Tap + icon to add new note
          </Text>
        </View>
      ) : (

        <View>
          {searchValue === "" || filteredNotes === null ? (
            <>
              <Text style={{ color: theme.PRIMARY_COLOR, paddingHorizontal: 10, paddingVertical: 20 }}>{notes.length} note{notes.length > 1 && 's'}</Text>
              {getFlatList(notes)}
            </>
          ) : filteredNotes.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18, color: "#888" }}>No note found..</Text>
          ) : (
            <>
              <Text style={{ color: theme.PRIMARY_COLOR, paddingHorizontal: 10, paddingVertical: 20 }}>{filteredNotes.length} note{filteredNotes.length > 1 && 's'} found</Text>
              {getFlatList(filteredNotes)}
            </>
          )}
        </View>

      )}
    </View>
  )
}

export default Notes