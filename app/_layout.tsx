import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';
import { WorkoutProvider } from './contexts/WorkoutContext';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <WorkoutProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(athlete)" />
          <Stack.Screen name="(coach)" />
          <Stack.Screen 
            name="workout" 
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </WorkoutProvider>
    </TamaguiProvider>
  );
}