import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Modal,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-asset";
import { useDispatch } from "react-redux";
import { logoutUserAction } from "../(redux)/authSlice";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useNavigation } from "expo-router";
import { requestNotificationPermission, scheduleRandomNotifications, cancelNotifications } from "../services/Notification";
import { useStripe } from "@stripe/stripe-react-native";

const Settings = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const Navigation = useNavigation();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const stripe = useStripe();

  const handleToggleNotifications = async () => {
    if (!isNotificationsEnabled) {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        scheduleRandomNotifications();
        setIsNotificationsEnabled(true);
      }
    } else {
      cancelNotifications();
      setIsNotificationsEnabled(false);
    }
  };

  const subscribe = async () => {
    try {
      // sending request
      const response = await fetch("http://localhost:8080/pay", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return Alert.alert(presentSheet.error.message);
      Alert.alert("Payment complete, thank you!");
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUserAction());
    router.replace("/auth/login"); // Navigate to login screen immediately after logout
  };
  

  // Function to download the image
  const downloadImage = async () => {
    const asset = Asset.fromModule(require("../../assets/Payment.jpg"));

    try {
      await asset.downloadAsync();
      const localUri = asset.localUri;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "You need to enable media permissions to download images.");
        return;
      }

      const fileUri = FileSystem.documentDirectory + "downloadedImage.jpg";
      await FileSystem.copyAsync({
        from: localUri,
        to: fileUri,
      });

      await MediaLibrary.createAssetAsync(fileUri);
      Alert.alert("Success", "Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "Failed to download image.");
    }
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

          {/* Payment Button to Open Image Modal */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="lock" size={24} color="#f44336" />
            <Text style={styles.optionText}>Donate</Text>
            <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => Navigation.navigate("Screens/About")}>
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

        {/* Modal to Show Image */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalText}>Donate to help us maintain the app</Text>
              <Image
                source={require("../../assets/Payment.jpg")}
                style={styles.image}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.downloadButton} onPress={downloadImage}>
                <Text style={styles.downloadText}>Download Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    height: "60%", // Increased height for a larger view
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  image: {
    width: "200%",
    height: 330, // Larger image size
    marginVertical: 10,
  },
  downloadButton: {
    backgroundColor: "#05B681",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
