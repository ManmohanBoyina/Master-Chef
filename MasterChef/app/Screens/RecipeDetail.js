import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Share } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome"; // Using FontAwesome for the share icon

const RecipeDetail = () => {
  const route = useRoute();
  const recipe = route.params?.recipe;
  const [imageError, setImageError] = useState(false); // Error state for image

  if (!recipe) {
    return <Text style={styles.errorText}>Recipe data is not available.</Text>;
  }

  // Extract the YouTube video ID from the URL
  const extractYouTubeId = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|\.be\/)([^"&?/\s]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const videoId = recipe.videoUrl ? extractYouTubeId(recipe.videoUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  // Function to handle sharing the recipe
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.recipename}\n\nIngredients:\n${recipe.ingredientLines.join(", ")}\n\nInstructions:\n${recipe.instructions}`,
      });
    } catch (error) {
      alert("Failed to share recipe");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {recipe.imageUrl && !imageError ? (
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.recipeImage}
          onError={() => setImageError(true)} // Set error if image fails to load
        />
      ) : (
        <Text style={styles.errorText}>Image not available</Text>
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.recipeName}>{recipe.recipename || "Recipe Name Not Available"}</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Icon name="share-alt" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

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

      <Text style={styles.sectionTitle}>Instructions:</Text>
      {recipe.instructions ? (
        recipe.instructions.split(",").map((instruction, index) => (
          <Text key={index} style={styles.instruction}>
            • {instruction.trim()}
          </Text>
        ))
      ) : (
        <Text style={styles.errorText}>No instructions available</Text>
      )}

      {videoId ? (
        <>
          <Text style={styles.sectionTitle}>Video Tutorial:</Text>
          <WebView
            source={{ uri: embedUrl }}
            style={styles.videoPlayer}
            allowsFullscreenVideo
          />
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  shareButton: {
    marginLeft: 8,
    padding: 8,
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
  videoPlayer: {
    width: "100%",
    aspectRatio: 16 / 9, // Maintains 16:9 aspect ratio
    marginTop: 10,
    marginBottom: 20, // Adds spacing below the video
    borderRadius: 10,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});
