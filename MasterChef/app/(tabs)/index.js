import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { MEAL_FILTERS } from "./Data"; // Assuming MEAL_FILTERS contains the new structure
import { useNavigation } from "expo-router";
import Search from "../Screens/Search"

const Index = () => {
  const Navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getTrendyRecipes();
  }, []);
  const handleSearchPress = () => {
    Navigation.navigate("Screens/Search"); // Navigate to the 'SSearch' screen
  };

  const getTrendyRecipes = () => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json"); // Corrected 'appLocation/json' to 'application/json'
    myHeaders.append("Accept-Language", "en");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.edamam.com/api/recipes/v2?type=public&q=food&app_id=230a69f7&app_key=f949a2f2a8b8a5066e0691cdcdb3c394",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hits) {
          // Filter out duplicate recipes by checking the unique 'uri' and 'label'
          const uniqueRecipes = [];
          const seenUris = new Set(); // To track unique 'uri'
          const seenLabels = new Set(); // To track unique 'label' in case URIs are similar

          result.hits.forEach((hit) => {
            const normalizedUri = hit.recipe.uri.split("?")[0]; // Remove any query parameters in the uri
            const recipeLabel = hit.recipe.label.toLowerCase().trim(); // Normalize the label for comparison

            if (!seenUris.has(normalizedUri) && !seenLabels.has(recipeLabel)) {
              uniqueRecipes.push(hit);
              seenUris.add(normalizedUri); // Mark normalized 'uri' as seen
              seenLabels.add(recipeLabel); // Mark label as seen
            }
          });

          setRecipes(uniqueRecipes); // Set unique recipes
        } else {
          Alert.alert("Error", "No recipes found"); // Alert if no recipes are found
        }
      })
      .catch((error) => {
        console.log("Error fetching recipes:", error);
        Alert.alert("Error", "Failed to fetch recipes");
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.topView}>
        <Image
          source={{
            uri: "https://cdn.pixabay.com/photo/2021/10/30/12/50/woman-6754248_1280.jpg",
          }}
          style={styles.image}
        />
        <View style={styles.transparentView}>
          <Text style={styles.logo}>RecipePro</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.searchBox}
            onPress={handleSearchPress}
          >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png",
            }}
            style={styles.searchIcon}
          />
            <Text style={styles.placeHolder}>Please search here.....</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            Search 1000+ recipes easily with one click
          </Text>
        </View>
      </View>
      <Text style={styles.heading}>Categories</Text>
      <View>
        <FlatList
          horizontal
          data={MEAL_FILTERS}
          keyExtractor={(item) => item.title}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity activeOpacity={0.8} style={styles.categoryItem} onPress={() => Navigation.navigate("Screens/RecipeByCategory",{ category: item.title })}>
                <View style={styles.categoryContainer}>
                  <Image source={item.icon} style={styles.categoryImage} />
                  <Text style={styles.categoryText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <Text style={styles.heading}>Trending</Text>
      <View>
        <FlatList
          horizontal
          data={recipes}
          contentContainerStyle={{ marginTop: 20 }}
          keyExtractor={(item) => item.recipe.uri} // Use a unique key (e.g., the recipe's URI)
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.recipeItem}
                onPress={() => {
                  Navigation.navigate("Screens/Details", {
                    data: item,
                  });
                }}
              >
                <Image
                  source={{ uri: item.recipe.image }}
                  style={styles.recipeImage}
                />
                <View style={styles.recipeOverlay}>
                  <Text style={styles.recipeLabel}>{item.recipe.label}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  topView: {
    width: "100%",
    height: "45%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  transparentView: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  searchBox: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  search: {
    width: 20,
    height: 20,
  },
  placeHolder: {
    marginLeft: 10,
    fontSize: 16,
    color: "#9e9e9e",
  },
  logo: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: 20,
    left: 20,
  },
  note: {
    fontSize: 14,
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 20,
  },
  categoryItem: {
    width: 100,
    height: 120,
    backgroundColor: "transparent",
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,.5)",
    shadowOpacity: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "85%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  recipeItem: {
    width: 150,
    height: 200,
    marginLeft: 20,
    borderRadius: 20,
    overflow: "hidden", // Ensures all content fits within the card
    backgroundColor: "#fff", // White background to make shadow more visible
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  recipeOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeLabel: {
    fontSize: 16, // Slightly larger text for better readability
    fontWeight: "bold",
    color: "white", // White text for contrast
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Add shadow to make text more readable on any background
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
      searchIcon: {
        width: 20,
        height: 20,
        tintColor: "#9e9e9e", // Icon color
        marginRight: 10,
      },
});

export default Index;
