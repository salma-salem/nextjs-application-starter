import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import WardrobeScreen from './src/screens/WardrobeScreen';
import ScanClothesScreen from './src/screens/ScanClothesScreen';
import OutfitsScreen from './src/screens/OutfitsScreen';
import OnlineItemsScreen from './src/screens/OnlineItemsScreen';

// Import database context
import { DatabaseProvider, useDatabaseContext } from './src/contexts/DatabaseContext';

const Tab = createBottomTabNavigator();

const AppContent = () => {
  const { isInitialized, isLoading, error } = useDatabaseContext();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-lg text-gray-600">Initializing database...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-8">
        <Ionicons name="warning-outline" size={64} color="#ef4444" />
        <Text className="mt-4 text-xl font-bold text-red-600">Database Error</Text>
        <Text className="mt-2 text-center text-gray-600">{error}</Text>
        <Text className="mt-4 text-center text-sm text-gray-500">
          Please restart the app to try again
        </Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="server-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-lg text-gray-600">Setting up database...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Wardrobe') {
              iconName = focused ? 'shirt' : 'shirt-outline';
            } else if (route.name === 'Scan') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Outfits') {
              iconName = focused ? 'layers' : 'layers-outline';
            } else if (route.name === 'Online') {
              iconName = focused ? 'globe' : 'globe-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Wardrobe" 
          component={WardrobeScreen}
          options={{ title: 'My Wardrobe' }}
        />
        <Tab.Screen 
          name="Scan" 
          component={ScanClothesScreen}
          options={{ title: 'Scan Clothes' }}
        />
        <Tab.Screen 
          name="Outfits" 
          component={OutfitsScreen}
          options={{ title: 'My Outfits' }}
        />
        <Tab.Screen 
          name="Online" 
          component={OnlineItemsScreen}
          options={{ title: 'Online Store' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}
