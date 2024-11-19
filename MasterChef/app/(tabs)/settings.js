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
  TextInput,
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
import {
  requestNotificationPermission,
  scheduleRandomNotifications,
  cancelNotifications,
} from "../services/Notification";
import { useStripe } from "@stripe/stripe-react-native";
import config from "../../config";
const Settings = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const Navigation = useNavigation();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRateModalVisible, setRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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

  const handleLogout = async () => {
    await dispatch(logoutUserAction());
    router.replace("/auth/login");
  };

  const downloadImage = async () => {
    const asset = Asset.fromModule(require("../../assets/Payment.jpg"));

    try {
      await asset.downloadAsync();
      const localUri = asset.localUri;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "You need to enable media permissions to download images."
        );
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

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a star rating.");
      return;
    }
  
    try {
      if (!config.API_URL) {
        throw new Error("API URL is not defined in config.");
      }
  
      const response = await fetch(`${config.API_URL}/api/ratings/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });
  
      // Log raw response for debugging
      const rawResponse = await response.text();
      console.log("Raw server response:", rawResponse);
  
      if (response.ok) {
        Alert.alert("Thank you!", "Your feedback has been submitted.");
        setRating(0);
        setComment("");
        setRateModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      Alert.alert(
        "Error",
        error.message.includes("Network")
          ? "Network error: Unable to reach the server. Check your connection."
          : "An error occurred. Please try again later."
      );
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
            <Icon
              name="angle-right"
              size={24}
              color="#999"
              style={styles.optionIcon}
            />
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

          <TouchableOpacity
            style={styles.option}
            onPress={() => setRateModalVisible(true)}
          >
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={styles.optionText}>Rate Us</Text>
            <Icon
              name="angle-right"
              size={24}
              color="#999"
              style={styles.optionIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="lock" size={24} color="#f44336" />
            <Text style={styles.optionText}>Donate</Text>
            <Icon
              name="angle-right"
              size={24}
              color="#999"
              style={styles.optionIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => Navigation.navigate("Screens/About")}
          >
            <Icon name="info-circle" size={24} color="#3f51b5" />
            <Text style={styles.optionText}>About</Text>
            <Icon
              name="angle-right"
              size={24}
              color="#999"
              style={styles.optionIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Icon name="sign-out" size={24} color="#e91e63" />
            <Text style={styles.optionText}>Logout</Text>
            <Icon
              name="angle-right"
              size={24}
              color="#999"
              style={styles.optionIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Rate Us Modal */}
        <Modal
          visible={isRateModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Close Button at Top Right Corner */}
              <TouchableOpacity
                style={styles.closeButtonTopRight}
                onPress={() => setRateModalVisible(false)}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>

              <Text style={styles.modalText}>Rate Us</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Icon
                      name="star"
                      size={30}
                      color={rating >= star ? "#FFD700" : "#ccc"}
                      style={styles.star}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Leave a comment..."
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitRating}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Donate Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalText}>
                Donate to help us maintain the app
              </Text>
              <Image
                source={require("../../assets/Payment.jpg")}
                style={styles.image}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={downloadImage}
              >
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
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 10, // Additional spacing for alignment
  },
  star: {
    fontSize: 40, // Adjusted size for larger stars
    marginHorizontal: 10, // Space between stars
  },
  commentInput: {
    height: 80,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#05B681",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 300,
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
  closeButtonTopRight: {
    position: "absolute", // Position relative to the modal
    top: 10, // 10px from the top
    right: 10, // 10px from the right
    zIndex: 10, // Ensure it stays above other components
  },
});
