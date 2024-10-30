import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ProtectedRoute from "../../components/ProtectedRoute";
import Foundation from '@expo/vector-icons/Foundation';
export default function RootLayout() {
  return (
    <ProtectedRoute>
      <Tabs
      screenOptions={{
        headerShown: false,  // Globally hides headers for all screens in Tabs
      }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Foundation name="home" size={28} color="black" />
            ),
          }}
        />
        {/* profile */}

        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarIcon: ({ color }) => (
              <Foundation name="plus" size={28} color="black" />
            ),
            headerShown: false,
          }}
        />
      <Tabs.Screen
          name="UserRecipes"
          options={{
            title: "My Recipes",
            tabBarIcon: ({ color }) => (
              <Foundation name="clipboard-notes" size={28} color="black" />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color="black"/>
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
