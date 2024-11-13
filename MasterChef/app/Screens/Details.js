import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  Share,
} from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';

const Details = () => {
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();

  const calorieValue = parseInt(route.params.data.recipe.calories, 10);
  const weightValue = parseInt(route.params.data.recipe.totalWeight, 10);
  const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${route.params.data.recipe.label}\nSource: ${route.params.data.recipe.source}\nLink: ${route.params.data.recipe.url}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the recipe");
    }
  };

  const detailsData = [
    { type: "image" },
    { type: "title", label: route.params.data.recipe.label, source: route.params.data.recipe.source },
    { type: "nutrition" },
    { type: "tabs" },
    { type: "list", tab: selectedTab },
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
              </View>
            );
          case "title":
            return (
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.label}</Text>
                <View style={styles.sourceContainer}>
                  <Text style={styles.source}>{"added by " + item.source}</Text>
                  <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <Icon name="share-alt" size={20} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          case "nutrition":
            return (
              <View style={styles.nutritionContainer}>
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
                  "Instructions",
                ]}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item, index }) => (
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
                )}
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
                : item.tab === 6
                ? route.params.data.recipe.dishType
                : route.params.data.recipe.instructions && route.params.data.recipe.instructions.length > 0
                ? route.params.data.recipe.instructions
                : ["Instructions are not provided for this recipe."];

            return (
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <View style={styles.labels}>
                    <Text
                      style={[
                        styles.labelText,
                        item === "Instructions are not provided for this recipe."
                          ? styles.fallbackText
                          : null,
                      ]}
                    >
                      {item}
                    </Text>
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
  detailsContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontWeight: "800",
    fontSize: 30,
    alignSelf: "center",
    textAlign: "center",
  },
  sourceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  source: {
    fontSize: 16,
    color: "#333",
  },
  shareButton: {
    transform: [{ scale: 1.2 }],
    marginLeft: 10,
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
    backgroundColor: "transparent",
    justifyContent: "center",
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0.5,
    borderRadius: 15,
    borderColor: "#ccc",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  fallbackText: {
    color: "red",
    fontWeight: "bold",
  },
  caloriesValue: {
    fontSize: 12,
    color: "red",
    fontWeight: "700",
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    color: "#666",
  },
});
