import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { convertToXTimeAgo } from '../utils/dateformat'
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../style/theme';

const FolderCard = ({ folder, drag, isActive, handlePress }) => {
  return (
    <View style={[{ backgroundColor: isActive ? "#e3e3e3" : "#fff" }, isActive && {
      transform: [{ scale: 1.04 }],
      shadowColor: "#555",
      shadowOffset: {
        width: -3,
        height: 2
      },
      shadowOpacity: 0.37,
      shadowRadius: 20,
      elevation: 5
    }]}>
      <Pressable
        onPress={() => handlePress(folder.id)}
        onLongPress={() => drag()}
        android_ripple={{ color: "#bbb", radius: 200 }}
        delayLongPress={100}
      >
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#555", fontSize: 17 }}>{folder.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
              <Text style={{ marginRight: 10, color: theme.PRIMARY_COLOR }}>{folder.notes.length} note{folder.notes.length != 1 && 's'}</Text>
              <Text style={{ flex: 1, color: "#999" }}>{convertToXTimeAgo(folder.createdAt)}</Text>
            </View>
          </View>
          <Icon name={"chevron-forward-outline"} size={22} color="#888" />
        </View>
      </Pressable>
    </View>
  )
}

export default FolderCard