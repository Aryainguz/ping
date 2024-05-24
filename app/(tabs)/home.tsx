import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const home = () => {
  const { signOut } = useAuth();

  const {user} = useUser();
  const router = useRouter();
  
    if (!user) {
      router.replace("/signin");
      return
    }
  

  return (
    <View>
      <Text>home</Text>

      <Button
        title='logout'
        onPress={() => {
          // Sign out the user
          signOut();
        }}
      />
    </View>
  )
}

export default home