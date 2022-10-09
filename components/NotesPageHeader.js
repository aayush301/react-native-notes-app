import { View, Text, Pressable, Alert, TextInput, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobalContext } from '../context/context';
import { getData, storeData } from '../utils/storage';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const NotesPageHeader = ({ selectedNotes, setSelectedNotes, setFilteredNotes, isSearchMode, setIsSearchMode, searchValue, setSearchValue }) => {

  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);
  const { notes, setNotes } = useGlobalContext();
  const navigation = useNavigation();

  // useFocusEffect(useCallback(() => {
  //   return () => setIsSearchMode(false);
  // }, [setIsSearchMode]));

  useEffect(() => {
    if (searchValue === "") setFilteredNotes(null);
    else setFilteredNotes(notes.filter(note => note.text.toLowerCase().includes(searchValue.toLowerCase())));
  }, [searchValue, notes, setFilteredNotes]);

  const handleDeleteMany = async () => {
    try {
      const notesToTrash = selectedNotes.map(selectedId => notes.find(note => note.id === selectedId));
      const trashNotes = (await getData("trashNotes")) || [];
      const newTrashNotesArr = [...trashNotes, ...notesToTrash];
      await storeData("trashNotes", newTrashNotesArr);

      const newNotesArr = notes.filter(note => !selectedNotes.includes(note.id));
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      ToastAndroid.show("Note moved to trash", ToastAndroid.SHORT);
    }
    catch (err) {
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const handleCloseSelection = () => {
    setSelectedNotes([]);
  }

  const handleSearchBtnClick = () => {
    setIsSearchMode(true);
  }

  const handleCloseSearch = () => {
    setIsSearchMode(false);
  }

  const handleTextChange = (text) => {
    setSearchValue(text);
  }


  return (
    <View style={{ height: headerHeight, paddingTop: insets.top, justifyContent: "center", backgroundColor: "white", borderBottomWidth: 2, borderBottomColor: "#eee" }}>

      {!isSearchMode ? (
        <>
          {selectedNotes.length == 0 ? (
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 5 }}>
              <Pressable style={{ padding: 5, marginRight: 5 }} onPress={() => navigation.openDrawer()}>
                <Icon name="menu-outline" size={24} />
              </Pressable>
              <Text style={{ fontSize: 20, color: "#333" }}>Notes</Text>
              <Pressable style={{ margin: 10, marginRight: 0, width: 40, height: 40, padding: 5, marginLeft: "auto", justifyContent: "center", alignItems: "center" }} onPress={handleSearchBtnClick} android_ripple={{ color: "#ccc", radius: 20 }}>
                <Icon name="search" size={20} color="#888" />
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5 }}>
              <Pressable style={{ padding: 5 }} onPress={handleCloseSelection} android_ripple={{ color: "#ccc", radius: 15 }}>
                <Icon name="chevron-back" size={20} color="#888" />
              </Pressable>
              <Text style={{ marginLeft: 5, color: "#333", fontSize: 18 }}>{selectedNotes.length} selected</Text>
              <Pressable style={{ marginLeft: "auto", padding: 5 }} onPress={handleDeleteMany} android_ripple={{ color: "#ccc", radius: 15 }}>
                <Icon name="trash" size={20} color="#888" />
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <View style={{ height: "100%", flexDirection: "row", alignItems: "center", paddingTop: 5, borderBottomColor: "#ddd", borderBottomWidth: 0.5 }}>
          <Pressable style={{ margin: 10, width: 40, height: 40, justifyContent: "center", alignItems: "center" }} onPress={handleCloseSearch} android_ripple={{ color: "#ccc", radius: 20 }}>
            <Icon name="arrow-back" size={22} color="#888" />
          </Pressable>
          <TextInput value={searchValue} onChangeText={handleTextChange} autoFocus style={{ flex: 1, height: "100%", fontSize: 16 }} placeholder="Search..." />
          <Pressable style={{ margin: 10, width: 40, height: 40, justifyContent: "center", alignItems: "center" }} onPress={() => setSearchValue("")} android_ripple={{ color: "#ccc", radius: 20 }}>
            <Icon name="close" size={22} color="#888" />
          </Pressable>
        </View>
      )}

    </View>
  )
}

export default NotesPageHeader