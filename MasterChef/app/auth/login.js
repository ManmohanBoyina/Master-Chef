import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/api";
import { loginUserAction } from "../(redux)/authSlice";
import { useDispatch } from "react-redux";

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
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (mutation?.isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: 10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scrollAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scrollAnim.setValue(0);
    }
  }, [mutation?.isLoading]);

  return (
    <ImageBackground
      source={{
        uri: "https://cdn.pixabay.com/photo/2016/12/10/21/26/food-1898194_1280.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>

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
                dispatch(loginUserAction(data));
                router.push("/(tabs)");
              })
              .catch((error) => {
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

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    transform: [{ translateX: scrollAnim }],
                  },
                ]}
              >
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  {mutation?.isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </Formik>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#fff",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    elevation: 4,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fafafa",
    fontSize: 16,
    color: "#333",
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
