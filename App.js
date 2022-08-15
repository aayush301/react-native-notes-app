import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalContextProvider } from './context/context';
import theme from './style/theme';
import * as screens from './screens';
import React from 'react'

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <GlobalContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.PRIMARY_COLOR }, headerTintColor: "white" }}>
          <Stack.Screen name="Home" component={screens.Home} options={{ headerShown: false }} />
          <Stack.Screen name="AddNote" component={screens.AddNote} options={{ title: "New note" }} />
          <Stack.Screen name="UpdateNote" component={screens.UpdateNote} options={{ title: "Edit note" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContextProvider>
  );
}