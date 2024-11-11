// NotificationService.js
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

let notificationInterval;

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
      trigger: { seconds: 1 },
    });

    console.log("Immediate notification sent:", message);
  } catch (error) {
    console.error("Error sending immediate notification:", error);
    Alert.alert("Error", "Failed to send immediate notification.");
  }
}

// Function to schedule recurring random notifications
export function scheduleRandomNotifications() {
  sendImmediateNotification();

  if (notificationInterval) clearInterval(notificationInterval);

  notificationInterval = setInterval(async () => {
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
        trigger: { seconds: 1 },
      });

      console.log("Scheduled notification:", message);
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  }, Math.random() * 3600000 + 1800000); // Random between 30 min - 1.5 hours
}

// Function to cancel scheduled notifications
export function cancelNotifications() {
  if (notificationInterval) clearInterval(notificationInterval);
  console.log("Notifications canceled.");
}
