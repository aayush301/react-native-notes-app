import { GlobalContextProvider } from './context/context';
import React from 'react'
import useNotifications from './Notifications/useNotifications';
import { Snackbar } from '@ouroboros/react-native-snackbar';
import AppNavigator from './AppNavigator';
import { View } from 'react-native';

export default function App() {
  const navRef = useNotifications();
  return (
    <GlobalContextProvider>
      <View style={{ flex: 1 }}>
        <AppNavigator navRef={navRef} />

        <Snackbar actionStyle={{ color: "lightgreen" }} textStyle={{ color: "#bbb" }}
          messageStyle={{ paddingVertical: 15, paddingHorizontal: 10, borderRadius: 3, backgroundColor: "black" }}
        />
      </View>
    </GlobalContextProvider >
  );
}