import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAction } from "../(redux)/authSlice";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useNavigation } from "expo-router";
import {
  requestNotificationPermission,
  scheduleRandomNotifications,
  cancelNotifications,
} from "../services/Notification"; // Import notification service functions

const Settings = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const Navigation = useNavigation();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleToggleNotifications = async () => {
    setIsNotificationsEnabled((previousState) => !previousState);
    
    if (!isNotificationsEnabled) {
      // Enable notifications
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        scheduleRandomNotifications();
      }
    } else {
      // Disable notifications
      cancelNotifications();
    }
  };  

  const handleLogout = async () => {
    await dispatch(logoutUserAction());
    router.push("/auth/login");
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => Navigation.navigate("Screens/UserProfile")}
          >
            <Icon name="user" size={24} color="#4caf50" />
            <Text style={styles.optionText}>Account</Text>
            <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
          </TouchableOpacity>

          {/* Notifications Toggle */}
          <View style={styles.option}>
            <Icon name="bell" size={24} color="#ff9800" />
            <Text style={styles.optionText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#ff9800" }}
              thumbColor={isNotificationsEnabled ? "#fff" : "#fff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleNotifications}
              value={isNotificationsEnabled}
              style={styles.switch}
            />
          </View>

          <TouchableOpacity style={styles.option}>
            <Icon name="lock" size={24} color="#f44336" />
            <Text style={styles.optionText}>Payment</Text>
            <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Icon name="info-circle" size={24} color="#3f51b5" />
            <Text style={styles.optionText}>About</Text>
            <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Icon name="sign-out" size={24} color="#e91e63" />
            <Text style={styles.optionText}>Logout</Text>
            <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  optionIcon: {
    marginLeft: "auto",
  },
  switch: {
    marginLeft: "auto",
  },
});
