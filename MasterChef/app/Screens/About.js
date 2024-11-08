import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.appName}>Master Chef</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      
      <Text style={styles.sectionTitle}>About Master Chef</Text>
      <Text style={styles.description}>
        Foodie Reminder is your personal food and hydration assistant, designed to keep you healthy and energized throughout the day. With our app, you'll receive timely reminders about snacks, hydration, and healthy food choices, helping you stay on track with your wellness goals.
      </Text>
      
      <Text style={styles.sectionTitle}>Key Features</Text>
      <Text style={styles.features}>
        • Personalized Food Reminders: Receive customized notifications about healthy snacks, meal times, and hydration based on your preferences.{'\n'}
        • Health Insights: Get tips and insights on nutritious choices to make the most of your meals.{'\n'}
        • Flexible Schedule: Set reminders based on your unique routine, ensuring you stay mindful of your health throughout the day.{'\n'}
        • Community Recipes: Access recipes shared by other food lovers and nutritionists to keep your meals exciting and healthy.
      </Text>
      
      <Text style={styles.sectionTitle}>Why Use Master Chef?</Text>
      <Text style={styles.description}>
        Life gets busy, and it’s easy to overlook meal times or make unhealthy food choices. Master Chef provides subtle yet powerful nudges to help you make mindful eating decisions. From hydration reminders to meal prep ideas, we’re here to support a balanced lifestyle in an easy-to-use, friendly way.
      </Text>

      <Text style={styles.sectionTitle}>Developer Message</Text>
      <Text style={styles.developer}>
        Developed with love by Manmohan Boyina, Master Chef is a project born out of a desire to promote healthier eating habits in a simple and accessible way. Our team is committed to continuous improvement and would love to hear your feedback to make this app even better.
      </Text>
      
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.contact}>
        Questions, feedback, or suggestions? We'd love to hear from you! Reach us at mboyina@iu.edu or follow us on social media @manmohan__boyina.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  version: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
    marginBottom: 10,
  },
  features: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
  },
  developer: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
    marginBottom: 10,
  },
  contact: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
    marginBottom: 20,
  },
});

export default About;
