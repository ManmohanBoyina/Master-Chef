import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
  } from "react-native";
  import React, { useState } from "react";
  import { useRoute } from "@react-navigation/native";
  import { useNavigation } from "expo-router";
  import * as Animatable from 'react-native-animatable'
  
  const Details = () => {
    const route = useRoute();
    const [selectedTab, setSelectedTab] = useState(0);
    const navigation = useNavigation();
  
    // Convert the calorie value to an integer
    const calorieValue = parseInt(route.params.data.recipe.calories, 10);
    const weightValue = parseInt(route.params.data.recipe.totalWeight, 10);
    const AnimatedBtn=Animatable.createAnimatableComponent(TouchableOpacity)
  
    // Create an array of items for the FlatList
    const detailsData = [
      { type: "image" },
      { type: "title", label: route.params.data.recipe.label, source: route.params.data.recipe.source },
      { type: "nutrition" }, // Calories, Total Weight, and Meal Type on same line
      { type: "tabs" },  // Placeholder for the tabs list
      { type: "list", tab: selectedTab },  // Content based on selected tab
    ];
  
    return (
      <FlatList
        data={detailsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          switch (item.type) {
            case "image":
              return (
                <View>
                  <Image
                    source={{ uri: route.params.data.recipe.image }}
                    style={styles.banner}
                  />
                  <TouchableOpacity style={styles.backButton} animation={'slideInUp'} onPress={() => navigation.goBack()}>
                    <Image
                      source={{
                        uri: "https://png.pngtree.com/png-vector/20190120/ourmid/pngtree-back-vector-icon-png-image_470452.jpg",
                      }}
                      style={styles.backIcon}
                    />
                  </TouchableOpacity>
                </View>
              );
            case "title":
              return (
                <View style={styles.detailsContainer}>
                  <Text style={styles.title}>{item.label}</Text>
                  <Text style={styles.source}>{"added by " + item.source}</Text>
                </View>
              );
            case "nutrition":
              return (
                <View style={styles.nutritionContainer}>
                  {/* Display Calories, Total Weight, and Meal Type in a row */}
                  <Text style={styles.nutritionText}>
                    {"Calories: "}
                    <Text style={styles.caloriesValue}>{calorieValue}</Text>
                  </Text>
                  <Text style={styles.nutritionText}>
                    {"Total Weight: "}
                    <Text style={styles.nutritionValue}>{weightValue}g</Text>
                  </Text>
                  <Text style={styles.nutritionText}>
                    {"Meal Type: "}
                    <Text style={styles.nutritionValue}>{route.params.data.recipe.mealType}</Text>
                  </Text>
                </View>
              );
            case "tabs":
              return (
                <FlatList
                  data={[
                    "Health",
                    "Cautions",
                    "Ingredients",
                    "Diet",
                    "Meal Type",
                    "Cuisine",
                    "Dish Type",
                  ]}
                  showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
                  horizontal
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.typeItem,
                          {
                            borderWidth: selectedTab === index ? 0 : 0.5,
                            borderColor: "#9e9e9e",
                            backgroundColor: selectedTab === index ? "#05B681" : "#fff",
                          },
                        ]}
                        onPress={() => setSelectedTab(index)}
                      >
                        <Text
                          style={{ color: selectedTab === index ? "white" : "black" }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              );
            case "list":
              const data =
                item.tab === 0
                  ? route.params.data.recipe.healthLabels
                  : item.tab === 1
                  ? route.params.data.recipe.cautions
                  : item.tab === 2
                  ? route.params.data.recipe.ingredientLines
                  : item.tab === 3
                  ? route.params.data.recipe.dietLabels
                  : item.tab === 4
                  ? route.params.data.recipe.mealType
                  : item.tab === 5
                  ? route.params.data.recipe.cuisineType
                  : route.params.data.recipe.dishType;
  
              return (
                <FlatList
                  data={data}
                  renderItem={({ item }) => (
                    <View style={styles.labels}>
                      <Text style={styles.labelText}>{item}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              );
            default:
              return null;
          }
        }}
      />
    );
  };
  
  export default Details;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f4f4f4",
    },
    banner: {
      width: "100%",
      height: 300,
      resizeMode: "cover",
    },
    backButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "white",
      position: "absolute",
      top: 60,
      left: 20,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1, // Ensure button is above the image
    },
    backIcon: {
      width: 20,
      height: 20,
    },
    detailsContainer: {
      paddingHorizontal: 20,
      backgroundColor: "#f4f4f4",
    },
    title: {
      fontWeight: "800", // Fixed typo
      fontSize: 30,
      alignSelf: "center",
      textAlign: "center",
    },
    source: {
      marginLeft: 20,
      marginRight: 20,
      textAlign: "center",
      fontSize: 16,
      marginTop: 10,
    },
    typeItem: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      paddingBottom: 10,
      marginLeft: 10,
      borderRadius: 8,
    },
    labels: {
      width: "90%",
      alignSelf: "center",
      height: 50,
      backgroundColor: "transparent", // Make background invisible
      justifyContent: "center",
      marginTop: 10,
      paddingLeft: 15,
      paddingRight: 15,
      borderWidth: 0.5,
      borderRadius: 15,
      borderColor: "#ccc", // Light border color for separation
    },
    labelText: {
      fontSize: 16, // Larger font size for better readability
      fontWeight: "600", // Make the text bold
      color: "#333", // Darker text color for better contrast
    },
    footerSpace: {
      height: 50, // Extra space at the end of the FlatList
    },
    caloriesValue: {
      fontSize: 12,
      color: "red", // Red color for the calorie value
      fontWeight: "700", // Bold font for better visibility
    },
    nutritionContainer: {
      flexDirection: "row",  // Arrange items in a row
      justifyContent: "space-between", // Space them evenly
      paddingHorizontal: 20,
      marginTop: 10,
    },
    nutritionText: {
      fontSize: 12,
      fontWeight: "500",
      color: "black",
    },
    nutritionValue: {
      fontSize: 12,
      fontWeight: "600",
      color: "#666", // Slightly darker color for values
    },
        searchIcon: {
      width: 20,
      height: 20,
      tintColor: "#9e9e9e", // Icon color
      marginRight: 10,
    },
  });
  