import { Tabs } from 'expo-router';
import { BookOpen, Dumbbell, History, Home, User } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../../components/ActiveWorkoutBar';
import { useWorkout } from '../../contexts/WorkoutContext';

export default function AthleteLayout() {
  const { sessionId, activeSession } = useWorkout();
  const isWorkoutActive = !!sessionId;

  return (
    <YStack f={1}>
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
        <Tabs.Screen
          name="exercises/[exerciseId]"
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Active Workout Bar - positioned above tab bar */}
      {isWorkoutActive && activeSession && (
        <View
          style={{
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 88 : 60,
            left: 0,
            right: 0,
            zIndex: 100,
          }}
          pointerEvents="box-none"
        >
          <ActiveWorkoutBar
            workoutName={activeSession.name || 'Workout'}
            startTime={new Date(activeSession.start_time).getTime()}
            exerciseCount={0} // You can track this in context if needed
          />
        </View>
      )}
    </YStack>
  );
}