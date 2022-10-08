import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalContextProvider } from './context/context';
import theme from './style/theme';
import * as screens from './screens';
import React from 'react'
import useNotifications from './Notifications/useNotifications';

const Stack = createNativeStackNavigator();
export default function App() {
  const navRef = useNotifications();
  return (
    <GlobalContextProvider>
      <NavigationContainer ref={navRef}>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.PRIMARY_COLOR }, headerTintColor: "white" }}>
          <Stack.Screen name="Home" component={screens.Home} options={{ headerShown: false }} />
          <Stack.Screen name="AddNote" component={screens.AddNote} options={{ title: "New note" }} />
          <Stack.Screen name="UpdateNote" component={screens.UpdateNote} options={{ title: "Note" }} />
          <Stack.Screen name="NoteLabels" component={screens.NoteLabels} options={{ title: "Manage labels" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContextProvider>
  );
}