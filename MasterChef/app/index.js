import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Video } from 'expo-av'; // Import from expo-av
import { useRouter } from 'expo-router';

const Home = () => {
  const video = React.useRef(null); // Correct usage of ref for video component
  const router = useRouter(); // Router hook from expo-router

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "https://cdn.pixabay.com/video/2022/08/29/129575-744709905_tiny.mp4",
        }}
        resizeMode="cover" // Correct way to specify resizeMode in string format
        shouldPlay
        isLooping
      />
      <View style={styles.overlay}>
        <Text style={styles.mainText}>Master Chef</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    flex: 1,            // Ensure the video takes up the available space
    width: '100%',      // Sets the width to 100% of the screen
    height: '100%',     // Sets the height to 100% of the screen
    position: 'absolute', // Ensure the video fills the screen
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the entire screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  mainText: {
    color: "white",
    fontSize: 68,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3, // Adds a shadow effect on Android
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
