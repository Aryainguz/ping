import { useSignIn, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";


const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const {user} = useUser();

  if (user) {
    router.replace("/chats");
    return

  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Text style={styles.heading}>Sign In</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="simon@galaxies.dev"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.inputField}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      <TouchableOpacity onPress={onSignInPress} style={styles.button}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={{ textAlign: "center" }}>
        Don't have an account ?
        {" "}
        <Text
          onPress={() => router.replace("/signup")}
          style={{ color: "#002DE3" }}
        >
           Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 33,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 33,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#002DE3",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  TouchableOpacity: {
    margin: 8,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#002DE3",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 9,
  },
  btnText: {
    color: "#fff",
  },
});

export default Login;
