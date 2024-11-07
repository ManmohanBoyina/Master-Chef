import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useNavigation } from "expo-router";

export default function RootLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,  // Globally hides headers for all screens in Tabs
          tabBarActiveTintColor: "#0056B3", // Active icon color (e.g., a bright blue)
          tabBarInactiveTintColor: "#9e9e9e", // Inactive icon color (e.g., gray)
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={28} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={28} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="UserRecipes"
          options={{
            title: "My Recipes",
            tabBarIcon: ({ color }) => (
              <Ionicons name="book-outline" size={28} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="settings"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
