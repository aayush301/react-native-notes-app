import { NavigationContainer } from '@react-navigation/native';
import * as screens from './screens';
import React from 'react'
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text } from 'react-native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { CardStyleInterpolators } from '@react-navigation/stack';

const Stack = createSharedElementStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerContent = (props) => {
  return (
    <>
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
          <Text style={{ marginBottom: 10, paddingVertical: 10, paddingTop: 25, paddingLeft: 20, fontSize: 20, borderBottomWidth: 1, borderBottomColor: "#eee" }}>Notes App</Text>
          <DrawerItemList {...props} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const AppNavigator = ({ navRef }) => {
  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
      }}>
        <Stack.Screen name="Menus" options={{ headerShown: false }} component={() => (
          <Drawer.Navigator drawerContent={DrawerContent}>
            <Drawer.Screen name="Home" component={screens.Home} options={{ headerShown: false }} />
            <Drawer.Screen name="Labels" component={screens.LabelsManager} />
            <Drawer.Screen name="Folders" component={screens.Folders} />
            <Drawer.Screen name="Trash" component={screens.Trash} />
          </Drawer.Navigator>
        )} />
        <Stack.Screen name="AddNote" component={screens.AddNote} options={{ title: "New note" }} />
        <Stack.Screen name="FolderNotes" component={screens.FolderNotes} options={{ title: "Folder", headerShown: false }} />
        <Stack.Screen name="NoteLabels" component={screens.NoteLabelsManager} options={{ title: "Manage labels" }} />
        <Stack.Screen name="NotesSelector" component={screens.NotesSelector} options={{ title: "Select notes" }} />
        <Stack.Screen name="UpdateNote" component={screens.UpdateNote} options={{ title: "Note" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator