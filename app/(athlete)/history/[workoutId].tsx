import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';
import { workoutSessionService, WorkoutSessionWithDetails } from '../../../services/workoutsession.service';

export default function WorkoutDetailPage() {
  const { workoutId } = useLocalSearchParams();
  const [session, setSession] = useState<WorkoutSessionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [workoutId]);

  const loadSession = async () => {
    if (typeof workoutId !== 'string') return;
    
    try {
      setLoading(true);
      const data = await workoutSessionService.getSessionDetails(workoutId);
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading workout details...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text fontSize="$5" fontWeight="bold" color="$gray12" textAlign="center">
            Workout Not Found
          </Text>
          <Button
            size="$4"
            backgroundColor="#7c3aed"
            color="white"
            onPress={handleBack}
            mt="$4"
          >
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Header */}
            <XStack ai="center" gap="$3">
              <Button
                size="$3"
                chromeless
                icon={ArrowLeft}
                onPress={handleBack}
              />
              <YStack f={1}>
                <Text fontSize="$7" fontWeight="bold" color="$gray12">
                  {session.name}
                </Text>
                <Text fontSize="$3" color="$gray10">
                  {formatDate(session.start_time)}
                </Text>
              </YStack>
            </XStack>

            {/* Workout Summary */}
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack gap="$3">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  Workout Summary
                </Text>
                <XStack gap="$4" jc="space-around">
                  <YStack ai="center" gap="$1">
                    <Clock size={24} color="#7c3aed" />
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      {session.duration_minutes || 0}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Minutes</Text>
                  </YStack>
                  <YStack ai="center" gap="$1">
                    <TrendingUp size={24} color="#7c3aed" />
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      {session.total_volume_lbs?.toLocaleString() || 0}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Total lbs</Text>
                  </YStack>
                  <YStack ai="center" gap="$1">
                    <Calendar size={24} color="#7c3aed" />
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      {session.exercises.length}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Exercises</Text>
                  </YStack>
                </XStack>
                <YStack gap="$1">
                  <Text fontSize="$2" color="$gray10">
                    Started: {formatTime(session.start_time)}
                  </Text>
                  {session.end_time && (
                    <Text fontSize="$2" color="$gray10">
                      Finished: {formatTime(session.end_time)}
                    </Text>
                  )}
                </YStack>
              </YStack>
            </Card>

            {/* Exercises */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Exercises
              </Text>
              {session.exercises.map((exercise, index) => (
                <Card key={exercise.id} elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$3">
                    <XStack ai="center" jc="space-between">
                      <YStack gap="$1" f={1}>
                        <Text fontSize="$2" color="$gray10">
                          Exercise {index + 1}
                        </Text>
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {exercise.exercise.name}
                        </Text>
                        <Text fontSize="$2" color="$gray10" textTransform="capitalize">
                          {exercise.exercise.category}
                        </Text>
                      </YStack>
                    </XStack>

                    {/* Sets */}
                    {exercise.sets.length > 0 && (
                      <YStack gap="$2">
                        <Text fontSize="$3" fontWeight="600" color="$gray11">
                          Sets
                        </Text>
                        {exercise.sets.map((set) => (
                          <XStack
                            key={set.id}
                            ai="center"
                            jc="space-between"
                            p="$2"
                            backgroundColor="#f9fafb"
                            borderRadius="$2"
                          >
                            <Text fontSize="$3" color="$gray10" minWidth={60}>
                              Set {set.set_number}
                            </Text>
                            <XStack gap="$3">
                              <Text fontSize="$3" fontWeight="600" color="$gray12">
                                {set.weight_lbs} lbs
                              </Text>
                              <Text fontSize="$3" color="$gray10">×</Text>
                              <Text fontSize="$3" fontWeight="600" color="$gray12">
                                {set.reps} reps
                              </Text>
                              {set.rpe && (
                                <>
                                  <Text fontSize="$3" color="$gray10">@</Text>
                                  <Text fontSize="$3" fontWeight="600" color="#7c3aed">
                                    RPE {set.rpe}
                                  </Text>
                                </>
                              )}
                            </XStack>
                          </XStack>
                        ))}
                      </YStack>
                    )}

                    {exercise.notes && (
                      <YStack gap="$1">
                        <Text fontSize="$3" fontWeight="600" color="$gray11">
                          Notes
                        </Text>
                        <Text fontSize="$3" color="$gray10">
                          {exercise.notes}
                        </Text>
                      </YStack>
                    )}
                  </YStack>
                </Card>
              ))}
            </YStack>

            {/* Workout Notes */}
            {session.notes && (
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Workout Notes
                  </Text>
                  <Text fontSize="$3" color="$gray10">
                    {session.notes}
                  </Text>
                </YStack>
              </Card>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}