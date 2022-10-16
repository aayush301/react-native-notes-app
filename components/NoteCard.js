import { Pressable, StyleSheet, View, Dimensions } from 'react-native'
import React from 'react'
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import theme from '../style/theme';
import NoteCardText from './NoteCardText';
import { SharedElement } from 'react-navigation-shared-element';

// "isActive" is used in the situation of dragging the note and to check if currently it is being dragged
const NoteCard = ({ note, isActive = false, onPress = () => { }, onLongPress = () => { }, moveNoteToTrash, isAddedInSelection = false }) => {

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.4;
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
    }, {
      scale: withTiming(isActive ? 1.04 : 1, { duration: 100 })
    }]
  }));


  return (
    <View style={{ marginBottom: 20, marginHorizontal: 10 }}>
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={panGesture} activeOffsetX={-10}>
          <Animated.View style={rStyle}>
            <SharedElement id={`note.${note.id}`}>
              <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                android_ripple={{ color: "#bbb", radius: 200 }}
                style={styles({ isAddedInSelection }).noteCard}
                delayLongPress={100}
              >
                <NoteCardText note={note} />
              </Pressable>
            </SharedElement>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
}


export default NoteCard


const styles = ({ isAddedInSelection }) => StyleSheet.create({
  noteCard: [{
    borderRadius: 5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff"
  },
  isAddedInSelection ? {
    borderColor: theme.PRIMARY_COLOR,
  } : {
    borderBottomColor: "#e4e4e4",
  }]
})