import { router } from 'expo-router';
import { Award, Settings, TrendingUp, User } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../components/ActiveWorkoutBar';

export default function ProfileScreen() {
  // Mock active workout data - in real app, get from context: const { activeWorkout, isWorkoutActive } = useWorkout();
  const isWorkoutActive = false; // Change to true to test
  const activeWorkout = {
    name: 'Upper Body A',
    startTime: Date.now() - 600000,
    exercises: [{ id: '1' }, { id: '2' }]
  };

  const handleSettingsPress = () => {
    router.push('/settings.modal');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Header */}
            <XStack ai="center" jc="space-between">
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                Profile
              </Text>
              <Button
                size="$3"
                chromeless
                color="$gray11"
                onPress={handleSettingsPress}
                pressStyle={{ opacity: 0.7 }}
              >
                <Settings size={24} color="#6b7280" />
              </Button>
            </XStack>

            {/* User Info Card */}
            <Card elevate size="$4" p="$5" backgroundColor="white">
              <YStack ai="center" gap="$3">
                <YStack
                  w={80}
                  h={80}
                  borderRadius="$12"
                  backgroundColor="#7c3aed"
                  ai="center"
                  jc="center"
                >
                  <User size={40} color="white" />
                </YStack>
                <YStack ai="center" gap="$1">
                  <Text fontSize="$7" fontWeight="bold" color="$gray12">
                    John Doe
                  </Text>
                  <Text fontSize="$4" color="$gray10">
                    Intermediate Lifter
                  </Text>
                </YStack>
              </YStack>
            </Card>

            {/* Stats Grid */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Stats
              </Text>
              <XStack gap="$3">
                <Card elevate f={1} p="$4" backgroundColor="white">
                  <YStack gap="$2" ai="center">
                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                      24
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      Workouts
                    </Text>
                  </YStack>
                </Card>
                <Card elevate f={1} p="$4" backgroundColor="white">
                  <YStack gap="$2" ai="center">
                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                      185
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      lbs
                    </Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>

            {/* Personal Records */}
            <YStack gap="$3">
              <XStack ai="center" gap="$2">
                <Award size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Personal Records
                </Text>
              </XStack>
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  {['Squat', 'Bench Press', 'Deadlift'].map((exercise) => (
                    <XStack key={exercise} ai="center" jc="space-between">
                      <Text fontSize="$4" color="$gray11">
                        {exercise}
                      </Text>
                      <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        315 lbs
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </Card>
            </YStack>

            {/* Body Stats */}
            <YStack gap="$3">
              <XStack ai="center" gap="$2">
                <TrendingUp size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Body Stats
                </Text>
              </XStack>
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" jc="space-between">
                    <Text fontSize="$4" color="$gray11">
                      Weight
                    </Text>
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      185 lbs
                    </Text>
                  </XStack>
                  <XStack ai="center" jc="space-between">
                    <Text fontSize="$4" color="$gray11">
                      Height
                    </Text>
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      5'10"
                    </Text>
                  </XStack>
                  <XStack ai="center" jc="space-between">
                    <Text fontSize="$4" color="$gray11">
                      Age
                    </Text>
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      28
                    </Text>
                  </XStack>
                </YStack>
              </Card>
            </YStack>
          </YStack>
        </ScrollView>

        {/* Active Workout Bar */}
        {isWorkoutActive && (
          <YStack 
            position="absolute" 
            bottom={Platform.OS === 'ios' ? 88 : 60} 
            left={0} 
            right={0}
            pointerEvents="box-none"
          >
            <ActiveWorkoutBar
              workoutName={activeWorkout.name}
              startTime={activeWorkout.startTime}
              exerciseCount={activeWorkout.exercises.length}
            />
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}