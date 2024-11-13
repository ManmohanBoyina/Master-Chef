// app/_layout.js
import React from "react";
import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./(redux)/store";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey="pk_test_51QK7TdDPX1vS7DSIIpn5HXIuhe8tj1Vhwiga87e6Xaoau5mJGtD0nhhzr8wUnfYKJPLYMOT9AfZWaGdeMvK9ixuV00RB95IVAB">
        <QueryClientProvider client={queryClient}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </SafeAreaView>
        </QueryClientProvider>
      </StripeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // this will be visible above the notch
  },
});
