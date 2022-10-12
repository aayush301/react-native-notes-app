import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalContextProvider } from './context/context';
import * as screens from './screens';
import React from 'react'
import useNotifications from './Notifications/useNotifications';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View } from 'react-native';
import { Snackbar } from '@ouroboros/react-native-snackbar';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const navRef = useNotifications();
  return (
    <GlobalContextProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer ref={navRef}>
          <Stack.Navigator>
            <Stack.Screen name="Menus" options={{ headerShown: false }}>
              {() => (
                <Drawer.Navigator>
                  <Drawer.Screen name="Home" component={screens.Home} options={{ headerShown: false }} />
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