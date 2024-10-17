import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

const ProtectedRoute = ({ children }) => { // Fixed 'children' typo
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth); // Corrected state destructuring

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/app/auth/login"); // Navigate to login if not authenticated and not loading
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return null; // Prevent rendering the children if not authenticated
  }

  return children; // Return the protected components if authenticated
};

export default ProtectedRoute;
