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
        title:'Home',
        headerShown:false,
        tabBarIcon:({color})=><MaterialIcons name="home" size={24} color={color} />
        }}/>
        <Tabs.Screen name='customer'
        options={{
        title:'Customer',
        headerShown:false,
        tabBarIcon:({color})=><MaterialIcons name="person" size={24} color={color} />
        }}/>
        <Tabs.Screen name='orders'
        options={{
        title:'Orders',
        headerShown:false,
        tabBarIcon:({color})=><MaterialIcons name="receipt-long" size={24} color={color} />
        }}/>
        <Tabs.Screen name='AMC'
        options={{
        title:'AMC',
        headerShown:false,
        tabBarIcon:({color})=><MaterialIcons name="verified" size={24} color={color} />
        }}/>
        <Tabs.Screen name='RaiseTicket'
        options={{
        title:'Support',
        headerShown:false,
        tabBarIcon:({color})=><MaterialIcons name="support-agent" size={24} color={color} />
        }}/>
        <Tabs.Screen name='MyTickets'
        options={{
        title:'My Tickets',
        headerShown:false,
        tabBarIcon:({color})=><MaterialIcons name="list-alt" size={24} color={color} />
        }}/>
        <Tabs.Screen name='profile'
        options={{
        title:'Profile',
        headerShown:false,
        tabBarIcon:({color})=><Ionicons name="people" size={24} color={color}/>
        }}/>
    </Tabs>
  )
}

export default _layout