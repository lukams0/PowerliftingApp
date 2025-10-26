import { Tabs } from 'expo-router';
import { BookOpen, Dumbbell, History, Home, User } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function AthleteLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
        }}
      />
      {/* Hide nested routes from tabs */}
      <Tabs.Screen
        name="history/[workoutId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title: 'Programs',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          href: {
            pathname: '/(athlete)/programs',
          },
        }}
      />
      {/* Hide nested routes from tabs */}
      <Tabs.Screen
        name="programs/[programId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="programs/block/[blockId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="programs/workout/[workoutId]"
        options={{
          href: null,
        }}
      />
      {/* Active workout session screen - hidden from tabs */}
      <Tabs.Screen
        name="session/[sessionId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
          href: {
            pathname: '/(athlete)/exercises',
          },
        }}
      />
      {/* Hide nested routes from tabs */}
      <Tabs.Screen
        name="exercises/[exerciseId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}