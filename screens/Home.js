import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Notes from '../components/Notes'
import AddButton from '../components/AddButton'
import NotesPageHeader from '../components/NotesPageHeader'

const Home = () => {

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(null);
  useEffect(() => {
    if (!isSearchMode) setSearchValue("");
  }, [isSearchMode]);

  return (
    <>
      <NotesPageHeader {...{ selectedNotes, setSelectedNotes, setFilteredNotes, isSearchMode, setIsSearchMode, searchValue, setSearchValue }} />
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Notes {...{ selectedNotes, setSelectedNotes, filteredNotes, isSearchMode, setIsSearchMode, searchValue }} />
        <AddButton />
      </View>
    </>
  )
}

export default Home