import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux"; 
import config from "../../config";
const AddRecipe = () => {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // New state for video URL
  const [instructions, setInstructions] = useState("");

  const userEmail = useSelector((state) => state.auth.user?.email);

  const addRecipeToDatabase = async () => {
    if (!recipeName || !ingredients || !instructions) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    const newRecipe = {
      recipename: recipeName,
      ingredientLines: ingredients.split(","),
      imageUrl,
      videoUrl, // Include video URL
      instructions,
      email: userEmail,
    };

    try {
      const response = await fetch(`${config.API_URL}/api/recipe/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        Alert.alert("Success", "Recipe added successfully!");
        setRecipeName("");
        setIngredients("");
        setImageUrl("");
        setVideoUrl(""); // Clear video URL input
        setInstructions("");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to add recipe");
      }
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Error", "Could not add the recipe. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Your Recipe</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingredients (comma-separated)"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <TextInput
        style={styles.input}
        placeholder="Video URL"
        value={videoUrl}
        onChangeText={setVideoUrl}
      />

      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      <TouchableOpacity style={styles.addButton} onPress={addRecipeToDatabase}>
        <Text style={styles.buttonText}>Add Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    backgroundColor: "#05B681",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
