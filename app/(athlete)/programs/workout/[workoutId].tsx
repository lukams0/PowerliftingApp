import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Dumbbell, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';
import { programService } from '../../../../services/program.service';
import type { Workout, WorkoutExercise } from '../../../../services/program.service';

export default function WorkoutDetailPage() {
  const { workoutId } = useLocalSearchParams();
  const [workout, setWorkout] = useState<(Workout & {
    exercises: (WorkoutExercise & {
      exercise: { id: string; name: string; category: string };
    })[];
  }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkout();
  }, [workoutId]);

  const loadWorkout = async () => {
    if (!workoutId) return;

    try {
      setLoading(true);
      const workoutData = await programService.getWorkoutDetails(workoutId as string);
      setWorkout(workoutData);
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading workout...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text fontSize="$5" color="$gray11" textAlign="center">
            Workout not found
          </Text>
          <Button mt="$4" onPress={() => router.back()}>
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

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
              {workout.week_number ? `Week ${workout.week_number}` : 'Template Workout'}
              {workout.day_of_week && ` • ${workout.day_of_week}`}
            </Text>
          </YStack>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4" pb="$24">
            {/* Workout Info Card */}
            <Card elevate size="$4" p="$4" backgroundColor="#7c3aed">
              <YStack gap="$3">
                <XStack ai="center" jc="space-between">
                  {workout.day_of_week && (
                    <XStack ai="center" gap="$2">
                      <Calendar size={20} color="white" />
                      <Text fontSize="$3" color="white" fontWeight="600">
                        {workout.day_of_week.toUpperCase()}
                      </Text>
                    </XStack>
                  )}
                </XStack>
                <XStack ai="center" gap="$4">
                  <XStack ai="center" gap="$2">
                    <Dumbbell size={18} color="white" />
                    <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                      {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                    </Text>
                  </XStack>
                  {workout.estimated_duration_minutes && (
                    <XStack ai="center" gap="$2">
                      <Clock size={18} color="white" />
                      <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                        ~{workout.estimated_duration_minutes} min
                      </Text>
                    </XStack>
                  )}
                </XStack>
              </YStack>
            </Card>

            {/* Workout Description */}
            {workout.description && (
              <Card elevate size="$4" p="$4" backgroundColor="#fef3c7">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="bold" color="#92400e">
                    Workout Notes
                  </Text>
                  <Text fontSize="$3" color="#78350f" lineHeight="$4">
                    {workout.description}
                  </Text>
                </YStack>
              </Card>
            )}

            {/* Exercise List */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Exercises
              </Text>

              {workout.exercises.map((workoutExercise, index) => (
                <Card
                  key={workoutExercise.id}
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
                          {workoutExercise.exercise_order}
                        </Text>
                      </XStack>
                      <YStack f={1}>
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {workoutExercise.exercise.name}
                        </Text>
                        <Text fontSize="$2" color="$gray10" textTransform="capitalize">
                          {workoutExercise.exercise.category}
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
                          {workoutExercise.target_sets}
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
                          {workoutExercise.target_reps}
                        </Text>
                      </XStack>
                      {workoutExercise.target_weight_lbs && (
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
                            {workoutExercise.target_weight_lbs} lbs
                          </Text>
                        </XStack>
                      )}
                    </XStack>

                    {/* RPE and Rest */}
                    <XStack gap="$3" flexWrap="wrap">
                      {workoutExercise.target_rpe && (
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
                            {workoutExercise.target_rpe}
                          </Text>
                        </XStack>
                      )}
                      {workoutExercise.rest_seconds && (
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
                            {Math.floor(workoutExercise.rest_seconds / 60)}:{String(workoutExercise.rest_seconds % 60).padStart(2, '0')} rest
                          </Text>
                        </XStack>
                      )}
                    </XStack>

                    {/* Exercise Notes */}
                    {workoutExercise.notes && (
                      <YStack
                        backgroundColor="#fef3c7"
                        p="$3"
                        borderRadius="$3"
                      >
                        <Text fontSize="$2" color="#92400e" fontWeight="600" mb="$1">
                          NOTE
                        </Text>
                        <Text fontSize="$3" color="#78350f">
                          {workoutExercise.notes}
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
      </YStack>
    </SafeAreaView>
  );
}