//Test ADs code
// import React from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// // import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to My AdMob App</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color:'#fff'
//   },
//   adContainer: {
//     alignItems: 'center',
//   },
// });


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from './src/screens/LoginScreen';
// import RegisterScreen from './src/screens/RegisterScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import EditPreferencesScreen from './src/screens/EditPreferencesScreen';
// import MatchingScreen from './src/screens/MatchingScreen';
// import ChatScreen from './src/screens/ChatScreen';

// const Stack = createNativeStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         <Stack.Screen name="EditPreferences" component={EditPreferencesScreen} />
//         <Stack.Screen name="Matching" component={MatchingScreen} />
//         <Stack.Screen name="Chat" component={ChatScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

//100% working code
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { View, StyleSheet, Text } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import LoginScreen from './src/screens/LoginScreen';
// import RegisterScreen from './src/screens/RegisterScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import AddPostScreen from './src/screens/AddPostScreen';
// import CommentScreen from './src/screens/CommentScreen';
// import SearchUsersScreen from './src/screens/SearchUsersScreen';
// import ChatScreen from './src/screens/ChatScreen';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     // <View  style={styles.container}>
//     //   <Text style={styles.title}>Welcome to My AdMob App</Text>
//     // </View>
//     <SafeAreaProvider>
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="AddPost" component={AddPostScreen} />
//         <Stack.Screen name="Comments" component={CommentScreen} />
//         <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
//         <Stack.Screen name="Chat" component={ChatScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   adContainer: {
//     alignItems: 'center',
//   },
// });

//100% working code
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Feather from 'react-native-vector-icons/Feather';
// import { Home, PlusCircle, Search, User, Calendar  } from 'lucide-react-native';
// import { Pressable } from 'react-native';
// import { FilteredCamera } from './FilteredCamera';
// import 'react-native-gesture-handler';
// import 'react-native-reanimated';

// // Screens
// import LoginScreen from './src/screens/LoginScreen';
// import RegisterScreen from './src/screens/RegisterScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import AddPostScreen from './src/screens/AddPostScreen';
// import CommentScreen from './src/screens/CommentScreen';
// import SearchUsersScreen from './src/screens/SearchUsersScreen';
// import ChatScreen from './src/screens/ChatScreen';
// import CustomCamera from './src/screens/CustomCamera';
// import EditMediaScreen from './src/screens/EditMediaScreen';
// import Events from './src/screens/Events';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // 👇 Bottom Tab Navigator shown after login
// function MainTabs() {
//   const insets = useSafeAreaInsets();
//   return (
    
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarActiveTintColor: '#FF6B35',
//         tabBarInactiveTintColor: '#64748B',
//         tabBarStyle: {
//           backgroundColor: '#FFFFFF',
//           // height: 60 + insets.bottom,
//           // paddingBottom: 8, // ✅ Give it room above system nav
//           paddingTop: 4,
//           borderTopWidth: 1,
//           borderTopColor: '#E2E8F0',
//           position: 'absolute', // <- helps Android draw it above system nav
//         },
//         tabBarIcon: ({ color, size, focused }) => {
//           const stroke = focused ? 2 : 1.5; // thinner stroke

//           if (route.name === 'Home') return <Home size={size} color={color} strokeWidth={stroke} />;
//           if (route.name === 'Calendar') return <Calendar size={size} color={color} strokeWidth={stroke} />;
//           if (route.name === 'AddPost') return <PlusCircle size={size} color={color} strokeWidth={stroke} />;
//           if (route.name === 'SearchUsers') return <Search size={size} color={color} strokeWidth={stroke} />;
//           if (route.name === 'Profile') return <User size={size} color={color} strokeWidth={stroke} />;
//         },
//         tabBarButton: (props) => (
//           <Pressable
//             {...props}
//             android_ripple={{
//               color: 'transparent', // ✅ disables visible ripple
//               borderless: false,
//             }}
//             style={({ pressed }) => [
//               {
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 opacity: pressed ? 0.6 : 1, // ✅ subtle feedback
//               },
//             ]}
//           />
//         )
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Calendar" component={Events} />
//       <Tab.Screen name="AddPost" component={AddPostScreen} />
//       <Tab.Screen name="SearchUsers" component={SearchUsersScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//       {/* <Tab.Screen name="Chat" component={ChatScreen} /> */}
//     </Tab.Navigator>
    
//   );
// }

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />

//           {/* 👇 After login, render tab navigator */}
//           <Stack.Screen name="MainTabs" component={MainTabs} />

//           {/* 👇 Additional deep navigation routes */}
//           <Stack.Screen name="Home" component={HomeScreen} />

//           <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
//           <Stack.Screen name="Comments" component={CommentScreen} />
//           <Stack.Screen name="Chat" component={ChatScreen} />
//           <Stack.Screen name="CustomCamera" component={CustomCamera} /> 
//           <Stack.Screen name="EditMediaScreen" component={EditMediaScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }

// App.tsx
// App.tsx
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Home, PlusCircle, Search, User, Calendar } from 'lucide-react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddPostScreen from './src/screens/AddPostScreen';
import CommentScreen from './src/screens/CommentScreen';
import SearchUsersScreen from './src/screens/SearchUsersScreen';
import ChatScreen from './src/screens/ChatScreen';
import CustomCamera from './src/screens/CustomCamera';
import EditMediaScreen from './src/screens/EditMediaScreen';
import Events from './src/screens/Events';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// --- Home tab stack (keeps tab bar on Chat)
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Comments" component={CommentScreen} />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
      {/* <HomeStack.Screen name="AddPostScreen" component={AddPostScreen} /> */}
    </HomeStack.Navigator>
  );
}

// --- Tabs after login
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          position: 'absolute',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const stroke = focused ? 2 : 1.5;
          if (route.name === 'Home') return <Home size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'Calendar') return <Calendar size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'AddPost') return <PlusCircle size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'SearchUsers') return <Search size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'Profile') return <User size={size} color={color} strokeWidth={stroke} />;
          return null;
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: 'transparent', borderless: false }}
            style={({ pressed }) => [
              { flex: 1, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 },
            ]}
          />
        ),
      })}
    >
      {/* <Tab.Screen name="Home" component={HomeStackNavigator} /> */}
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={({ route }) => {
          const nested = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
          const onChat = nested === 'Chat';

          return {
            tabBarIcon: ({ color, size, focused }) => {
              // make Home icon appear inactive when you're on Chat
              const effectiveFocused = focused && !onChat;
              const effectiveColor = effectiveFocused ? '#FF6B35' : '#64748B';
              const stroke = effectiveFocused ? 2 : 1.5;
              return <Home size={size} color={effectiveColor} strokeWidth={stroke} />;
            },
            // Optional: tweak label/aria if you use them
            tabBarAccessibilityLabel: 'Home',
          };
        }}
      />

      <Tab.Screen name="Calendar" component={Events} />
      <Tab.Screen name="AddPost" component={AddPostScreen} />
      <Tab.Screen name="SearchUsers" component={SearchUsersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* <Tab.Screen name="EditMediaScreen" component={EditMediaScreen} /> */}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Register" component={RegisterScreen} />
          <RootStack.Screen name="MainTabs" component={MainTabs} />
          {/* Full-screen routes that intentionally sit above tabs */}
          <RootStack.Screen name="CustomCamera" component={CustomCamera} />
          <RootStack.Screen name="EditMediaScreen" component={EditMediaScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


