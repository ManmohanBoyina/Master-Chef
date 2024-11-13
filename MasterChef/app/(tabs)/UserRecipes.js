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
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import config from "../../config";

const UserRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const userEmail = useSelector((state) => state.auth.user?.email);
  const navigation = useNavigation();

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch(
        `${config.API_URL}/api/recipe/getrecipe?email=${encodeURIComponent(userEmail)}`
      );
      const data = await response.json();

      if (response.ok) {
        const bookmarkedRecipes = await getBookmarkedRecipes();
        const recipesWithBookmarks = data.recipes
          .map((recipe) => ({
            ...recipe,
            bookmarked: bookmarkedRecipes.includes(recipe._id),
          }))
          .sort((a, b) => b.bookmarked - a.bookmarked); // Sort to keep bookmarked recipes at the top
        setRecipes(recipesWithBookmarks);
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

  const handleShare = async (recipe) => {
    try {
      const indexedIngredients = recipe.ingredientLines
        .map((ingredient, index) => `${index + 1}. ${ingredient}`)
        .join("\n");

      const indexedInstructions = recipe.instructions
        .split(",")
        .map((instruction, index) => `${index + 1}. ${instruction.trim()}`)
        .join("\n");

      const message = `Check out this recipe: ${recipe.recipename}\n\nIngredients:\n${indexedIngredients}\n\nInstructions:\n${indexedInstructions}`;

      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the recipe");
    }
  };

  // Toggle and persist bookmark state
  const toggleBookmark = async (recipeId) => {
    setRecipes((prevRecipes) =>
      prevRecipes
        .map((recipe) =>
          recipe._id === recipeId
            ? { ...recipe, bookmarked: !recipe.bookmarked }
            : recipe
        )
        .sort((a, b) => b.bookmarked - a.bookmarked) // Sort to keep bookmarked recipes at the top
    );
    await updateBookmarkedRecipes(recipeId);
  };

  const getBookmarkedRecipes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("bookmarkedRecipes");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Failed to fetch bookmarks from storage:", e);
      return [];
    }
  };

  const updateBookmarkedRecipes = async (recipeId) => {
    try {
      const currentBookmarks = await getBookmarkedRecipes();
      const updatedBookmarks = currentBookmarks.includes(recipeId)
        ? currentBookmarks.filter((id) => id !== recipeId)
        : [...currentBookmarks, recipeId];
      await AsyncStorage.setItem(
        "bookmarkedRecipes",
        JSON.stringify(updatedBookmarks)
      );
    } catch (e) {
      console.error("Failed to update bookmarks in storage:", e);
    }
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
        {/* Bookmark Icon */}
        <TouchableOpacity
          style={styles.bookmarkIcon}
          onPress={() => toggleBookmark(item._id)}
        >
          <Icon
            name={item.bookmarked ? "bookmark" : "bookmark-o"}
            size={20}
            color={item.bookmarked ? "#FFD700" : "#999"} // Yellow if bookmarked, gray if not
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Recipes</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginVertical: 16,
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
    position: "relative",
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
  bookmarkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  noRecipesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
});
