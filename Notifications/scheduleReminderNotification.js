import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export default async function scheduleReminderNotification({ note, dateTime }) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: note.text.slice(0, 80) + "...",
        data: { navigateTo: "UpdateNote", params: { id: note.id } }
      },
      trigger: dateTime
    });
    return id;
  }
  catch (err) {
    console.log(err);
    Alert.alert("error");
  }
}