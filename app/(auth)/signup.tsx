import { useSignUp } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/home');
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />
      <Text style={styles.heading}>Sign Up</Text>
      {!pendingVerification && (
        <>
          <TextInput autoCapitalize="none" placeholder="simon@galaxies.dev" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
          <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />

          <TouchableOpacity onPress={onSignUpPress} style={styles.button} >
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center' }}>Already have an account? <Text onPress={() => router.replace('/signin')} style={{ color: '#002DE3' }}>Sign In</Text></Text>
        </>
      )}

      {pendingVerification && (
        <>
          <View  style={styles.container}>
            <Text style={styles.heading}>Verify Email</Text>
            <TextInput value={code} placeholder="Code..." style={styles.inputField} onChangeText={setCode} />
          </View>
          <TouchableOpacity onPress={onPressVerify} style={styles.button}>
            <Text style={styles.btnText}>Verify</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 33,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 33,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#002DE3',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  TouchableOpacity: {
    margin: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#002DE3',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 9,

  },
  btnText: {
    color: '#fff',
  },
});

export default Register;