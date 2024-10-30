import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const UserRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const userEmail = useSelector((state) => state.auth.user?.email);
  const navigation = useNavigation();

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch(
        `https://brave-boxes-enjoy.loca.lt/api/recipe/getrecipe?email=${encodeURIComponent(userEmail)}`
      );
      const data = await response.json();

      if (response.ok) {
        setRecipes(data.recipes || []);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      Alert.alert("Error", "Failed to fetch recipes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserRecipes();
    } else {
      setLoading(false);
      Alert.alert("Error", "User email not found");
    }
  }, [userEmail]);

  // Refetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (userEmail) {
        fetchUserRecipes();
      }
    }, [userEmail])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserRecipes();
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Screens/RecipeDetail", { recipe: item })}
    >
      <View style={styles.recipeItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{item.recipename}</Text>
          <Text style={styles.recipeInstructions}>
            {item.ingredientLines ? item.ingredientLines.join(", ") : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#05B681" />
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipeItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noRecipesText}>No recipes added yet.</Text>
      )}
    </View>
  );
};

export default UserRecipes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  recipeItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  recipeInstructions: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  noRecipesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
});
