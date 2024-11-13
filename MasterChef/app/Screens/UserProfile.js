import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import config from "../../config";

const UserProfile = () => {
  const authEmail = useSelector((state) => state.auth.user?.email);
  const [userDetails, setUserDetails] = useState({
    name: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: authEmail || "",
  });
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (authEmail) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [authEmail]);

  const fetchUserDetails = async () => {
    if (!authEmail) return;
    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL}/api/userDetails/${authEmail}`);
      const data = await response.json();

      if (response.ok && data.user) {
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          name: data.user.name || "",
          dateOfBirth: data.user.dateOfBirth || "",
          mobileNumber: data.user.mobileNumber || "",
          email: data.user.email || authEmail,
        }));
      } else if (response.status === 404) {
        setUserDetails((prevDetails) => ({ ...prevDetails, email: authEmail }));
      } else {
        Alert.alert("Error", "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "Could not load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!authEmail) {
      Alert.alert("Error", "Email not found. Cannot update profile.");
      return;
    }

    try {
      const response = await fetch(
        `https://lucky-cougars-know.loca.lt/api/userDetails/${authEmail}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userDetails.email,
            name: userDetails.name,
            dateOfBirth: userDetails.dateOfBirth,
            mobileNumber: userDetails.mobileNumber,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "User details updated successfully");
      } else {
        Alert.alert("Error", "Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      Alert.alert("Error", "Failed to save changes");
    } finally {
      setEditingField(null);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUserDetails({ ...userDetails, dateOfBirth: selectedDate.toISOString().split('T')[0] });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#05B681" />;
  }

  return (
    <View style={styles.container}>
      {["name", "mobileNumber"].map((field) => (
        <View style={styles.fieldContainer} key={field}>
          <Text style={styles.label}>
            {field === "mobileNumber" ? "Mobile Number" : "Name"}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userDetails[field]}
              editable={editingField === field}
              onChangeText={(text) =>
                setUserDetails({ ...userDetails, [field]: text })
              }
              placeholder={`Enter ${field}`}
            />
            <TouchableOpacity
              onPress={() =>
                setEditingField(editingField === field ? null : field)
              }
            >
              <Ionicons
                name={editingField === field ? "checkmark" : "pencil"}
                size={24}
                color="#05B681"
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Date of Birth Field with Date Picker */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : ""}
            editable={false}
            placeholder="Select Date of Birth"
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={24} color="#05B681" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>

      {/* Email Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userDetails.email}
            editable={false}
          />
          <Ionicons name="lock-closed" size={24} color="#9e9e9e" />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  disabledInput: {
    color: "#9e9e9e",
  },
  saveButton: {
    backgroundColor: "#05B681",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
