import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Notes from '../components/Notes'
import ActionButton from '../components/ActionButton'
import NotesPageHeader from '../components/NotesPageHeader'
import { useNavigation } from '@react-navigation/native'

const Home = () => {

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    if (!isSearchMode) setSearchValue("");
  }, [isSearchMode]);

  return (
    <>
      <NotesPageHeader {...{ selectedNotes, setSelectedNotes, setFilteredNotes, isSearchMode, setIsSearchMode, searchValue, setSearchValue }} />
      <View style={{ flex: 1 }}>
        <Notes {...{ selectedNotes, setSelectedNotes, filteredNotes, isSearchMode, setIsSearchMode, searchValue }} />
        <ActionButton onPress={() => navigation.navigate("AddNote")} />
      </View>
    </>
  )
}

export default Home