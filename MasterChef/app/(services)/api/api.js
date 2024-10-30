import axios from "axios";

// Function for logging in the user
const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      "https://brave-boxes-enjoy.loca.lt/api/users/login",
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (error) {
    // Handle errors gracefully
    if (error.response) {
      // Server responded with a status other than 200
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server. Please try again later.");
    } else {
      // Something else went wrong during the request
      throw new Error(error.message || "An unknown error occurred.");
    }
  }
};

// Function for registering a new user
const registerUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      "https://brave-boxes-enjoy.loca.lt/api/users/register",
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (error) {
    // Handle errors similarly to login
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error(error.message || "An unknown error occurred.");
    }
  }
};

export { loginUser, registerUser };