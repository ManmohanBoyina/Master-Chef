import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/api";
import { loginUserAction } from "../(redux)/authSlice";
import { useDispatch, useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email")
    .label("Email"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters")
    .label("Password"),
});

const Login = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });
  const dispatch = useDispatch();
  useSelector((state) => console.log("Store Data", state));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Show error message if the mutation fails */}
      {mutation?.isError && (
        <Text style={styles.errorText}>
          {mutation?.error?.response?.data?.message || "Invalid credentials"}
        </Text>
      )}
      {mutation?.isSuccess && (
        <Text style={styles.successText}>Login successful</Text>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          mutation
            .mutateAsync(values)
            .then((data) => {
              // Handle successful login response
              dispatch(loginUserAction(data));
              router.push("/(tabs)"); // Navigate to the dashboard or another screen
            })
            .catch((error) => {
              // Handle error during the mutation
              console.error("Login failed:", error);
            });
        }}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
              placeholderTextColor="#888"
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              {mutation?.isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f4f8", // Light gray background for a clean look
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32, // More margin to give space
    color: "#333",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400, // Constrain the width for larger screens
    padding: 16,
    backgroundColor: "#fff", // White background for the form
    borderRadius: 12, // Rounded corners for a smooth look
    elevation: 4, // Subtle shadow for depth
  },
  input: {
    height: 50,
    borderColor: "#ddd", // Soft border color
    borderWidth: 1,
    borderRadius: 10, // Rounded input fields
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fafafa", // Light background for inputs
    fontSize: 16,
    color: "#333",
    elevation: 2, // Slight shadow for inputs
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center", // Center the error text
  },
  successText: {
    color: "green",
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 16,
    elevation: 3, // Slight shadow for the button
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
