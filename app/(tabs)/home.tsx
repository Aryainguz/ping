import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo';

const home = () => {
  const { signOut } = useAuth();

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