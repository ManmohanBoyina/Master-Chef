import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useNavigation, useRoute } from "expo-router";
  
  const RecipeByCategory = () => {
    const [recipes, setRecipes] = useState([]); // State to store unique recipes
    const navigation = useNavigation();
    const route = useRoute(); // Get the category from the navigation parameters
    const { category } = route.params; // Assumes the category is passed as a parameter
  
    useEffect(() => {
      searchRecipeByCategory(category); // Fetch recipes when the component mounts or when category changes
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
            const seenUris = new Set(); // To track unique 'uri'
            const seenLabels = new Set(); // To track unique 'label'
  
            result.hits.forEach((hit) => {
              const normalizedUri = hit.recipe.uri.split("?")[0];
              const recipeLabel = hit.recipe.label.toLowerCase().trim();
  
              if (!seenUris.has(normalizedUri) && !seenLabels.has(recipeLabel)) {
                uniqueRecipes.push(hit.recipe);
                seenUris.add(normalizedUri);
                seenLabels.add(recipeLabel);
              }
            });
  
            setRecipes(uniqueRecipes); // Set unique recipes
          } else {
            Alert.alert("Error", "No recipes found for this category");
          }
        })
        .catch((error) => {
          console.log("Error fetching recipes:", error);
          Alert.alert("Error", "Failed to fetch recipes");
        });
    };
  
    // Function to render each recipe
    const renderRecipeItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { data: { recipe: item } })} // Wrap item in the 'recipe' key under 'data'
      >
        <View style={styles.recipeItem}>
          <Image source={{ uri: item.image }} style={styles.recipeImage} />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>{item.label}</Text>
            <Text style={styles.recipeSource}>{item.source}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back
        >
          <Image
            source={{
              uri: "https://png.pngtree.com/png-vector/20190120/ourmid/pngtree-back-vector-icon-png-image_470452.jpg",
            }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
  
        <Text style={styles.categoryTitle}>{`Recipes for ${category}`}</Text>
  
        {/* Render the recipes */}
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.uri}
          renderItem={renderRecipeItem}
          style={styles.recipeList}
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
      backgroundColor: "#f4f4f4",
    },
    backButton: {
      width: 50,
      height: 50,
      backgroundColor: "white",
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      marginLeft: 20,
    },
    backIcon: {
      width: 24,
      height: 24,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
    },
    recipeList: {
      marginTop: 20,
    },
    recipeItem: {
      flexDirection: "row",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    recipeImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    recipeInfo: {
      flex: 1,
      marginLeft: 10,
      justifyContent: "center",
    },
    recipeTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    recipeSource: {
      fontSize: 14,
      color: "#555",
    },
    noResultsText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "#555",
    },
  });
  