import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Repeat } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';

// Mock workout history data
const mockHistoryWorkout = {
  id: '1',
  date: 'Oct 18, 2024',
  workout: 'Upper Body A',
  duration: '45 min',
  volume: '12,450 lbs',
  startTime: '2:30 PM',
  endTime: '3:15 PM',
  exercises: [
    {
      id: 'ex1',
      name: 'Bench Press',
      sets: [
        { id: 's1', reps: 8, weight: 185, rpe: 7, completed: true },
        { id: 's2', reps: 8, weight: 185, rpe: 7.5, completed: true },
        { id: 's3', reps: 7, weight: 185, rpe: 8, completed: true },
        { id: 's4', reps: 6, weight: 185, rpe: 9, completed: true },
      ],
    },
    {
      id: 'ex2',
      name: 'Overhead Press',
      sets: [
        { id: 's1', reps: 10, weight: 95, rpe: 7, completed: true },
        { id: 's2', reps: 10, weight: 95, rpe: 7.5, completed: true },
        { id: 's3', reps: 9, weight: 95, rpe: 8, completed: true },
        { id: 's4', reps: 8, weight: 95, rpe: 8.5, completed: true },
      ],
    },
    {
      id: 'ex3',
      name: 'Incline Dumbbell Press',
      sets: [
        { id: 's1', reps: 12, weight: 60, rpe: 7, completed: true },
        { id: 's2', reps: 12, weight: 60, rpe: 7.5, completed: true },
        { id: 's3', reps: 10, weight: 60, rpe: 8, completed: true },
      ],
    },
    {
      id: 'ex4',
      name: 'Lateral Raises',
      sets: [
        { id: 's1', reps: 15, weight: 20, rpe: 7, completed: true },
        { id: 's2', reps: 15, weight: 20, rpe: 7.5, completed: true },
        { id: 's3', reps: 12, weight: 20, rpe: 8, completed: true },
      ],
    },
    {
      id: 'ex5',
      name: 'Tricep Pushdowns',
      sets: [
        { id: 's1', reps: 12, weight: 50, rpe: 7, completed: true },
        { id: 's2', reps: 12, weight: 50, rpe: 7.5, completed: true },
        { id: 's3', reps: 10, weight: 50, rpe: 8, completed: true },
      ],
    },
    {
      id: 'ex6',
      name: 'Face Pulls',
      sets: [
        { id: 's1', reps: 15, weight: 40, rpe: 6, completed: true },
        { id: 's2', reps: 15, weight: 40, rpe: 7, completed: true },
        { id: 's3', reps: 15, weight: 40, rpe: 7, completed: true },
      ],
    },
  ],
  notes: 'Felt strong today. Bench press moving well. Shoulder felt good.',
};

export default function HistoryWorkoutDetailPage() {
  const { workoutId } = useLocalSearchParams();
  
  // TODO: Fetch workout data based on workoutId
  const workout = mockHistoryWorkout;

  const handleBack = () => {
    router.back();
  };

  const handleDoAgain = () => {
    // TODO: Load this workout template and start a new workout
    console.log('Starting workout again with template:', workoutId);
    router.push('/workout');
  };

  const calculateTotalVolume = (exercise: typeof mockHistoryWorkout.exercises[0]) => {
    return exercise.sets.reduce((total, set) => {
      return total + (set.weight * set.reps);
    }, 0);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <XStack backgroundColor="#f5f5f5" p="$4" ai="center" gap="$3">
          <Button
            size="$3"
            chromeless
            onPress={handleBack}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="#6b7280" />
          </Button>
          <YStack f={1}>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">
              {workout.workout}
            </Text>
            <Text fontSize="$3" color="$gray10">
              {workout.date}
            </Text>
          </YStack>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4" pb="$24">
            {/* Workout Summary Card */}
            <Card elevate size="$4" p="$4" backgroundColor="#7c3aed">
              <YStack gap="$3">
                <XStack ai="center" gap="$2">
                  <Calendar size={20} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="600">
                    WORKOUT SUMMARY
                  </Text>
                </XStack>
                <XStack ai="center" gap="$4">
                  <YStack gap="$1">
                    <Text fontSize="$6" fontWeight="bold" color="white">
                      {workout.volume}
                    </Text>
                    <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                      Total Volume
                    </Text>
                  </YStack>
                  <YStack gap="$1">
                    <Text fontSize="$6" fontWeight="bold" color="white">
                      {workout.duration}
                    </Text>
                    <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                      Duration
                    </Text>
                  </YStack>
                  <YStack gap="$1">
                    <Text fontSize="$6" fontWeight="bold" color="white">
                      {workout.exercises.length}
                    </Text>
                    <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                      Exercises
                    </Text>
                  </YStack>
                </XStack>
                <XStack ai="center" gap="$2">
                  <Clock size={16} color="white" />
                  <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                    {workout.startTime} - {workout.endTime}
                  </Text>
                </XStack>
              </YStack>
            </Card>

            {/* Notes */}
            {workout.notes && (
              <Card elevate size="$4" p="$4" backgroundColor="#fef3c7">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="bold" color="#92400e">
                    Workout Notes
                  </Text>
                  <Text fontSize="$3" color="#78350f" lineHeight="$4">
                    {workout.notes}
                  </Text>
                </YStack>
              </Card>
            )}

            {/* Exercise List */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Exercises
              </Text>

              {workout.exercises.map((exercise, index) => {
                const totalVolume = calculateTotalVolume(exercise);
                return (
                  <Card
                    key={exercise.id}
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                  >
                    <YStack gap="$3">
                      <XStack ai="center" gap="$2">
                        <XStack
                          w={32}
                          h={32}
                          borderRadius="$10"
                          backgroundColor="#faf5ff"
                          ai="center"
                          jc="center"
                        >
                          <Text fontSize="$4" fontWeight="bold" color="#7c3aed">
                            {index + 1}
                          </Text>
                        </XStack>
                        <YStack f={1}>
                          <Text fontSize="$5" fontWeight="bold" color="$gray12">
                            {exercise.name}
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            {exercise.sets.length} sets • {totalVolume.toLocaleString()} lbs
                          </Text>
                        </YStack>
                      </XStack>

                      {/* Sets Table */}
                      <YStack gap="$2">
                        {/* Headers */}
                        <XStack ai="center" gap="$2">
                          <XStack w={40} ai="center" jc="center">
                            <Text fontSize="$1" color="$gray10" fontWeight="600">
                              SET
                            </Text>
                          </XStack>
                          <XStack f={1} ai="center" jc="center">
                            <Text fontSize="$1" color="$gray10" fontWeight="600">
                              WEIGHT
                            </Text>
                          </XStack>
                          <XStack f={1} ai="center" jc="center">
                            <Text fontSize="$1" color="$gray10" fontWeight="600">
                              REPS
                            </Text>
                          </XStack>
                          <XStack f={1} ai="center" jc="center">
                            <Text fontSize="$1" color="$gray10" fontWeight="600">
                              RPE
                            </Text>
                          </XStack>
                        </XStack>

                        {/* Set Rows */}
                        {exercise.sets.map((set, setIndex) => (
                          <XStack
                            key={set.id}
                            ai="center"
                            gap="$2"
                            backgroundColor="#f0fdf4"
                            p="$2"
                            borderRadius="$2"
                          >
                            <XStack w={40} ai="center" jc="center">
                              <Text fontSize="$3" fontWeight="600" color="$gray12">
                                {setIndex + 1}
                              </Text>
                            </XStack>
                            <XStack f={1} ai="center" jc="center">
                              <Text fontSize="$3" fontWeight="600" color="$gray12">
                                {set.weight} lbs
                              </Text>
                            </XStack>
                            <XStack f={1} ai="center" jc="center">
                              <Text fontSize="$3" fontWeight="600" color="$gray12">
                                {set.reps}
                              </Text>
                            </XStack>
                            <XStack f={1} ai="center" jc="center">
                              <Text fontSize="$3" fontWeight="600" color="$gray12">
                                {set.rpe}
                              </Text>
                            </XStack>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>
                  </Card>
                );
              })}
            </YStack>
          </YStack>
        </ScrollView>

        {/* Fixed Do Again Button */}
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
            onPress={handleDoAgain}
            pressStyle={{ backgroundColor: '#6d28d9' }}
          >
            <XStack ai="center" gap="$2">
              <Repeat size={24} color="white" />
              <Text fontSize="$6" fontWeight="bold" color="white">
                Do Workout Again
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}