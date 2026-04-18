import "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AppStateProvider } from "./src/context/AppState";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { NutritionScreen } from "./src/screens/NutritionScreen";
import { WorkoutScreen } from "./src/screens/WorkoutScreen";
import { ProgressScreen } from "./src/screens/ProgressScreen";

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f6f0e8",
    card: "#fffaf4",
    primary: "#e76f51",
    text: "#1f2933",
    border: "#eadfd3",
  },
};

const iconByRoute: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Dashboard: "view-dashboard-outline",
  Nutrition: "food-apple-outline",
  Workout: "dumbbell",
  Progress: "chart-line",
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="dark" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: "#e76f51",
              tabBarInactiveTintColor: "#7b8794",
              tabBarStyle: {
                backgroundColor: "#fffaf4",
                borderTopColor: "#eadfd3",
                height: 78,
                paddingBottom: 14,
                paddingTop: 6,
              },
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name={iconByRoute[route.name]} color={color} size={size} />
              ),
            })}
          >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Nutrition" component={NutritionScreen} />
            <Tab.Screen name="Workout" component={WorkoutScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
