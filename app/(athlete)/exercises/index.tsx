import { router } from 'expo-router';
import { Plus, Search, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../../components/ActiveWorkoutBar';

const mockExercises = [
  { id: '1', name: 'Squat', category: 'Legs', pr: '315 lbs', lastUsed: '2 days ago' },
  { id: '2', name: 'Bench Press', category: 'Chest', pr: '225 lbs', lastUsed: '3 days ago' },
  { id: '3', name: 'Deadlift', category: 'Back', pr: '405 lbs', lastUsed: '5 days ago' },
  { id: '4', name: 'Overhead Press', category: 'Shoulders', pr: '135 lbs', lastUsed: '1 week ago' },
  { id: '5', name: 'Barbell Row', category: 'Back', pr: '185 lbs', lastUsed: '3 days ago' },
  { id: '6', name: 'Romanian Deadlift', category: 'Legs', pr: '275 lbs', lastUsed: '5 days ago' },
];

const categories = ['All', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms'];

export default function ExercisesIndexScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleExercisePress = (exerciseId: string) => {
    router.push(`/(athlete)/exercises/${exerciseId}`);
  };

  const handleCreateExercise = () => {
    router.push('/create-exercise');
  };

  // Mock active workout data - in real app, get from context: const { activeWorkout, isWorkoutActive } = useWorkout();
  const isWorkoutActive = false;
  const activeWorkout = {
    name: 'Upper Body A',
    startTime: Date.now() - 600000,
    exercises: [{ id: '1' }, { id: '2' }]
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Header */}
            <XStack ai="center" jc="space-between">
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                Exercises
              </Text>
              <Button
                size="$3"
                chromeless
                color="#7c3aed"
                fontWeight="600"
                onPress={handleCreateExercise}
                pressStyle={{ opacity: 0.7 }}
              >
                <XStack ai="center" gap="$1">
                  <Plus size={20} color="#7c3aed" />
                  <Text color="#7c3aed" fontWeight="600">New</Text>
                </XStack>
              </Button>
            </XStack>

            {/* Search Bar */}
            <XStack
              backgroundColor="white"
              borderRadius="$4"
              ai="center"
              px="$3"
              py="$2"
              gap="$2"
              borderWidth={1}
              borderColor="#e5e7eb"
            >
              <Search size={20} color="#9ca3af" />
              <Input
                f={1}
                placeholder="Search exercises..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                unstyled
                fontSize="$4"
              />
            </XStack>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="$3"
                    backgroundColor={selectedCategory === category ? '#7c3aed' : 'white'}
                    color={selectedCategory === category ? 'white' : '$gray11'}
                    borderColor="#e9d5ff"
                    borderWidth={1}
                    onPress={() => setSelectedCategory(category)}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    {category}
                  </Button>
                ))}
              </XStack>
            </ScrollView>

            {/* Exercise List */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Your Exercises
              </Text>
              {mockExercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  elevate
                  size="$4"
                  p="$4"
                  backgroundColor="white"
                  pressStyle={{ opacity: 0.7, scale: 0.98 }}
                  onPress={() => handleExercisePress(exercise.id)}
                >
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$2" f={1}>
                      <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        {exercise.name}
                      </Text>
                      <XStack ai="center" gap="$2">
                        <XStack
                          backgroundColor="#faf5ff"
                          px="$2"
                          py="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$1" fontWeight="600" color="#7c3aed">
                            {exercise.category}
                          </Text>
                        </XStack>
                        <Text fontSize="$3" color="$gray10">
                          Last used: {exercise.lastUsed}
                        </Text>
                      </XStack>
                    </YStack>
                    <YStack ai="flex-end" gap="$1">
                      <XStack ai="center" gap="$1">
                        <TrendingUp size={16} color="#7c3aed" />
                        <Text fontSize="$5" fontWeight="bold" color="#7c3aed">
                          {exercise.pr}
                        </Text>
                      </XStack>
                      <Text fontSize="$2" color="$gray10">
                        PR
                      </Text>
                    </YStack>
                  </XStack>
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