import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, CheckCircle, Clock, Dumbbell, Play } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';

// Mock workout data
const mockWorkout = {
  id: 'w3-3',
  name: 'Upper Body B',
  day: 'Thursday',
  weekLabel: 'Week 3',
  blockName: 'Foundation Block',
  programName: 'Strength Building Phase',
  completed: false,
  estimatedDuration: '60 min',
  exercises: [
    {
      id: 'ex1',
      name: 'Overhead Press',
      sets: 4,
      reps: '8',
      weight: '115 lbs',
      rpe: '7-8',
      notes: 'Focus on core stability',
      restTime: '3 min',
    },
    {
      id: 'ex2',
      name: 'Incline Bench Press',
      sets: 4,
      reps: '10',
      weight: '165 lbs',
      rpe: '7-8',
      notes: '',
      restTime: '2.5 min',
    },
    {
      id: 'ex3',
      name: 'Barbell Row',
      sets: 4,
      reps: '10',
      weight: '155 lbs',
      rpe: '7-8',
      notes: 'Keep back flat, pull to sternum',
      restTime: '2.5 min',
    },
    {
      id: 'ex4',
      name: 'Lateral Raises',
      sets: 3,
      reps: '12',
      weight: '20 lbs',
      rpe: '8',
      notes: '',
      restTime: '90 sec',
    },
    {
      id: 'ex5',
      name: 'Face Pulls',
      sets: 3,
      reps: '15',
      weight: '40 lbs',
      rpe: '7',
      notes: 'High rep for shoulder health',
      restTime: '90 sec',
    },
    {
      id: 'ex6',
      name: 'Tricep Pushdowns',
      sets: 3,
      reps: '12',
      weight: '50 lbs',
      rpe: '8',
      notes: '',
      restTime: '90 sec',
    },
  ],
  coachNotes: 'Focus on maintaining good form this week. This is a volume week, so save some energy for Friday\'s lower body session.',
};

export default function WorkoutDetailPage() {
  const { workoutId } = useLocalSearchParams();
  
  // TODO: Fetch workout data based on workoutId
  const workout = mockWorkout;

  const handleBack = () => {
    router.back();
  };

  const handleStartWorkout = () => {
    // Navigate to active workout modal
    router.push('/workout');
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
              {workout.name}
            </Text>
            <Text fontSize="$3" color="$gray10">
              {workout.blockName} • {workout.weekLabel}
            </Text>
          </YStack>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4" pb="$24">
            {/* Workout Info Card */}
            <Card elevate size="$4" p="$4" backgroundColor={workout.completed ? '#f0fdf4' : '#7c3aed'}>
              <YStack gap="$3">
                <XStack ai="center" jc="space-between">
                  <XStack ai="center" gap="$2">
                    <Calendar size={20} color={workout.completed ? '#16a34a' : 'white'} />
                    <Text fontSize="$3" color={workout.completed ? '#16a34a' : 'white'} fontWeight="600">
                      {workout.day.toUpperCase()}
                    </Text>
                  </XStack>
                  {workout.completed && (
                    <XStack
                      backgroundColor="#dcfce7"
                      px="$2"
                      py="$1"
                      borderRadius="$2"
                      ai="center"
                      gap="$1"
                    >
                      <CheckCircle size={14} color="#16a34a" />
                      <Text fontSize="$1" fontWeight="600" color="#16a34a">
                        COMPLETED
                      </Text>
                    </XStack>
                  )}
                </XStack>
                <XStack ai="center" gap="$4">
                  <XStack ai="center" gap="$2">
                    <Dumbbell size={18} color={workout.completed ? '#16a34a' : 'white'} />
                    <Text fontSize="$3" color={workout.completed ? '#16a34a' : 'rgba(255,255,255,0.9)'}>
                      {workout.exercises.length} exercises
                    </Text>
                  </XStack>
                  <XStack ai="center" gap="$2">
                    <Clock size={18} color={workout.completed ? '#16a34a' : 'white'} />
                    <Text fontSize="$3" color={workout.completed ? '#16a34a' : 'rgba(255,255,255,0.9)'}>
                      ~{workout.estimatedDuration}
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            </Card>

            {/* Coach Notes */}
            {workout.coachNotes && (
              <Card elevate size="$4" p="$4" backgroundColor="#fef3c7">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="bold" color="#92400e">
                    Coach Notes
                  </Text>
                  <Text fontSize="$3" color="#78350f" lineHeight="$4">
                    {workout.coachNotes}
                  </Text>
                </YStack>
              </Card>
            )}

            {/* Exercise List */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Exercises
              </Text>

              {workout.exercises.map((exercise, index) => (
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
                      </YStack>
                    </XStack>

                    {/* Sets and Reps */}
                    <XStack gap="$3" flexWrap="wrap">
                      <XStack
                        backgroundColor="#f3f4f6"
                        px="$3"
                        py="$2"
                        borderRadius="$3"
                        gap="$2"
                        ai="center"
                      >
                        <Text fontSize="$2" color="$gray11" fontWeight="600">
                          SETS
                        </Text>
                        <Text fontSize="$4" fontWeight="bold" color="$gray12">
                          {exercise.sets}
                        </Text>
                      </XStack>
                      <XStack
                        backgroundColor="#f3f4f6"
                        px="$3"
                        py="$2"
                        borderRadius="$3"
                        gap="$2"
                        ai="center"
                      >
                        <Text fontSize="$2" color="$gray11" fontWeight="600">
                          REPS
                        </Text>
                        <Text fontSize="$4" fontWeight="bold" color="$gray12">
                          {exercise.reps}
                        </Text>
                      </XStack>
                      <XStack
                        backgroundColor="#f3f4f6"
                        px="$3"
                        py="$2"
                        borderRadius="$3"
                        gap="$2"
                        ai="center"
                      >
                        <Text fontSize="$2" color="$gray11" fontWeight="600">
                          WEIGHT
                        </Text>
                        <Text fontSize="$4" fontWeight="bold" color="$gray12">
                          {exercise.weight}
                        </Text>
                      </XStack>
                    </XStack>

                    {/* RPE and Rest */}
                    <XStack gap="$3">
                      <XStack
                        backgroundColor="#faf5ff"
                        px="$3"
                        py="$2"
                        borderRadius="$3"
                        gap="$2"
                        ai="center"
                      >
                        <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                          RPE
                        </Text>
                        <Text fontSize="$4" fontWeight="bold" color="#7c3aed">
                          {exercise.rpe}
                        </Text>
                      </XStack>
                      <XStack
                        backgroundColor="#faf5ff"
                        px="$3"
                        py="$2"
                        borderRadius="$3"
                        gap="$2"
                        ai="center"
                      >
                        <Clock size={14} color="#7c3aed" />
                        <Text fontSize="$3" color="#7c3aed" fontWeight="600">
                          {exercise.restTime}
                        </Text>
                      </XStack>
                    </XStack>

                    {/* Exercise Notes */}
                    {exercise.notes && (
                      <YStack
                        backgroundColor="#fef3c7"
                        p="$3"
                        borderRadius="$3"
                      >
                        <Text fontSize="$2" color="#92400e" fontWeight="600" mb="$1">
                          NOTE
                        </Text>
                        <Text fontSize="$3" color="#78350f">
                          {exercise.notes}
                        </Text>
                      </YStack>
                    )}
                  </YStack>
                </Card>
              ))}
            </YStack>
          </YStack>
        </ScrollView>

        {/* Fixed Start Button */}
        {!workout.completed && (
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
        )}
      </YStack>
    </SafeAreaView>
  );
}