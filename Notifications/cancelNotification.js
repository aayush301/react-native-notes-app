import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export async function cancelNotification(notifId) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notifId);
  }
  catch (err) {
    Alert.alert("Error!")
  }
}