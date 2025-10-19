import { router } from 'expo-router';
import { Calendar, Play, Plus, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../components/ActiveWorkoutBar';

// Mock data - replace with actual data later
const mockWorkouts = [
  {
    id: '1',
    name: 'Upper Body A',
    lastPerformed: '2 days ago',
    exerciseCount: 6,
    isRecommended: true,
  },
  {
    id: '2',
    name: 'Lower Body A',
    lastPerformed: '4 days ago',
    exerciseCount: 5,
    isRecommended: false,
  },
  {
    id: '3',
    name: 'Push Day',
    lastPerformed: '1 week ago',
    exerciseCount: 7,
    isRecommended: false,
  },
];

export default function AthleteIndex() {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>('1');
  
  // Mock active workout data - in real app, get from context: const { activeWorkout, isWorkoutActive } = useWorkout();
  const isWorkoutActive = false; // Change to true to test
  const activeWorkout = {
    name: 'Upper Body A',
    startTime: Date.now() - 600000, // 10 minutes ago
    exercises: [{ id: '1' }, { id: '2' }]
  };

  const handleStartWorkout = () => {
    // Navigate to workout modal
    router.push('/workout');
  };

  const handleQuickStart = () => {
    // TODO: Start empty workout
    console.log('Quick start workout');
  };

  const handleCreateWorkout = () => {
    router.push('/create-workout');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView style={{ flex: 1 }}>
          <YStack p="$4" gap="$4" pb="$6">
            {/* Header */}
            <YStack gap="$2">
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                Ready to Train?
              </Text>
              <Text fontSize="$4" color="$gray10">
                Select a workout to get started
              </Text>
            </YStack>

            {/* Today's Recommended Workout */}
            <Card elevate size="$4" p="$4" backgroundColor="#7c3aed">
              <YStack gap="$3">
                <XStack ai="center" jc="space-between">
                  <XStack ai="center" gap="$2">
                    <Calendar size={20} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="600">
                      TODAY'S WORKOUT
                    </Text>
                  </XStack>
                  <TrendingUp size={20} color="white" />
                </XStack>
                <Text fontSize="$6" fontWeight="bold" color="white">
                  Upper Body A
                </Text>
                <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                  6 exercises • Week 1, Day 1
                </Text>
              </YStack>
            </Card>

            {/* Quick Start Button */}
            <Button
              size="$5"
              backgroundColor="white"
              borderColor="#e9d5ff"
              borderWidth={2}
              onPress={handleQuickStart}
              pressStyle={{ backgroundColor: '#faf5ff' }}
            >
              <XStack ai="center" gap="$2">
                <Plus size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="600" color="#7c3aed">
                  Quick Start Empty Workout
                </Text>
              </XStack>
            </Button>

            {/* Workouts Section */}
            <YStack gap="$3" mt="$2">
              <XStack ai="center" jc="space-between">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Your Workouts
                </Text>
                <Button
                  size="$3"
                  chromeless
                  color="#7c3aed"
                  fontWeight="600"
                  onPress={handleCreateWorkout}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <XStack ai="center" gap="$1">
                    <Plus size={16} color="#7c3aed" />
                    <Text color="#7c3aed" fontWeight="600">New</Text>
                  </XStack>
                </Button>
              </XStack>

              {/* Workout Cards */}
              {mockWorkouts.map((workout) => (
                <Card
                  key={workout.id}
                  elevate
                  size="$4"
                  p="$4"
                  backgroundColor={selectedWorkout === workout.id ? '#faf5ff' : 'white'}
                  borderWidth={2}
                  borderColor={selectedWorkout === workout.id ? '#7c3aed' : 'transparent'}
                  pressStyle={{ opacity: 0.9 }}
                  onPress={() => setSelectedWorkout(workout.id)}
                >
                  <YStack gap="$2">
                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        {workout.name}
                      </Text>
                      {workout.isRecommended && (
                        <XStack
                          backgroundColor="#dcfce7"
                          px="$2"
                          py="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$1" fontWeight="600" color="#16a34a">
                            NEXT UP
                          </Text>
                        </XStack>
                      )}
                    </XStack>
                    <XStack ai="center" gap="$3">
                      <Text fontSize="$3" color="$gray10">
                        {workout.exerciseCount} exercises
                      </Text>
                      <Text fontSize="$3" color="$gray9">
                        •
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        Last: {workout.lastPerformed}
                      </Text>
                    </XStack>
                  </YStack>
                </Card>
              ))}
            </YStack>

            {/* Recent Activity Section */}
            <YStack gap="$3" mt="$2">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Recent Activity
              </Text>
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$1">
                      <Text fontSize="$4" fontWeight="600" color="$gray12">
                        Upper Body A
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        2 days ago • 45 min
                      </Text>
                    </YStack>
                    <YStack ai="flex-end" gap="$1">
                      <Text fontSize="$5" fontWeight="bold" color="#7c3aed">
                        12,450
                      </Text>
                      <Text fontSize="$2" color="$gray10">
                        lbs volume
                      </Text>
                    </YStack>
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

        {/* Fixed Start Button - sits above tab bar */}
        <YStack
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="#e5e7eb"
          p="$4"
          pb="$2"
        >
          <Button
            size="$6"
            backgroundColor="#7c3aed"
            color="white"
            borderRadius="$10"
            disabled={!selectedWorkout}
            opacity={!selectedWorkout ? 0.5 : 1}
            onPress={handleStartWorkout}
            pressStyle={{ backgroundColor: '#6d28d9' }}
          >
            <XStack ai="center" gap="$2">
              <Play size={24} color="white" fill="white" />
              <Text fontSize="$6" fontWeight="bold" color="white">
                Start Workout
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}