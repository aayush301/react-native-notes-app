import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useState } from 'react'
import ActionButton from '../components/ActionButton'
import { useGlobalContext } from '../context/context';
import NoteCardText from '../components/NoteCardText';
import { useNavigation, useRoute } from '@react-navigation/native';
import theme from '../style/theme';
import Icon from 'react-native-vector-icons/Ionicons';


const NoteSelectorCard = ({ note, onPress, isAddedInSelection }) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onPress}
      style={{
        marginBottom: 20, marginHorizontal: 10, borderRadius: 5, backgroundColor: "#fff", borderWidth: 2,
        borderColor: isAddedInSelection ? theme.PRIMARY_COLOR : "#fff"
      }}
      android_ripple={{ color: "#bbb", radius: 200 }}
    >
      {isAddedInSelection && (
        <View style={{ position: "absolute", top: -10, left: -10, width: 20, height: 20, borderRadius: 50, backgroundColor: theme.PRIMARY_COLOR, justifyContent: "center", alignItems: "center" }} >
          <Icon name="checkmark-outline" size={15} color="#fff" style={{ fontWeight: "600" }} />
        </View>
      )}
      <NoteCardText note={note} />
    </Pressable>
  );
}


const NotesSelector = () => {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const { notes } = useGlobalContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { unSelectableNotes = [], onNotesSelected } = route.params;
  const selectableNotes = notes.filter(note => !unSelectableNotes.includes(note.id));

  const handlePress = (id) => {
    if (selectedNotes.includes(id)) {
      setSelectedNotes(selectedNotes.filter(selectedNoteId => selectedNoteId !== id));
    }
    else {
      setSelectedNotes([...selectedNotes, id]);
    }
  }

  const getFlatList = notes => {
    return <FlatList
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: 15, paddingBottom: 200 }}
      data={notes}
      keyExtractor={note => note.id}
      renderItem={({ item: note }) => (
        <NoteSelectorCard
          note={note}
          onPress={() => handlePress(note.id)}
          isAddedInSelection={selectedNotes.includes(note.id)}
        />
      )}
    />
  }

  const onDone = () => {
    onNotesSelected(selectedNotes);
    navigation.goBack();
  }



  return (
    <View style={{ flex: 1 }}>
      <Text style={{ margin: 15, fontSize: 17, fontWeight: '500', color: theme.PRIMARY_COLOR }}>{selectedNotes.length} selected</Text>
      {getFlatList(selectableNotes)}

      <ActionButton iconName="checkmark-outline" onPress={onDone} isVisible={selectedNotes.length > 0} />
    </View>
  )
}

export default NotesSelector