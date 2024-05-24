import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useRoute,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store"; // Import the SecureStore module

import { useColorScheme } from "@/hooks/useColorScheme";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments(); 

  useEffect(() => {
    if (!isLoaded) {
      return; // Return undefined instead of null
    }
    const inTabsGroup = segments[0] === "(auth)";  // Check if the user is in the (auth) folder  
    if (isSignedIn && !inTabsGroup) {
      router.replace("/home");
    } else if (!isSignedIn) {
      router.replace("/signup");
    }
    console.log("isSignedIn", isSignedIn);
    console.log("isLoaded", isLoaded);
  }, [isSignedIn]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  

  if (!loaded) {
    return null;
  }

  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (e) {
        return null;
      }
    },
    async setToken(key: string, token: string) {
      try {
        await SecureStore.setItemAsync(key, token);
      } catch (e) {
        console.log(e);
      }
    },
    async saveToken(key: string, token: string) {
      try {
        await SecureStore.setItemAsync(key, token);
      } catch (e) {
        console.log(e);
      }
    },
    async deleteToken(key: string) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (e) {
        console.log(e);
      }
    },
  };
  const clerkPublishableKey =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""; // Provide a default value of an empty string
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <InitialLayout />
      </ThemeProvider>
    </ClerkProvider>
  );
}
