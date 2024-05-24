import { Link } from "expo-router";
import { Image, Text, View, useColorScheme } from "react-native";
import {
  TouchableOpacity,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const Index = () => {
  const mode = useColorScheme();
  return (
    <GestureHandlerRootView>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mode === "dark" ? "#0F1828" : "#fff",
        }}
      >
        <Image
          source={mode =="dark" ? require("../assets/images/Illustration-dark.png") : require("../assets/images/Illustration.png")}
          style={{
            position: "relative",
            top: 20,
            width: 262,
            height: 270,
          }}
        />
        <View
          style={{
            position: "relative",
            top: 30,
          }}
        >
          <Text
            style={{
              padding: 15,
              fontSize: 23,
              fontWeight: "semibold",
              textAlign: "center",
              marginTop: 20,
              color: mode === "dark" ? "#fff" : "#0F1828",
              position: "relative",
              top: 20,
            }}
          >
            Chat anyone, anywhere in the world with{" "}
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 23,
                top: 20,
                backgroundColor: "yellow",
              }}
            >
              {" "}
              ping. 
              {" "}
            </Text>
          </Text>
        </View>

        <Text
          style={{
            fontSize: 15,
            color: mode === "dark" ? "#fff" : "#0F1828",

            position: "relative",
            top: 90,
          }}
        >
          Terms & Privacy Policy
        </Text>

        <Link href="/home">
          <TouchableOpacity
            style={{
              backgroundColor: "#002DE3",
              padding: 19,
              width: 300,
              alignItems: "center",
              borderRadius: 29,
              position: "relative",
              top: 100,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
              }}
            >
              Start Pinging
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </GestureHandlerRootView>
  );
};

export default Index;
