import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'

const TabsLayout = () => {
  return (
    <>
    <Tabs>
        <Tabs.Screen 
            name="home"
            options={{
                title: 'Home',
                headerShown: false,
            }}
        />
    </Tabs>
    </>
  )
}

export default TabsLayout