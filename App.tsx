import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import WardrobeScreen from './src/screens/WardrobeScreen';
import ScanClothesScreen from './src/screens/ScanClothesScreen';
import OutfitsScreen from './src/screens/OutfitsScreen';
import OnlineItemsScreen from './src/screens/OnlineItemsScreen';

// Import database initialization
import { initDatabase } from './src/services/database';

const Tab = createBottomTabNavigator();

export default function App() {
  React.useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

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
}
