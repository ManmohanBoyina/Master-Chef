import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import AppWrapper from "./(redux)/AppWrapper";
import { Provider } from "react-redux";
import { store } from "./(redux)/store";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions = {{
        headerShown: false, // hide all headers by default
          animation: 'slide_from_right',
        }}>
        </Stack>
      </QueryClientProvider>
    </Provider>
  );
}