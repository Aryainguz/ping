import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'

const Settings = () => {
  const { signOut } = useAuth()
  return (
    <View>
      <Button title="LogOut" onPress={() => 
        signOut()
      } />
    </View>
  )
}

export default Settings