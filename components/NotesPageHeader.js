import { View, Text, Pressable, Alert, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobalContext } from '../context/context';
import { storeData } from '../utils/storage';
import theme from '../style/theme';

const NotesPageHeader = ({ selectedNotes, setSelectedNotes, setFilteredNotes, isSearchMode, setIsSearchMode, searchValue, setSearchValue }) => {
  const { notes, setNotes } = useGlobalContext();

  // useFocusEffect(useCallback(() => {
  //   return () => setIsSearchMode(false);
  // }, [setIsSearchMode]));

  useEffect(() => {
    if (searchValue === "") setFilteredNotes(null);
    else setFilteredNotes(notes.filter(note => note.text.toLowerCase().includes(searchValue.toLowerCase())));
  }, [searchValue, notes, setFilteredNotes]);

  const handleDeleteMany = async () => {
    try {
      const newNotesArr = notes.filter(note => !selectedNotes.includes(note.id));
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
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
    <View style={{ height: 90, paddingTop: 30, backgroundColor: !isSearchMode ? theme.PRIMARY_COLOR : "white", justifyContent: "center" }}>

      {!isSearchMode ? (
        <>
          {selectedNotes.length == 0 ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 5 }}>
              <Text style={{ color: "white", fontSize: 20 }}>Notes</Text>
              <Pressable style={{ padding: 5 }} onPress={handleSearchBtnClick}>
                <Icon name="search" size={20} color="white" />
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5 }}>
              <Pressable style={{ padding: 5 }} onPress={handleCloseSelection} android_ripple={{ color: "#ccc", radius: 15 }}>
                <Icon name="chevron-back" size={20} color="white" />
              </Pressable>
              <Text style={{ marginLeft: 5, color: "white", fontSize: 18 }}>{selectedNotes.length} selected</Text>
              <Pressable style={{ marginLeft: "auto", padding: 5 }} onPress={handleDeleteMany} android_ripple={{ color: "#ccc", radius: 15 }}>
                <Icon name="trash" size={20} color="white" />
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