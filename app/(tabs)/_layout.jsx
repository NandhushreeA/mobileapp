import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name='home'
        options={{
        title:'Inventory',
        headerShown:false,
        tabBarIcon:({color})=><MaterialIcons name="inventory" size={24} color={color} />
        }}/>
        <Tabs.Screen name='profile'options={{
     title:'Profile',
     headerShown:false,
     tabBarIcon:({color})=><Ionicons name="people" size={24} color={color}/>
    }}/>
        <Tabs.Screen name='AMC'options={{
     title:'AMC',
     headerShown:false,
     tabBarIcon:({color})=><MaterialIcons name="build" size={24} color={color}/>
    }}/>
    </Tabs>
  )
}

export default _layout