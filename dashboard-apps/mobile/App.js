import React from 'react';
import './i18n';
import { configureApi } from '@shared/api/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './screens/Dashboard';
import Home from './screens/Home';
import Claims from './screens/Claims';
import ClaimDetail from './screens/ClaimDetail';
import SearchPcp from './screens/SearchPcp';

// Point all shared hooks at the Next.js dev server
configureApi('http://localhost:3000');

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Claims" component={Claims} />
        <Stack.Screen name="ClaimDetail" component={ClaimDetail} />
        <Stack.Screen name="SearchPcp" component={SearchPcp} />
        <Stack.Screen name="MemberInformation" component={require('./screens/MemberInformation').default} />
        <Stack.Screen name="AccessPermission" component={require('./screens/AccessPermission').default} />
        <Stack.Screen name="Preferences" component={require('./screens/Preferences').default} />
        <Stack.Screen name="SecurityDetails" component={require('./screens/SecurityDetails').default} />
        <Stack.Screen name="MyPlans" component={require('./screens/MyPlans').default} />
        <Stack.Screen name="ProviderProfile" component={require('./screens/ProviderProfile').default} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
