import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalContextProvider } from './context/context';
import * as screens from './screens';
import React from 'react'
import useNotifications from './Notifications/useNotifications';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { ScrollView, Text, View } from 'react-native';
import { Snackbar } from '@ouroboros/react-native-snackbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
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

export default function App() {
  const navRef = useNotifications();
  return (
    <GlobalContextProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer ref={navRef}>
          <Stack.Navigator>
            <Stack.Screen name="Menus" options={{ headerShown: false }}>
              {() => (
                <Drawer.Navigator drawerContent={DrawerContent}>
                  <Drawer.Screen name="Home" component={screens.Home} options={{ headerShown: false }} />
                  <Drawer.Screen name="Labels" component={screens.LabelsManager} />
                  <Drawer.Screen name="Trash" component={screens.Trash} />
                </Drawer.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name="AddNote" component={screens.AddNote} options={{ title: "New note" }} />
            <Stack.Screen name="UpdateNote" component={screens.UpdateNote} options={{ title: "Note" }} />
            <Stack.Screen name="NoteLabels" component={screens.NoteLabels} options={{ title: "Manage labels" }} />
          </Stack.Navigator>
        </NavigationContainer>

        <Snackbar actionStyle={{ color: "lightgreen" }} textStyle={{ color: "#bbb" }}
          messageStyle={{ paddingVertical: 15, paddingHorizontal: 10, borderRadius: 3, backgroundColor: "black" }}
        />
      </View>
    </GlobalContextProvider >
  );
}