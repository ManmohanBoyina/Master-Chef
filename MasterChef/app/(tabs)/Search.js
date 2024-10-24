import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Keyboard,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { useNavigation } from "expo-router";
  
  const Search = () => {
    const [searchText, setSearchText] = useState(""); // State to track search input
    const [recipes, setRecipes] = useState([]); // State to store unique recipes
    const navigation = useNavigation();
  
    const handleClear = () => {
      setSearchText(""); // Clear the text input
      setRecipes([]); // Clear the search results
    };
  
    const searchRecipe = (search) => {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Accept-Language", "en");
  
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
  
      fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${search}&app_id=230a69f7&app_key=f949a2f2a8b8a5066e0691cdcdb3c394`,
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
            Alert.alert("Error", "No recipes found");
          }
        })
        .catch((error) => {
          console.log("Error fetching recipes:", error);
          Alert.alert("Error", "Failed to fetch recipes");
        });
    };
  
    const handleSearchSubmit = () => {
      if (searchText.trim()) {
        searchRecipe(searchText.trim()); // Call searchRecipe with searchText
        Keyboard.dismiss(); // Dismiss the keyboard after search
      }
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
          onPress={() => navigation.navigate("Search")} // Explicitly navigate to the Search screen
        >
          <Image
            source={{
              uri: "https://png.pngtree.com/png-vector/20190120/ourmid/pngtree-back-vector-icon-png-image_470452.jpg",
            }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
  
        <View style={styles.searchBox}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png",
            }}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search here..."
            placeholderTextColor="#9e9e9e"
            value={searchText}
            onChangeText={setSearchText} // Update state on text change
            onSubmitEditing={handleSearchSubmit} // Trigger searchRecipe on Enter key press
            returnKeyType="search" // Display "Search" as the Enter key label
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
  
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
  
  export default Search;
  
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
    searchBox: {
      width: "90%",
      height: 50,
      borderWidth: 0.5,
      alignSelf: "center",
      marginTop: 50,
      borderRadius: 8,
      borderColor: "#9e9e9e",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 10,
    },
    searchIcon: {
      width: 20,
      height: 20,
      tintColor: "#9e9e9e", // Icon color
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: "#333",
    },
    clearButton: {
      marginRight: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: "transparent",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    clearButtonText: {
      fontSize: 18,
      color: "#333",
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
  