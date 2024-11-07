import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const RecipeByCategory = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params; // Retrieve the category from route parameters

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (category) {
      searchRecipeByCategory(category); // Fetch recipes when the component mounts or when category changes
    }
  }, [category]);

  const searchRecipeByCategory = (category) => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Accept-Language", "en");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${category}&app_id=230a69f7&app_key=f949a2f2a8b8a5066e0691cdcdb3c394`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hits) {
          const uniqueRecipes = [];
          const seenUris = new Set();
          const seenLabels = new Set();

          result.hits.forEach((hit) => {
            const normalizedUri = hit.recipe.uri.split("?")[0];
            const recipeLabel = hit.recipe.label.toLowerCase().trim();

            if (!seenUris.has(normalizedUri) && !seenLabels.has(recipeLabel)) {
              uniqueRecipes.push(hit.recipe);
              seenUris.add(normalizedUri);
              seenLabels.add(recipeLabel);
            }
          });

          setRecipes(uniqueRecipes);
        } else {
          Alert.alert("Error", "No recipes found for this category");
        }
      })
      .catch((error) => {
        console.log("Error fetching recipes:", error);
        Alert.alert("Error", "Failed to fetch recipes");
      });
  };

  // Navigate to Details screen with recipe data
  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Screens/Details", { data: { recipe: item } })} // Navigate to Details screen with recipe data
      style={styles.recipeItem}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.label}</Text>
        <Text style={styles.recipeSource}>by {item.source}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.uri}
        renderItem={renderRecipeItem}
        style={styles.recipeList}
        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>No recipes to display</Text>
        )}
      />
    </View>
  );
};

export default RecipeByCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  recipeList: {
    paddingTop: 10,
  },
  recipeItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  recipeSource: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
