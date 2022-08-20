import { Text, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import theme from '../style/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const NoteCard = ({ note, handlePress, handleLongPress, isAddedInSelection = false }) => {
  return (
    <Pressable
      onPress={() => handlePress(note.id)}
      onLongPress={() => handleLongPress(note.id)}
      android_ripple={{ color: "#bbb", radius: 200 }}
      style={styles({ isAddedInSelection, noteColor: note.color }).noteCard}
    >
      <View style={{ flexDirection: "row" }}>
        {note.isBookmarked && (
          <Icon name={"bookmark"} size={17} color="#444" style={{ padding: 5 }} />
        )}
        {note.isPinned && (
          <Icon name={"pin"} size={17} color="#444" style={{ padding: 5 }} />
        )}
      </View>
      <Text numberOfLines={5} style={{ color: "#222", fontSize: 15 }}> {note.text} </Text>
    </Pressable>
  );
}


export default NoteCard


const styles = ({ isAddedInSelection, noteColor }) => StyleSheet.create({
  noteCard: [{
    margin: 5,
    backgroundColor: noteColor || "white",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 4,
  },
  isAddedInSelection ? {
    borderWidth: 1.5,
    borderColor: theme.PRIMARY_COLOR
  } : {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  }]
})