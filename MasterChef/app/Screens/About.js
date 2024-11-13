import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const About = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false} // Hide the scroll indicator
    >
      <Text style={styles.header}>About Master Chef</Text>

      <Text style={styles.text}>
        Welcome to <Text style={styles.bold}>Master Chef</Text>, your ultimate culinary companion! Whether you're a seasoned chef or a cooking enthusiast, this app is designed to make your culinary journey both easy and enjoyable.
      </Text>

      <Text style={styles.subHeader}>With Master Chef, you can:</Text>
      <Text style={styles.text}>
        - <Text style={styles.bold}>Add Your Own Recipes</Text>: Share your personal creations with the world! Add detailed recipes, including ingredients, instructions, and even photos of your delicious dishes.
      </Text>
      <Text style={styles.text}>
        - <Text style={styles.bold}>View and Manage Your Recipes</Text>: Keep track of all your added recipes in one place. Easily access, edit, or delete them as needed.
      </Text>
      <Text style={styles.text}>
        - <Text style={styles.bold}>Explore Global Cuisines</Text>: Discover recipes from around the world. With a comprehensive search feature, you can find recipes for all cuisines, from Italian and Mexican to Thai, Indian, and more.
      </Text>
      <Text style={styles.text}>
        - <Text style={styles.bold}>Discover New Ideas</Text>: Get inspired with unique recipes and ingredients. Master Chef helps you explore different cooking styles and flavors, making every meal an adventure.
      </Text>

      <Text style={styles.subHeader}>Our Mission</Text>
      <Text style={styles.text}>
        At <Text style={styles.bold}>Master Chef</Text>, we believe that cooking is a journey of creativity and flavor. Our goal is to bring people together through food by offering a platform where users can share and explore diverse recipes. Whether you’re cooking for yourself, your family, or friends, Master Chef is here to help make every meal memorable.
      </Text>

      <Text style={styles.subHeader}>Join Us in the Kitchen</Text>
      <Text style={styles.text}>
        We’re passionate about food and committed to building a community of like-minded cooks. So roll up your sleeves, gather your ingredients, and let Master Chef guide you to culinary success. Bon appétit!
      </Text>

      <Text style={styles.subHeader}>Developers & Credits</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Developed by:</Text>{"\n"}
        1. Manmohan Boyina{"\n"}
        <Text style={styles.bold}>Special Thanks and Credits to:</Text>{"\n"}
        1. Chabane{"\n"}
        2. Ayman{"\n"}
        3. Mihir
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingBottom: 30, // Extra padding at the bottom to prevent last sentence from being hidden
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default About;
