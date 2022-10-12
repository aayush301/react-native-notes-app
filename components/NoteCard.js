import { Text, Pressable, StyleSheet, View, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { convertToXTimeAgo } from '../utils/dateformat';
import moment from 'moment';
import theme from '../style/theme';

const NoteCard = ({ note, drag, isActive, handlePress, handleLongPress, moveNoteToTrash, isAddedInSelection = false }) => {

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.2;
  const translateX = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onActive: e => {
      translateX.value = e.translationX;
    },
    onEnd: () => {
      const shouldBeRemoved = translateX.value < TRANSLATE_X_THRESHOLD;
      if (shouldBeRemoved) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 100 }, (isFinished) => {
          if (isFinished) runOnJS(moveNoteToTrash)(note.id);
        });
      } else {
        translateX.value = withTiming(0);
      }
    }
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: translateX.value,
    }]
  }));

  const isReminderTimePassed = new Date(note.reminder?.dateTime).getTime() < new Date().getTime();

  return (
    <View style={[{ marginBottom: 20, marginHorizontal: 10 }, isActive && { transform: [{ scale: 1.04 }] }]}>
      <Pressable
        onPress={() => handlePress(note.id)}
        onLongPress={() => { handleLongPress(note.id); drag(); }}
        android_ripple={{ color: "#bbb", radius: 200 }}
        style={styles({ isAddedInSelection }).noteCard}
      >
        <GestureHandlerRootView>
          <PanGestureHandler onGestureEvent={panGesture} activeOffsetX={-10}>
            <Animated.View style={rStyle}>
              <View>
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
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Pressable>
    </View>
  );
}


export default NoteCard


const styles = ({ isAddedInSelection }) => StyleSheet.create({
  noteCard: [{
    borderRadius: 3,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "white",
  },
  isAddedInSelection ? {
    borderWidth: 2,
    borderColor: theme.PRIMARY_COLOR,
  } : {
    borderBottomWidth: 2,
    borderBottomColor: "#e4e4e4",
  }]
})