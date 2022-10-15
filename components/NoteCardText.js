import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { convertToXTimeAgo } from '../utils/dateformat';
import moment from 'moment';

const NoteCardText = ({ note }) => {
  const isReminderTimePassed = new Date(note.reminder?.dateTime).getTime() < new Date().getTime();

  return (
    <View style={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 15 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
        {note.color && (
          <View style={{ marginHorizontal: 5, borderRadius: 500, width: 10, height: 10, backgroundColor: note.color }}></View>
        )}
        <Text style={{ flex: 1, color: "#999", fontSize: 13 }}>{convertToXTimeAgo(note.updatedAt)}</Text>
        {note.isBookmarked && (
          <Icon name={"bookmark"} size={17} color="#888" style={{ marginHorizontal: 5 }} />
        )}
        {note.isPinned && (
          <Icon name={"pin"} size={17} color="#888" style={{ marginHorizontal: 5 }} />
        )}
      </View>

      {note.labels.length > 0 && (
        <ScrollView horizontal contentContainerStyle={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
          {note.labels?.map(label => (
            <Text key={label} style={{ marginRight: 10, padding: 5, backgroundColor: "#eee", color: "#666", borderRadius: 3, fontSize: 13 }}>{label}</Text>
          ))}
        </ScrollView>
      )}

      {note.reminder?.dateTime && (
        <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 7, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: "#eee", borderRadius: 3, }}>
          <Icon name="alarm-outline" size={18} color="gray" style={{ marginRight: 10 }} />
          <Text style={[{ color: "#666", fontSize: 13 }, isReminderTimePassed && { textDecorationLine: 'line-through' }]}>
            {moment(note.reminder?.dateTime).format("lll")}
          </Text>
        </View>
      )}

      <Text numberOfLines={5} style={{ color: "#555", fontSize: 15, marginTop: 10 }}> {note.text} </Text>
    </View>
  )
}

export default NoteCardText