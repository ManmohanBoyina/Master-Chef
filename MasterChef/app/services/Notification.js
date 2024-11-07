import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

let notificationInterval;

// Function to request notification permissions
export async function requestNotificationPermission() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Enable notifications to get food reminders.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    Alert.alert("Error", "Failed to request notification permission.");
    return false;
  }
}

// Function to schedule random notifications using setTimeout
export function scheduleRandomNotifications() {
  // First notification immediately after enabling notifications
  sendImmediateNotification();

  // Clear any existing intervals
  if (notificationInterval) clearInterval(notificationInterval);

  // Set interval for recurring notifications
  notificationInterval = setInterval(() => {
    const foodMessages = [
      "Time for a healthy snack!",
      "Don’t forget to drink water!",
      "How about some fruit?",
      "Try a new recipe today!",
      "Time for a meal break!",
    ];
    const message = foodMessages[Math.floor(Math.random() * foodMessages.length)];

    Notifications.scheduleNotificationAsync({
      content: { title: "Food Reminder", body: message },
      trigger: { seconds: 1 }, // Immediately send
    });
  }, Math.random() * 3600000 + 1800000); // Random between 30 min - 1.5 hours
}

// Function to send an immediate notification
export async function sendImmediateNotification() {
  try {
    const foodMessages = [
      "Time for a healthy snack!",
      "Don’t forget to drink water!",
      "How about some fruit?",
      "Try a new recipe today!",
      "Time for a meal break!",
    ];
    const message = foodMessages[Math.floor(Math.random() * foodMessages.length)];

    await Notifications.scheduleNotificationAsync({
      content: { title: "Food Reminder", body: message },
      trigger: { seconds: 1 }, // Trigger immediately
    });
  } catch (error) {
    console.error("Error sending immediate notification:", error);
    Alert.alert("Error", "Failed to send immediate notification.");
  }
}

// Function to cancel scheduled notifications
export function cancelNotifications() {
  if (notificationInterval) clearInterval(notificationInterval);
}
