import { router } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../../components/ActiveWorkoutBar';

const mockHistory = [
  {
    id: '1',
    date: 'Today',
    workout: 'Upper Body A',
    duration: '45 min',
    volume: '12,450 lbs',
    exercises: 6,
  },
  {
    id: '2',
    date: 'Oct 16',
    workout: 'Lower Body A',
    duration: '52 min',
    volume: '15,200 lbs',
    exercises: 5,
  },
  {
    id: '3',
    date: 'Oct 14',
    workout: 'Upper Body B',
    duration: '48 min',
    volume: '11,800 lbs',
    exercises: 6,
  },
  {
    id: '4',
    date: 'Oct 12',
    workout: 'Lower Body B',
    duration: '55 min',
    volume: '16,100 lbs',
    exercises: 5,
  },
];

export default function HistoryScreen() {
  // Mock active workout data - in real app, get from context: const { activeWorkout, isWorkoutActive } = useWorkout();
  const isWorkoutActive = false;
  const activeWorkout = {
    name: 'Upper Body A',
    startTime: Date.now() - 600000,
    exercises: [{ id: '1' }, { id: '2' }]
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push({
      pathname: '/(athlete)/history/[workoutId]',
      params: { workoutId }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Header */}
            <YStack gap="$2">
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                History
              </Text>
              <Text fontSize="$4" color="$gray10">
                Your workout history
              </Text>
            </YStack>

            {/* Summary Stats */}
            <Card elevate size="$4" p="$4" backgroundColor="#7c3aed">
              <YStack gap="$3">
                <Text fontSize="$4" color="white" fontWeight="600">
                  THIS WEEK
                </Text>
                <XStack gap="$4">
                  <YStack f={1} gap="$1">
                    <Text fontSize="$7" fontWeight="bold" color="white">
                      4
                    </Text>
                    <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                      Workouts
                    </Text>
                  </YStack>
                  <YStack f={1} gap="$1">
                    <Text fontSize="$7" fontWeight="bold" color="white">
                      3.2h
                    </Text>
                    <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                      Training Time
                    </Text>
                  </YStack>
                  <YStack f={1} gap="$1">
                    <Text fontSize="$7" fontWeight="bold" color="white">
                      55.5k
                    </Text>
                    <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                      Total Volume
                    </Text>
                  </YStack>
                </XStack>
              </YStack>
            </Card>

            {/* Workout History */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Recent Workouts
              </Text>
              {mockHistory.map((workout) => (
                <Card
                  key={workout.id}
                  elevate
                  size="$4"
                  p="$4"
                  backgroundColor="white"
                  pressStyle={{ opacity: 0.7, scale: 0.98 }}
                  onPress={() => handleWorkoutPress(workout.id)}
                >
                  <YStack gap="$3">
                    <XStack ai="center" jc="space-between">
                      <YStack gap="$1">
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {workout.workout}
                        </Text>
                        <XStack ai="center" gap="$2">
                          <Calendar size={14} color="#9ca3af" />
                          <Text fontSize="$3" color="$gray10">
                            {workout.date}
                          </Text>
                        </XStack>
                      </YStack>
                      <YStack ai="flex-end" gap="$1">
                        <Text fontSize="$6" fontWeight="bold" color="#7c3aed">
                          {workout.volume}
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          volume
                        </Text>
                      </YStack>
                    </XStack>
                    <XStack ai="center" gap="$4">
                      <XStack ai="center" gap="$1">
                        <Clock size={14} color="#9ca3af" />
                        <Text fontSize="$3" color="$gray10">
                          {workout.duration}
                        </Text>
                      </XStack>
                      <Text fontSize="$3" color="$gray9">
                        •
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        {workout.exercises} exercises
                      </Text>
                    </XStack>
                  </YStack>
                </Card>
              ))}
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