import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Linking } from "react-native";
import { useRoute } from "@react-navigation/native";

const RecipeDetail = () => {
  const route = useRoute();
  const recipe = route.params?.recipe;
  console.log("Recipe:", recipe);

  if (!recipe) {
    return <Text style={styles.errorText}>Recipe data is not available.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Display recipe image if available */}
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
      ) : (
        <Text style={styles.errorText}>Image not available</Text>
      )}

      {/* Recipe name */}
      <Text style={styles.recipeName}>{recipe.recipename || "Recipe Name Not Available"}</Text>

      {/* Ingredients list */}
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.ingredientLines && recipe.ingredientLines.length > 0 ? (
        recipe.ingredientLines.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            • {ingredient.trim()}
          </Text>
        ))
      ) : (
        <Text style={styles.errorText}>No ingredients available</Text>
      )}

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions:</Text>
      {recipe.instructions
        ? recipe.instructions.split(",").map((instruction, index) => (
            <Text key={index} style={styles.instruction}>
              • {instruction.trim()}
            </Text>
          ))
        : <Text style={styles.errorText}>No instructions available</Text>}

      {/* Video tutorial link, if available */}
      {recipe.videoUrl ? (
        <>
          <Text style={styles.sectionTitle}>Video Tutorial:</Text>
          <Text
            style={styles.videoLink}
            onPress={() => Linking.openURL(recipe.videoUrl)}
          >
            Watch Video
          </Text>
        </>
      ) : (
        <Text style={styles.errorText}>No video available</Text>
      )}
    </ScrollView>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#555",
  },
  ingredient: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#ff6347",
  },
  instruction: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#ff6347",
  },
  videoLink: {
    fontSize: 16,
    color: "#0066cc",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});
